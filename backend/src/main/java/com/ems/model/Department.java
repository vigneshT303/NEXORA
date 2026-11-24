package com.ems.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "departments")
public class Department {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    
    private String code;
    private String description;
    private String managerName;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Department() {}

    public Department(String name, String code, String description, String managerName) {
        this.name = name;
        this.code = code;
        this.description = description;
        this.managerName = managerName;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
