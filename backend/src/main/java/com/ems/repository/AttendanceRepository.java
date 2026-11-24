package com.ems.repository;

import com.ems.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    Optional<Attendance> findByEmployeeIdAndDate(String employeeId, LocalDate date);
    Optional<Attendance> findByUserEmailAndDate(String userEmail, LocalDate date);
    List<Attendance> findByEmployeeIdOrderByDateDesc(String employeeId);
    List<Attendance> findByUserEmailOrderByDateDesc(String userEmail);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);
    long countByDateAndStatus(LocalDate date, String status);
}
