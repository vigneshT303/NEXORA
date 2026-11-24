package com.ems.service;

import com.ems.dto.AuthRequest;
import com.ems.dto.AuthResponse;
import com.ems.dto.ChangePasswordRequest;
import com.ems.dto.ForgotPasswordRequest;
import com.ems.dto.RegisterRequest;
import com.ems.exception.BadRequestException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.model.Employee;
import com.ems.model.Role;
import com.ems.model.User;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import com.ems.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository,
                       EmployeeRepository employeeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       NotificationService notificationService) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.notificationService = notificationService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists");
        }

        // New registrations automatically receive Normal User role
        User user = new User(
                request.getFullName(),
                request.getEmail(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                Role.ROLE_USER
        );

        // Check if an employee record already matches this email
        Optional<Employee> empOpt = employeeRepository.findByEmail(request.getEmail());
        empOpt.ifPresent(employee -> user.setEmployeeRefId(employee.getEmployeeId()));

        User savedUser = userRepository.save(user);

        // Create welcome notification
        notificationService.createNotification(
                savedUser.getEmail(),
                "Welcome to EMS",
                "Your account has been successfully created. Explore your dashboard and track attendance.",
                "SUCCESS"
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtTokenProvider.generateToken(
                userDetails,
                savedUser.getRole().name(),
                savedUser.getFullName(),
                savedUser.getEmployeeRefId()
        );

        return new AuthResponse(token, savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(), savedUser.getRole(), savedUser.getEmployeeRefId());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtTokenProvider.generateToken(
                userDetails,
                user.getRole().name(),
                user.getFullName(),
                user.getEmployeeRefId()
        );

        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole(), user.getEmployeeRefId());
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.createNotification(
                user.getEmail(),
                "Password Reset",
                "Your password has been successfully updated.",
                "INFO"
        );
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.createNotification(
                user.getEmail(),
                "Password Changed",
                "Your security password was changed successfully.",
                "INFO"
        );
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
