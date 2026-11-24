package com.ems.controller;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String rootHtml() {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>NEXORA - Backend API Running</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                        background: radial-gradient(circle at 10% 20%, #F0EBFC 0%, #F7F5FC 90%);
                        color: #25213B;
                        margin: 0;
                        padding: 40px 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        box-sizing: border-box;
                    }
                    .container {
                        max-width: 640px;
                        width: 100%;
                        background: #FFFFFF;
                        border-radius: 20px;
                        padding: 40px;
                        box-shadow: 0 20px 40px -10px rgba(108, 59, 206, 0.15);
                        border: 1px solid #E9E5F5;
                    }
                    .badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: #ECFDF5;
                        color: #10B981;
                        font-weight: 700;
                        font-size: 0.82rem;
                        padding: 6px 14px;
                        border-radius: 9999px;
                        margin-bottom: 20px;
                    }
                    .dot {
                        width: 8px;
                        height: 8px;
                        background: #10B981;
                        border-radius: 50%;
                        animation: pulse 1.5s infinite;
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.4; transform: scale(0.8); }
                    }
                    h1 {
                        font-size: 1.8rem;
                        font-weight: 800;
                        color: #241044;
                        margin: 0 0 10px;
                    }
                    p {
                        color: #6B7280;
                        font-size: 0.95rem;
                        line-height: 1.6;
                        margin: 0 0 24px;
                    }
                    .btn-group {
                        display: flex;
                        gap: 12px;
                        flex-wrap: wrap;
                        margin-bottom: 30px;
                    }
                    .btn {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 12px 24px;
                        border-radius: 12px;
                        font-weight: 700;
                        font-size: 0.95rem;
                        text-decoration: none;
                        transition: all 0.2s;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #6C3BCE 0%, #8B5CF6 100%);
                        color: #FFFFFF;
                        box-shadow: 0 6px 20px rgba(108, 59, 206, 0.35);
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                    }
                    .endpoints {
                        background: #FAF8FD;
                        border-radius: 12px;
                        padding: 20px;
                        border: 1px solid #E9E5F5;
                    }
                    .endpoint-title {
                        font-weight: 700;
                        font-size: 0.85rem;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #6C3BCE;
                        margin-bottom: 12px;
                    }
                    .endpoint-item {
                        display: flex;
                        justify-content: space-between;
                        font-size: 0.85rem;
                        padding: 6px 0;
                        border-bottom: 1px solid #F0EBFC;
                    }
                    .endpoint-item:last-child {
                        border-bottom: none;
                    }
                    .method {
                        font-weight: 700;
                        color: #8B5CF6;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="badge">
                        <span class="dot"></span>
                        Backend API Running on Port 8080
                    </div>
                    <h1>Spring Boot Backend is Online!</h1>
                    <p>
                        The REST API server is running and ready. The web user interface is served by the <strong>React Frontend</strong> on port <strong>5173</strong>.
                    </p>
                    <div class="btn-group">
                        <a href="http://localhost:5173" class="btn btn-primary" target="_blank">
                            Open React Frontend (http://localhost:5173) &rarr;
                        </a>
                    </div>
                    <div class="endpoints">
                        <div class="endpoint-title">Sample REST Endpoints</div>
                        <div class="endpoint-item">
                            <span>Authentication Login</span>
                            <span class="method">POST /api/auth/login</span>
                        </div>
                        <div class="endpoint-item">
                            <span>Authentication Register</span>
                            <span class="method">POST /api/auth/register</span>
                        </div>
                        <div class="endpoint-item">
                            <span>Employees API</span>
                            <span class="method">GET, POST /api/employees</span>
                        </div>
                        <div class="endpoint-item">
                            <span>Departments API</span>
                            <span class="method">GET, POST /api/departments</span>
                        </div>
                        <div class="endpoint-item">
                            <span>Attendance Tracker</span>
                            <span class="method">POST /api/attendance/check-in</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    @GetMapping("/api")
    public Map<String, Object> apiInfo() {
        return Map.of(
            "status", "UP",
            "service", "EMS Pro Backend",
            "frontendUrl", "http://localhost:5173",
            "database", "MongoDB (employee_db)"
        );
    }
}
