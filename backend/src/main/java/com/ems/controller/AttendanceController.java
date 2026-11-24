package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.model.Attendance;
import com.ems.service.AttendanceService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<Attendance>> checkIn(Authentication authentication,
                                                           @RequestBody(required = false) Map<String, String> body) {
        String notes = (body != null) ? body.get("notes") : "";
        Attendance attendance = attendanceService.checkIn(authentication.getName(), notes);
        return ResponseEntity.ok(ApiResponse.success("Checked in successfully at " + attendance.getCheckInTime(), attendance));
    }

    @PostMapping("/check-out")
    public ResponseEntity<ApiResponse<Attendance>> checkOut(Authentication authentication,
                                                            @RequestBody(required = false) Map<String, String> body) {
        String notes = (body != null) ? body.get("notes") : "";
        Attendance attendance = attendanceService.checkOut(authentication.getName(), notes);
        return ResponseEntity.ok(ApiResponse.success("Checked out successfully at " + attendance.getCheckOutTime(), attendance));
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<Attendance>> getTodayAttendance(Authentication authentication) {
        Optional<Attendance> today = attendanceService.getTodayAttendance(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved", today.orElse(null)));
    }

    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<List<Attendance>>> getMyAttendance(Authentication authentication) {
        List<Attendance> history = attendanceService.getUserAttendanceHistory(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Attendance history retrieved", history));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Attendance>>> getAllAttendance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Attendance> list = attendanceService.getAllAttendance(date);
        return ResponseEntity.ok(ApiResponse.success("Attendance records retrieved", list));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<Attendance>>> getAttendanceRange(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> list = attendanceService.getAttendanceRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Attendance range records retrieved", list));
    }
}
