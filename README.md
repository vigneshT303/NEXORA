# EMS Pro - Enterprise Employee Management System

A full-stack, enterprise-grade Employee Management System crafted with **React.js**, **Java Spring Boot**, and **MongoDB**. Features a modern purple-themed UI, role-based access control (Admin & Normal User), real-time attendance punching, leave management workflows, full CRUD employee records, and interactive analytics.

---

## 🎨 Theme & Design System

The application is styled with a premium purple theme:
- **Primary Color:** `#6C3BCE`
- **Secondary Color:** `#8B5CF6`
- **Background Color:** `#F7F5FC`
- **Sidebar Background:** `#241044`
- **Cards Background:** `#FFFFFF`
- **Primary Text:** `#25213B`
- **Gradients:** `linear-gradient(135deg, #6C3BCE 0%, #8B5CF6 100%)`
- **Typography:** Plus Jakarta Sans
- **Responsiveness:** Full multi-device responsiveness (Desktop, Laptop, Tablet, Mobile) with a collapsible sidebar and mobile touch drawer.

---

## 🚀 Key Modules & Capabilities

1. **Authentication & Role-Based Access Control (RBAC):**
   - JWT-based authentication with BCrypt password encryption.
   - Roles:
     - `ROLE_ADMIN`: Complete system privileges, employee CRUD, department management, leave approvals/rejections, executive reports.
     - `ROLE_USER`: Self-service employee portal, profile viewer, daily attendance check-in/out, personal leave application.
   - Form validation, show/hide passwords, and protected route guards.

2. **Admin Dashboard:**
   - Real-time statistics: Total Headcount, Active Staff, On Leave, Departments, Pending Leaves, Present Today.
   - Interactive SVG Headcount Growth Chart (past 6 months).
   - Department Staff Distribution with proportional visual progress bars.
   - Recent Activities event log and new hire roster.

3. **User Self-Service Dashboard:**
   - Live local digital clock and greeting.
   - Real-time Attendance Punch In / Punch Out with optional task notes.
   - My Profile summary & Employee ID card.
   - Personal leave requests timeline.

4. **Employee Management (CRUD):**
   - **Create:** Auto-generated sequential Employee ID (`EMP-XXXX`), contact details, department, designation, salary, status, avatar URL.
   - **Read:** Directory view with live search, department filter, status filter, multi-criteria sorting, and responsive pagination.
   - **Update:** Edit existing employee records with validation.
   - **Delete:** Protected deletion with safety confirmation modal.
   - **Export:** One-click CSV export of the employee directory.

5. **Department Management:**
   - Create, edit, and delete departments.
   - Staff count tracking and protective check preventing deletion of departments with active staff.
   - Quick modal to view all employees belonging to a specific department.

6. **Attendance Management:**
   - Daily Punch In / Punch Out with timestamps.
   - Automatic half-day detection for shifts under 4 hours.
   - Daily records filtered by date for administrators.
   - Export attendance logs to CSV.

7. **Leave Management:**
   - Apply for leave: Annual, Casual, Sick, Maternity/Paternity, Emergency.
   - Duration auto-calculation based on date ranges.
   - Admin approval and rejection workflows with custom administrative remarks.
   - Live status badges (`PENDING`, `APPROVED`, `REJECTED`).

8. **Reports & Analytics:**
   - Workforce KPIs: Staff Headcount, Total Annual Payroll, Average Salary, Operational Units.
   - Departmental staffing proportion matrix.
   - Export comprehensive executive summary report to CSV.

9. **In-App Notifications:**
   - System announcements, leave status approvals/rejections, new employee alerts.
   - Navbar bell dropdown with unread badge and "Mark all as read".

10. **Profile & Security Settings:**
    - Personal details review.
    - Master password update with current password verification.
    - Notification preferences.

---

## 📂 Project Architecture

```
employee/
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/ems/
│           │   ├── EmployeeManagementApplication.java
│           │   ├── config/
│           │   │   ├── CorsConfig.java
│           │   │   └── DataSeeder.java
│           │   ├── controller/
│           │   │   ├── AuthController.java
│           │   │   ├── EmployeeController.java
│           │   │   ├── DepartmentController.java
│           │   │   ├── AttendanceController.java
│           │   │   ├── LeaveController.java
│           │   │   ├── DashboardController.java
│           │   │   └── NotificationController.java
│           │   ├── dto/
│           │   │   ├── ApiResponse.java
│           │   │   ├── AuthRequest.java
│           │   │   ├── AuthResponse.java
│           │   │   ├── ChangePasswordRequest.java
│           │   │   ├── DashboardStatsDto.java
│           │   │   ├── ForgotPasswordRequest.java
│           │   │   └── RegisterRequest.java
│           │   ├── exception/
│           │   │   ├── BadRequestException.java
│           │   │   ├── GlobalExceptionHandler.java
│           │   │   └── ResourceNotFoundException.java
│           │   ├── model/
│           │   │   ├── Attendance.java
│           │   │   ├── Department.java
│           │   │   ├── Employee.java
│           │   │   ├── LeaveRequest.java
│           │   │   ├── Notification.java
│           │   │   ├── Role.java
│           │   │   └── User.java
│           │   ├── repository/
│           │   │   ├── AttendanceRepository.java
│           │   │   ├── DepartmentRepository.java
│           │   │   ├── EmployeeRepository.java
│           │   │   ├── LeaveRequestRepository.java
│           │   │   ├── NotificationRepository.java
│           │   │   └── UserRepository.java
│           │   ├── security/
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   ├── JwtTokenProvider.java
│           │   │   ├── SecurityConfig.java
│           │   │   └── UserDetailsServiceImpl.java
│           │   └── service/
│           │       ├── AuthService.java
│           │       ├── AttendanceService.java
│           │       ├── DashboardService.java
│           │       ├── DepartmentService.java
│           │       ├── EmployeeService.java
│           │       ├── LeaveService.java
│           │       └── NotificationService.java
│           └── resources/
│               └── application.properties
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── api/
│       │   ├── axiosClient.js
│       │   ├── authApi.js
│       │   ├── employeeApi.js
│       │   ├── departmentApi.js
│       │   ├── attendanceApi.js
│       │   ├── leaveApi.js
│       │   └── dashboardApi.js
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Modal.jsx
│       │   ├── StatCard.jsx
│       │   └── Pagination.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── ForgotPassword.jsx
│           ├── AdminDashboard.jsx
│           ├── UserDashboard.jsx
│           ├── EmployeeList.jsx
│           ├── EmployeeForm.jsx
│           ├── EmployeeDetails.jsx
│           ├── DepartmentList.jsx
│           ├── AttendancePage.jsx
│           ├── LeavePage.jsx
│           ├── ReportsPage.jsx
│           ├── ProfilePage.jsx
│           ├── SettingsPage.jsx
│           └── NotFound.jsx
├── start-backend.bat
├── start-frontend.bat
├── start-all.bat
└── README.md
```

