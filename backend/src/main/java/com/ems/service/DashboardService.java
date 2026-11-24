package com.ems.service;

import com.ems.dto.DashboardStatsDto;
import com.ems.model.Employee;
import com.ems.model.LeaveRequest;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public DashboardService(EmployeeRepository employeeRepository,
                            DepartmentRepository departmentRepository,
                            AttendanceRepository attendanceRepository,
                            LeaveRequestRepository leaveRequestRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Employee> allEmployees = employeeRepository.findAll();
        stats.setTotalEmployees(allEmployees.size());
        stats.setActiveEmployees(allEmployees.stream().filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus())).count());
        stats.setInactiveEmployees(allEmployees.stream().filter(e -> !"ACTIVE".equalsIgnoreCase(e.getStatus())).count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setPendingLeaves(leaveRequestRepository.countByStatus("PENDING"));
        stats.setPresentToday(attendanceRepository.countByDateAndStatus(LocalDate.now(), "PRESENT"));

        // Department-wise distribution
        Map<String, Long> deptDist = allEmployees.stream()
                .filter(e -> e.getDepartment() != null && !e.getDepartment().trim().isEmpty())
                .collect(Collectors.groupingBy(Employee::getDepartment, Collectors.counting()));
        stats.setDepartmentDistribution(deptDist);

        // Monthly joining trend (past 6 months)
        Map<String, Long> monthlyTrend = new LinkedHashMap<>();
        LocalDate now = LocalDate.now();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            String label = monthDate.format(monthFormatter);
            long count = allEmployees.stream()
                    .filter(e -> e.getJoiningDate() != null &&
                            e.getJoiningDate().getYear() == monthDate.getYear() &&
                            e.getJoiningDate().getMonth() == monthDate.getMonth())
                    .count();
            monthlyTrend.put(label, count);
        }
        stats.setMonthlyJoiningTrend(monthlyTrend);

        // Recent activities
        List<Map<String, Object>> activities = new ArrayList<>();
        
        // Add recent leaves
        List<LeaveRequest> recentLeaves = leaveRequestRepository.findAllByOrderByAppliedAtDesc();
        recentLeaves.stream().limit(5).forEach(leave -> {
            Map<String, Object> act = new HashMap<>();
            act.put("id", leave.getId());
            act.put("title", "Leave Request: " + leave.getEmployeeName());
            act.put("description", leave.getLeaveType() + " leave (" + leave.getTotalDays() + " days) - " + leave.getStatus());
            act.put("time", leave.getAppliedAt());
            act.put("type", "LEAVE");
            activities.add(act);
        });

        // Add recent hires
        allEmployees.stream()
                .sorted(Comparator.comparing(Employee::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .forEach(emp -> {
                    Map<String, Object> act = new HashMap<>();
                    act.put("id", emp.getId());
                    act.put("title", "New Employee Joined: " + emp.getFullName());
                    act.put("description", emp.getDesignation() + " in " + emp.getDepartment() + " (" + emp.getEmployeeId() + ")");
                    act.put("time", emp.getCreatedAt());
                    act.put("type", "EMPLOYEE");
                    activities.add(act);
                });

        stats.setRecentActivities(activities);
        return stats;
    }
}
