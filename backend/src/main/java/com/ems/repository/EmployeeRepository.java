package com.ems.repository;

import com.ems.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    Optional<Employee> findByEmployeeId(String employeeId);
    Optional<Employee> findByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    
    List<Employee> findByDepartment(String department);
    List<Employee> findByStatus(String status);
    long countByStatus(String status);
    
    @Query("{ $or: [ " +
           "{ 'fullName': { $regex: ?0, $options: 'i' } }, " +
           "{ 'email': { $regex: ?0, $options: 'i' } }, " +
           "{ 'employeeId': { $regex: ?0, $options: 'i' } }, " +
           "{ 'designation': { $regex: ?0, $options: 'i' } } " +
           "] }")
    List<Employee> searchEmployees(String keyword);
}
