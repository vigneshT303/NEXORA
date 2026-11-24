package com.ems.controller;

import com.ems.dto.ApiResponse;
import com.ems.model.Department;
import com.ems.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        List<Department> list = departmentService.getAllDepartments();
        return ResponseEntity.ok(ApiResponse.success("Departments retrieved", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDepartmentById(@PathVariable String id) {
        Map<String, Object> details = departmentService.getDepartmentDetailsWithEmployees(id);
        return ResponseEntity.ok(ApiResponse.success("Department details retrieved", details));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@Valid @RequestBody Department department) {
        Department created = departmentService.createDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Department created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(@PathVariable String id,
                                                                    @RequestBody Department department) {
        Department updated = departmentService.updateDepartment(id, department);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("Department deleted successfully"));
    }
}
