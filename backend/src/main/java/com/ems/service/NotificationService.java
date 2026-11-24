package com.ems.service;

import com.ems.model.Notification;
import com.ems.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String recipientEmail, String title, String message, String type) {
        Notification notification = new Notification(recipientEmail, title, message, type);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsForUser(String email, boolean isAdmin) {
        if (isAdmin) {
            return notificationRepository.findByRecipientEmailOrRecipientEmailOrderByCreatedAtDesc("ADMIN", "ALL");
        }
        return notificationRepository.findByRecipientEmailOrRecipientEmailOrderByCreatedAtDesc(email, "ALL");
    }

    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(String email, boolean isAdmin) {
        List<Notification> list = getNotificationsForUser(email, isAdmin);
        for (Notification n : list) {
            n.setRead(true);
        }
        notificationRepository.saveAll(list);
    }
}
