package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.model.LeaveRequest;
import com.ems.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequest>> applyLeave(Authentication authentication,
                                                                @Valid @RequestBody LeaveRequest leaveRequest) {
        LeaveRequest created = leaveService.applyLeave(authentication.getName(), leaveRequest);
        return ResponseEntity.ok(ApiResponse.success("Leave application submitted successfully", created));
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getMyLeaves(Authentication authentication) {
        List<LeaveRequest> list = leaveService.getUserLeaves(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Your leaves retrieved", list));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getAllLeaves() {
        List<LeaveRequest> list = leaveService.getAllLeaves();
        return ResponseEntity.ok(ApiResponse.success("All leave applications retrieved", list));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequest>> approveLeave(@PathVariable String id,
                                                                  @RequestBody(required = false) Map<String, String> body) {
        String remarks = (body != null) ? body.get("remarks") : "Approved by administrator";
        LeaveRequest approved = leaveService.approveLeave(id, remarks);
        return ResponseEntity.ok(ApiResponse.success("Leave request approved", approved));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequest>> rejectLeave(@PathVariable String id,
                                                                 @RequestBody(required = false) Map<String, String> body) {
        String remarks = (body != null) ? body.get("remarks") : "Rejected by administrator";
        LeaveRequest rejected = leaveService.rejectLeave(id, remarks);
        return ResponseEntity.ok(ApiResponse.success("Leave request rejected", rejected));
    }
}
