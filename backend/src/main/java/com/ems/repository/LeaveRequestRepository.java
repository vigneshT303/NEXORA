package com.ems.repository;

import com.ems.model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByUserEmailOrderByAppliedAtDesc(String userEmail);
    List<LeaveRequest> findByEmployeeIdOrderByAppliedAtDesc(String employeeId);
    List<LeaveRequest> findByStatusOrderByAppliedAtDesc(String status);
    List<LeaveRequest> findAllByOrderByAppliedAtDesc();
    long countByStatus(String status);
}
