from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
   path('users/', views.UserListView.as_view(), name='user-list'),   
   path('users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'), 
   path('tickets/', views.TicketListView.as_view(), name='ticket-list'),
   path('tickets/<int:id>/', views.TicketDetailView.as_view(), name='ticket-detail'),
   path('comments/', views.CommentListView.as_view(), name='ticket-list'),
   path('comments/<int:id>/', views.CommentDetailView.as_view(), name='ticket-list'),
   path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
   path('notifications/<int:id>/', views.NotificationDetailView.as_view(), name='notification-detail'),
   path('activity-logs/', views.ActivityLogView.as_view(), name='activity-logs-list'),
   path('auth/login/', views.AuthView.login),  # Login
   path('auth/verify-otp/', views.AuthView.verifyOtp),  # Login
   path('auth/resend-otp/', views.AuthView.resendOtp),  # Resend Otp
   path('auth/refresh/', views.AuthView.refreshToken),  # Refresh Token
]


