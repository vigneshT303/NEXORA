package com.ems.service;

import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.model.Employee;
import com.ems.model.LeaveRequest;
import com.ems.model.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRequestRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    public LeaveService(LeaveRequestRepository leaveRequestRepository,
                        UserRepository userRepository,
                        EmployeeRepository employeeRepository,
                        NotificationService notificationService) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.notificationService = notificationService;
    }

    public LeaveRequest applyLeave(String email, LeaveRequest request) {
        if (request.getStartDate() == null || request.getEndDate() == null) {
            throw new BadRequestException("Start date and End date are required");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be earlier than start date");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        request.setTotalDays((int) days);

        User user = userRepository.findByEmail(email).orElse(null);
        String name = (user != null) ? user.getFullName() : "Employee";
        String empId = (user != null && user.getEmployeeRefId() != null) ? user.getEmployeeRefId() : "EMP-USER";

        if (user != null) {
            Optional<Employee> empOpt = employeeRepository.findByEmail(email);
            if (empOpt.isPresent()) {
                empId = empOpt.get().getEmployeeId();
                name = empOpt.get().getFullName();
            }
        }

        request.setUserEmail(email);
        request.setEmployeeName(name);
        request.setEmployeeId(empId);
        request.setStatus("PENDING");
        request.setAppliedAt(LocalDateTime.now());

        LeaveRequest saved = leaveRequestRepository.save(request);

        // Notify Admins
        notificationService.createNotification(
                "ADMIN",
                "New Leave Request",
                name + " (" + empId + ") has applied for " + request.getLeaveType() + " leave (" + days + " days).",
                "LEAVE"
        );

        return saved;
    }

    public List<LeaveRequest> getUserLeaves(String email) {
        return leaveRequestRepository.findByUserEmailOrderByAppliedAtDesc(email);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAllByOrderByAppliedAtDesc();
    }

    public LeaveRequest approveLeave(String id, String remarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        leave.setStatus("APPROVED");
        leave.setAdminRemarks(remarks);
        leave.setReviewedAt(LocalDateTime.now());

        LeaveRequest updated = leaveRequestRepository.save(leave);

        // Notify employee
        notificationService.createNotification(
                leave.getUserEmail(),
                "Leave Approved",
                "Your " + leave.getLeaveType() + " leave request for " + leave.getTotalDays() + " day(s) was APPROVED. " + (remarks != null ? "Remarks: " + remarks : ""),
                "SUCCESS"
        );

        return updated;
    }

    public LeaveRequest rejectLeave(String id, String remarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + id));

        leave.setStatus("REJECTED");
        leave.setAdminRemarks(remarks);
        leave.setReviewedAt(LocalDateTime.now());

        LeaveRequest updated = leaveRequestRepository.save(leave);

        // Notify employee
        notificationService.createNotification(
                leave.getUserEmail(),
                "Leave Rejected",
                "Your " + leave.getLeaveType() + " leave request was REJECTED. " + (remarks != null ? "Reason: " + remarks : ""),
                "WARNING"
        );

        return updated;
    }
}
