package com.ems.config;

import com.ems.model.*;
import com.ems.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      EmployeeRepository employeeRepository,
                      DepartmentRepository departmentRepository,
                      AttendanceRepository attendanceRepository,
                      LeaveRequestRepository leaveRequestRepository,
                      NotificationRepository notificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDepartments();
        seedEmployees();
        seedAttendance();
        seedLeaves();
        seedNotifications();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@ems.com")) {
            User admin = new User(
                    "System Administrator",
                    "admin@ems.com",
                    "+1-555-0100",
                    passwordEncoder.encode("admin123"),
                    Role.ROLE_ADMIN
            );
            admin.setEmployeeRefId("EMP-1001");
            userRepository.save(admin);
            System.out.println(">>> Seeded default Admin: admin@ems.com / admin123");
        }

        if (!userRepository.existsByEmail("john.doe@ems.com")) {
            User user = new User(
                    "John Doe",
                    "john.doe@ems.com",
                    "+1-555-0101",
                    passwordEncoder.encode("user123"),
                    Role.ROLE_USER
            );
            user.setEmployeeRefId("EMP-1002");
            userRepository.save(user);
            System.out.println(">>> Seeded default User: john.doe@ems.com / user123");
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(List.of(
                    new Department("Engineering", "ENG", "Software engineering, DevOps, and platform architecture", "Sarah Connor"),
                    new Department("Human Resources", "HR", "Talent acquisition, employee engagement, and payroll", "Jessica Miller"),
                    new Department("Marketing", "MKT", "Brand strategy, growth marketing, and communications", "David Chang"),
                    new Department("Finance", "FIN", "Corporate accounting, tax, budget, and financial planning", "Robert Vance"),
                    new Department("Sales", "SLS", "Global enterprise sales and client partnerships", "Michael Scott"),
                    new Department("Operations", "OPS", "Workplace facilities, logistics, and legal compliance", "Pam Beesly")
            ));
            System.out.println(">>> Seeded 6 default departments");
        }
    }

    private void seedEmployees() {
        if (employeeRepository.count() == 0) {
            Employee emp1 = new Employee();
            emp1.setEmployeeId("EMP-1001");
            emp1.setFullName("System Administrator");
            emp1.setEmail("admin@ems.com");
            emp1.setPhone("+1-555-0100");
            emp1.setGender("Other");
            emp1.setDob(LocalDate.of(1988, 5, 12));
            emp1.setAddress("100 Innovation Way, Tech City, CA");
            emp1.setDepartment("Engineering");
            emp1.setDesignation("Chief Technology Officer");
            emp1.setJoiningDate(LocalDate.of(2021, 1, 15));
            emp1.setSalary(145000.0);
            emp1.setStatus("ACTIVE");
            emp1.setProfilePhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&fit=crop&crop=faces");

            Employee emp2 = new Employee();
            emp2.setEmployeeId("EMP-1002");
            emp2.setFullName("John Doe");
            emp2.setEmail("john.doe@ems.com");
            emp2.setPhone("+1-555-0101");
            emp2.setGender("Male");
            emp2.setDob(LocalDate.of(1993, 8, 22));
            emp2.setAddress("42 Blossom Street, San Francisco, CA");
            emp2.setDepartment("Engineering");
            emp2.setDesignation("Senior Full Stack Developer");
            emp2.setJoiningDate(LocalDate.of(2022, 3, 10));
            emp2.setSalary(98000.0);
            emp2.setStatus("ACTIVE");
            emp2.setProfilePhoto("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&fit=crop&crop=faces");

            Employee emp3 = new Employee();
            emp3.setEmployeeId("EMP-1003");
            emp3.setFullName("Sophia Rodriguez");
            emp3.setEmail("sophia.rodriguez@ems.com");
            emp3.setPhone("+1-555-0102");
            emp3.setGender("Female");
            emp3.setDob(LocalDate.of(1995, 11, 4));
            emp3.setAddress("78 Ocean View Ave, Seattle, WA");
            emp3.setDepartment("Human Resources");
            emp3.setDesignation("HR Business Partner");
            emp3.setJoiningDate(LocalDate.of(2022, 7, 1));
            emp3.setSalary(78000.0);
            emp3.setStatus("ACTIVE");
            emp3.setProfilePhoto("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&fit=crop&crop=faces");

            Employee emp4 = new Employee();
            emp4.setEmployeeId("EMP-1004");
            emp4.setFullName("Alexander Chen");
            emp4.setEmail("alex.chen@ems.com");
            emp4.setPhone("+1-555-0103");
            emp4.setGender("Male");
            emp4.setDob(LocalDate.of(1991, 2, 19));
            emp4.setAddress("312 Pinecone Lane, Austin, TX");
            emp4.setDepartment("Marketing");
            emp4.setDesignation("Lead Growth Strategist");
            emp4.setJoiningDate(LocalDate.of(2023, 1, 12));
            emp4.setSalary(88000.0);
            emp4.setStatus("ACTIVE");
            emp4.setProfilePhoto("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&fit=crop&crop=faces");

            Employee emp5 = new Employee();
            emp5.setEmployeeId("EMP-1005");
            emp5.setFullName("Emma Watson");
            emp5.setEmail("emma.watson@ems.com");
            emp5.setPhone("+1-555-0104");
            emp5.setGender("Female");
            emp5.setDob(LocalDate.of(1996, 4, 15));
            emp5.setAddress("12 Cambridge Court, Boston, MA");
            emp5.setDepartment("Finance");
            emp5.setDesignation("Financial Analyst");
            emp5.setJoiningDate(LocalDate.of(2023, 5, 20));
            emp5.setSalary(82000.0);
            emp5.setStatus("ACTIVE");
            emp5.setProfilePhoto("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&fit=crop&crop=faces");

            Employee emp6 = new Employee();
            emp6.setEmployeeId("EMP-1006");
            emp6.setFullName("Lucas Silva");
            emp6.setEmail("lucas.silva@ems.com");
            emp6.setPhone("+1-555-0105");
            emp6.setGender("Male");
            emp6.setDob(LocalDate.of(1990, 9, 30));
            emp6.setAddress("900 Maple Ridge, Denver, CO");
            emp6.setDepartment("Sales");
            emp6.setDesignation("Senior Enterprise Account Exec");
            emp6.setJoiningDate(LocalDate.of(2023, 9, 1));
            emp6.setSalary(95000.0);
            emp6.setStatus("ACTIVE");
            emp6.setProfilePhoto("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&fit=crop&crop=faces");

            employeeRepository.saveAll(List.of(emp1, emp2, emp3, emp4, emp5, emp6));
            System.out.println(">>> Seeded 6 initial employee profiles");
        }
    }

    private void seedAttendance() {
        if (attendanceRepository.count() == 0) {
            LocalDate today = LocalDate.now();
            
            Attendance a1 = new Attendance();
            a1.setEmployeeId("EMP-1001");
            a1.setEmployeeName("System Administrator");
            a1.setUserEmail("admin@ems.com");
            a1.setDate(today);
            a1.setCheckInTime(LocalTime.of(8, 55));
            a1.setStatus("PRESENT");
            a1.setNotes("Office check-in");

            Attendance a2 = new Attendance();
            a2.setEmployeeId("EMP-1002");
            a2.setEmployeeName("John Doe");
            a2.setUserEmail("john.doe@ems.com");
            a2.setDate(today);
            a2.setCheckInTime(LocalTime.of(9, 10));
            a2.setStatus("PRESENT");
            a2.setNotes("Remote check-in");

            attendanceRepository.saveAll(List.of(a1, a2));
        }
    }

    private void seedLeaves() {
        if (leaveRequestRepository.count() == 0) {
            LeaveRequest lr1 = new LeaveRequest();
            lr1.setEmployeeId("EMP-1002");
            lr1.setEmployeeName("John Doe");
            lr1.setUserEmail("john.doe@ems.com");
            lr1.setLeaveType("Annual");
            lr1.setStartDate(LocalDate.now().plusDays(5));
            lr1.setEndDate(LocalDate.now().plusDays(7));
            lr1.setTotalDays(3);
            lr1.setReason("Family vacation trip");
            lr1.setStatus("PENDING");
            lr1.setAppliedAt(LocalDateTime.now().minusHours(4));

            LeaveRequest lr2 = new LeaveRequest();
            lr2.setEmployeeId("EMP-1003");
            lr2.setEmployeeName("Sophia Rodriguez");
            lr2.setUserEmail("sophia.rodriguez@ems.com");
            lr2.setLeaveType("Sick");
            lr2.setStartDate(LocalDate.now().minusDays(2));
            lr2.setEndDate(LocalDate.now().minusDays(1));
            lr2.setTotalDays(2);
            lr2.setReason("Fever and medical consultation");
            lr2.setStatus("APPROVED");
            lr2.setAdminRemarks("Take care and get well soon");
            lr2.setAppliedAt(LocalDateTime.now().minusDays(3));
            lr2.setReviewedAt(LocalDateTime.now().minusDays(2));

            leaveRequestRepository.saveAll(List.of(lr1, lr2));
        }
    }

    private void seedNotifications() {
        if (notificationRepository.count() == 0) {
            notificationRepository.saveAll(List.of(
                    new Notification("ADMIN", "System Initialized", "The Employee Management System database was successfully initialized.", "INFO"),
                    new Notification("ADMIN", "New Leave Request Pending", "John Doe requested 3 days of Annual leave.", "LEAVE"),
                    new Notification("john.doe@ems.com", "Welcome to EMS", "Welcome to your employee portal. Punch in your attendance daily.", "SUCCESS")
            ));
        }
    }
}