---

## 🔑 Default Credentials & Demo Accounts

On initial startup, `DataSeeder` automatically populates default accounts and baseline records:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **System Administrator** | `admin@ems.com` | `admin123` | Full access (CRUD employees, departments, approve leaves, stats) |
| **Normal Employee** | `john.doe@ems.com` | `user123` | Employee portal (Self profile, daily punch in/out, apply leaves) |

> 💡 *Quick demo login buttons are provided directly on the Login page for instant one-click testing.*

---

## 🛠️ Installation & Execution Instructions

### Prerequisites
1. **Java JDK 21+**
2. **Node.js (v18+) & npm**
3. **MongoDB** running locally on port `27017` (or MongoDB Atlas connection string configured in `application.properties`)
4. **Apache Maven** (or Maven wrapper)

---

### Step 1: Start MongoDB
Ensure MongoDB daemon is running locally on port 27017:
```bash
# Verify connection using mongosh:
mongosh "mongodb://localhost:27017/employee_db"
```
Or start the service in Windows:
```powershell
net start MongoDB
```

---

### Step 2: Start the Backend (Spring Boot)
Navigate to the `backend` folder and run:
```bash
cd backend
mvn spring-boot:run
```
The backend REST API will start on **`http://localhost:8080`**.
On first startup, it automatically seeds:
- 2 User accounts (`admin@ems.com`, `john.doe@ems.com`)
- 6 Departments (`Engineering`, `Human Resources`, `Marketing`, `Finance`, `Sales`, `Operations`)
- 6 Employee profiles
- Sample attendance and leave records

---

### Step 3: Start the Frontend (React Vite)
In a new terminal window, navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```
The React frontend application will launch on **`http://localhost:5173`**.

---

### Step 4: One-Click Startup (Windows)
Double-click `start-all.bat` or run:
```cmd
start-all.bat
```
This automatically launches both backend and frontend in separate consoles.

---

## 📡 RESTful API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account (defaults to `ROLE_USER`)
- `POST /api/auth/login` - Authenticate with email & password, returns JWT token
- `POST /api/auth/forgot-password` - Reset account password
- `POST /api/auth/change-password` - Update current password (Authenticated)
- `GET /api/auth/me` - Fetch currently logged in user profile

### Employees (`/api/employees`)
- `GET /api/employees` - Search & filter employees (`?search=`, `?department=`, `?status=`)
- `GET /api/employees/{id}` - Fetch single employee by MongoDB ID
- `GET /api/employees/emp-id/{employeeId}` - Fetch single employee by custom ID (e.g. `EMP-1001`)
- `POST /api/employees` - Create new employee record (*Admin only*)
- `PUT /api/employees/{id}` - Update employee record (*Admin only*)
- `DELETE /api/employees/{id}` - Delete employee record (*Admin only*)

### Departments (`/api/departments`)
- `GET /api/departments` - List all departments
- `GET /api/departments/{id}` - Fetch department details with member roster
- `POST /api/departments` - Create new department (*Admin only*)
- `PUT /api/departments/{id}` - Update department (*Admin only*)
- `DELETE /api/departments/{id}` - Delete department (*Admin only*)

### Attendance (`/api/attendance`)
- `POST /api/attendance/check-in` - Record check-in timestamp
- `POST /api/attendance/check-out` - Record check-out timestamp
- `GET /api/attendance/today` - Retrieve current user's attendance status today
- `GET /api/attendance/my-history` - Retrieve current user's attendance history
- `GET /api/attendance` - Admin view of all employee attendance records for a date (`?date=YYYY-MM-DD`)

### Leaves (`/api/leaves`)
- `POST /api/leaves` - Submit time-off request
- `GET /api/leaves/my-leaves` - List current user's submitted requests
- `GET /api/leaves` - List all company leave requests (*Admin only*)
- `PUT /api/leaves/{id}/approve` - Approve leave with remarks (*Admin only*)
- `PUT /api/leaves/{id}/reject` - Reject leave with remarks (*Admin only*)

### Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats` - Retrieve executive summary counters, department breakdown, growth trends, and recent activity logs.

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Retrieve in-app alerts for logged in user / admin
- `PUT /api/notifications/{id}/read` - Mark single alert as read
- `PUT /api/notifications/read-all` - Mark all alerts as read
