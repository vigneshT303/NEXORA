package com.ems.service;

import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.model.Employee;
import com.ems.model.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public EmployeeService(EmployeeRepository employeeRepository,
                           UserRepository userRepository,
                           NotificationService notificationService) {
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public synchronized String generateNextEmployeeId() {
        long count = employeeRepository.count();
        long nextNum = 1001 + count;
        String empId = "EMP-" + nextNum;
        while (employeeRepository.existsByEmployeeId(empId)) {
            nextNum++;
            empId = "EMP-" + nextNum;
        }
        return empId;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee getEmployeeByEmployeeId(String employeeId) {
        return employeeRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with Employee ID: " + employeeId));
    }

    public Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
    }

    public Employee createEmployee(Employee employee) {
        if (employee.getEmail() != null && employeeRepository.existsByEmail(employee.getEmail())) {
            throw new BadRequestException("An employee with email '" + employee.getEmail() + "' already exists");
        }

        if (employee.getEmployeeId() == null || employee.getEmployeeId().trim().isEmpty()) {
            employee.setEmployeeId(generateNextEmployeeId());
        } else if (employeeRepository.existsByEmployeeId(employee.getEmployeeId())) {
            throw new BadRequestException("Employee ID '" + employee.getEmployeeId() + "' already exists");
        }

        if (employee.getStatus() == null || employee.getStatus().trim().isEmpty()) {
            employee.setStatus("ACTIVE");
        }

        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        Employee saved = employeeRepository.save(employee);

        // Check if there is an existing User with this email, and link the employeeRefId
        Optional<User> userOpt = userRepository.findByEmail(saved.getEmail());
        userOpt.ifPresent(user -> {
            user.setEmployeeRefId(saved.getEmployeeId());
            userRepository.save(user);
        });

        // Notify
        notificationService.createNotification(
                "ADMIN",
                "New Employee Added",
                "Employee " + saved.getFullName() + " (" + saved.getEmployeeId() + ") was added to " + saved.getDepartment(),
                "EMPLOYEE"
        );

        return saved;
    }

    public Employee updateEmployee(String id, Employee updatedData) {
        Employee existing = getEmployeeById(id);

        if (updatedData.getEmail() != null && !updatedData.getEmail().equalsIgnoreCase(existing.getEmail())) {
            if (employeeRepository.existsByEmail(updatedData.getEmail())) {
                throw new BadRequestException("Email is already used by another employee");
            }
            existing.setEmail(updatedData.getEmail());
        }

        if (updatedData.getFullName() != null) existing.setFullName(updatedData.getFullName());
        if (updatedData.getPhone() != null) existing.setPhone(updatedData.getPhone());
        if (updatedData.getGender() != null) existing.setGender(updatedData.getGender());
        if (updatedData.getDob() != null) existing.setDob(updatedData.getDob());
        if (updatedData.getAddress() != null) existing.setAddress(updatedData.getAddress());
        if (updatedData.getDepartment() != null) existing.setDepartment(updatedData.getDepartment());
        if (updatedData.getDesignation() != null) existing.setDesignation(updatedData.getDesignation());
        if (updatedData.getJoiningDate() != null) existing.setJoiningDate(updatedData.getJoiningDate());
        if (updatedData.getSalary() != null) existing.setSalary(updatedData.getSalary());
        if (updatedData.getStatus() != null) existing.setStatus(updatedData.getStatus());
        if (updatedData.getProfilePhoto() != null) existing.setProfilePhoto(updatedData.getProfilePhoto());

        existing.setUpdatedAt(LocalDateTime.now());
        return employeeRepository.save(existing);
    }

    public void deleteEmployee(String id) {
        Employee employee = getEmployeeById(id);
        employeeRepository.delete(employee);
    }

    public List<Employee> searchAndFilter(String keyword, String department, String status) {
        List<Employee> list;
        if (keyword != null && !keyword.trim().isEmpty()) {
            list = employeeRepository.searchEmployees(keyword.trim());
        } else {
            list = employeeRepository.findAll();
        }

        return list.stream()
                .filter(emp -> department == null || department.trim().isEmpty() || "ALL".equalsIgnoreCase(department)
                        || emp.getDepartment() != null && emp.getDepartment().equalsIgnoreCase(department))
                .filter(emp -> status == null || status.trim().isEmpty() || "ALL".equalsIgnoreCase(status)
                        || emp.getStatus() != null && emp.getStatus().equalsIgnoreCase(status))
                .toList();
    }
}
