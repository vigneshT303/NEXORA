package com.ems.dto;

import com.ems.model.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String fullName;
    private String email;
    private Role role;
    private String employeeId;

    public AuthResponse() {}

    public AuthResponse(String token, String id, String fullName, String email, Role role, String employeeId) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.employeeId = employeeId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
}
