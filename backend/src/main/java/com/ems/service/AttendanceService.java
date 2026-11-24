package com.ems.service;

import com.ems.exception.BadRequestException;
import com.ems.model.Attendance;
import com.ems.model.Employee;
import com.ems.model.User;
import com.ems.repository.AttendanceRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             EmployeeRepository employeeRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public Attendance checkIn(String email, String notes) {
        LocalDate today = LocalDate.now();

        Optional<Attendance> existing = attendanceRepository.findByUserEmailAndDate(email, today);
        if (existing.isPresent()) {
            throw new BadRequestException("You have already checked in for today at " + existing.get().getCheckInTime());
        }

        User user = userRepository.findByEmail(email).orElse(null);
        String employeeName = (user != null) ? user.getFullName() : "Employee";
        String employeeId = (user != null && user.getEmployeeRefId() != null) ? user.getEmployeeRefId() : "EMP-USER";

        if (user != null) {
            Optional<Employee> empOpt = employeeRepository.findByEmail(email);
            if (empOpt.isPresent()) {
                employeeId = empOpt.get().getEmployeeId();
                employeeName = empOpt.get().getFullName();
            }
        }

        Attendance attendance = new Attendance();
        attendance.setUserEmail(email);
        attendance.setEmployeeId(employeeId);
        attendance.setEmployeeName(employeeName);
        attendance.setDate(today);
        attendance.setCheckInTime(LocalTime.now());
        attendance.setStatus("PRESENT");
        attendance.setNotes(notes);

        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(String email, String notes) {
        LocalDate today = LocalDate.now();

        Attendance attendance = attendanceRepository.findByUserEmailAndDate(email, today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today. Please check in first."));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("You have already checked out for today at " + attendance.getCheckOutTime());
        }

        LocalTime checkOutTime = LocalTime.now();
        attendance.setCheckOutTime(checkOutTime);

        if (notes != null && !notes.trim().isEmpty()) {
            attendance.setNotes((attendance.getNotes() != null ? attendance.getNotes() + " | " : "") + notes);
        }

        // Calculate hours worked; if less than 4 hours, mark as HALF_DAY
        if (attendance.getCheckInTime() != null) {
            long minutes = Duration.between(attendance.getCheckInTime(), checkOutTime).toMinutes();
            if (minutes < 240) {
                attendance.setStatus("HALF_DAY");
            }
        }

        return attendanceRepository.save(attendance);
    }

    public Optional<Attendance> getTodayAttendance(String email) {
        return attendanceRepository.findByUserEmailAndDate(email, LocalDate.now());
    }

    public List<Attendance> getUserAttendanceHistory(String email) {
        return attendanceRepository.findByUserEmailOrderByDateDesc(email);
    }

    public List<Attendance> getAllAttendance(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return attendanceRepository.findByDate(date);
    }

    public List<Attendance> getAttendanceRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }
}
