from datetime import timedelta
from django.utils import timezone  
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):

  ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('student', 'Student'),
    ('technician', 'Technician'),
    ('staff', 'Staff')
  ]

  email = models.CharField(max_length = 100, unique=True)
  profile_image = models.URLField(max_length=255, default='', blank=True)
  role = models.CharField(max_length=100, choices=ROLE_CHOICES, default='student')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)
  USERNAME_FIELD = 'email'  
  REQUIRED_FIELDS = ['username']  

  def __str__(self):
    return f"{self.email} {self.role}"

class OTP(models.Model):

  otp = models.CharField(max_length=6)
  created_at = models.DateTimeField(auto_now=True)
  user = models.ForeignKey(User, on_delete=models.CASCADE)

  @property
  def is_expired(self):
      return self.created_at + timedelta(minutes=10) < timezone.now()

  def __str__(self):
        return f"OTP for {self.user.username} - {self.otp}"
  
class Ticket(models.Model):

  PRIORITY_CHOICES = [
    ('low', 'Low'),
    ('medium', 'Medium'),
    ('high', 'High'),
  ]

  STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
  ]

  title = models.CharField(max_length=255)
  description = models.TextField()
  category = models.CharField(max_length=50)
  priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='low')
  supplementary_image = models.URLField(max_length=255, default='', blank=True)  
  created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tickets', blank=True)
  assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
  created_at = models.DateTimeField(auto_now_add=True)  
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"{self.title}"

class Comment(models.Model):
  ticket_id = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
  user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments', blank=True)
  comment_text = models.TextField()
  created_at = models.TimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  def __str__(self):
    return f"{self.comment_text}"

class Notification(models.Model):
  user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
  message = models.CharField(max_length=255)
  is_read = models.BooleanField(default=False)
  created_at = models.BooleanField(default=False)

  def __str__(self):
    return f"{self.message}"

class ActivityLog(models.Model):
    username = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    action = models.CharField(max_length=255)

    def __str__(self):
        return f"Activity by {self.username} at {self.timestamp}: {self.action}"