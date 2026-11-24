package com.ems.dto;

import java.util.Map;
import java.util.List;

public class DashboardStatsDto {
    private long totalEmployees;
    private long activeEmployees;
    private long inactiveEmployees;
    private long totalDepartments;
    private long pendingLeaves;
    private long presentToday;
    private Map<String, Long> departmentDistribution;
    private Map<String, Long> monthlyJoiningTrend;
    private List<Map<String, Object>> recentActivities;

    public DashboardStatsDto() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public long getInactiveEmployees() { return inactiveEmployees; }
    public void setInactiveEmployees(long inactiveEmployees) { this.inactiveEmployees = inactiveEmployees; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getPendingLeaves() { return pendingLeaves; }
    public void setPendingLeaves(long pendingLeaves) { this.pendingLeaves = pendingLeaves; }

    public long getPresentToday() { return presentToday; }
    public void setPresentToday(long presentToday) { this.presentToday = presentToday; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public Map<String, Long> getMonthlyJoiningTrend() { return monthlyJoiningTrend; }
    public void setMonthlyJoiningTrend(Map<String, Long> monthlyJoiningTrend) { this.monthlyJoiningTrend = monthlyJoiningTrend; }

    public List<Map<String, Object>> getRecentActivities() { return recentActivities; }
    public void setRecentActivities(List<Map<String, Object>> recentActivities) { this.recentActivities = recentActivities; }
}
