package com.ems.service;

import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.model.Department;
import com.ems.model.Employee;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(DepartmentRepository departmentRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(String id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    public Department createDepartment(Department department) {
        if (departmentRepository.existsByName(department.getName())) {
            throw new BadRequestException("Department '" + department.getName() + "' already exists");
        }
        department.setCreatedAt(LocalDateTime.now());
        return departmentRepository.save(department);
    }

    public Department updateDepartment(String id, Department updated) {
        Department existing = getDepartmentById(id);

        if (updated.getName() != null && !updated.getName().equalsIgnoreCase(existing.getName())) {
            if (departmentRepository.existsByName(updated.getName())) {
                throw new BadRequestException("Department with name '" + updated.getName() + "' already exists");
            }
            existing.setName(updated.getName());
        }

        if (updated.getCode() != null) existing.setCode(updated.getCode());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getManagerName() != null) existing.setManagerName(updated.getManagerName());

        return departmentRepository.save(existing);
    }

    public void deleteDepartment(String id) {
        Department department = getDepartmentById(id);
        long employeeCount = employeeRepository.findByDepartment(department.getName()).size();
        if (employeeCount > 0) {
            throw new BadRequestException("Cannot delete department with " + employeeCount + " active employees assigned. Reassign employees first.");
        }
        departmentRepository.delete(department);
    }

    public Map<String, Object> getDepartmentDetailsWithEmployees(String id) {
        Department dept = getDepartmentById(id);
        List<Employee> employees = employeeRepository.findByDepartment(dept.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("department", dept);
        response.put("employees", employees);
        response.put("employeeCount", employees.size());
        return response;
    }
}
