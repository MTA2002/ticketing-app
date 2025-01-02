from datetime import timezone
from django.http import Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from .permissions import IsAdminUser, IsSelfOrAdmin, IsNotTechnician
from .models import OTP, ActivityLog, User, Ticket, Comment, Notification
from .serializers import ActivityLogSerializer, UserSerializer, TicketSerializer, CommentSerializer, NotificationSerailizer
from drf_yasg import openapi
from django.contrib.auth.hashers import check_password
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

# Create your views here.

def log_user_activity(user, action, request):
    # Get the user's IP address
    ip_address = request.META.get('REMOTE_ADDR')
    
    # Create a new log entry
    ActivityLog.objects.create(
        username=user.username,
        action=action,
        ip_address=ip_address
    )

    print('success')

class AuthView:

  @staticmethod
  @api_view(['POST'])
  @permission_classes([AllowAny])
  def login(request:Request):

    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
      return Response({"error": "Both email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.filter(email = email).first()
    
    if not user:
      return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


    if not check_password(password, user.password):
      return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)


    otp = get_random_string(length=6, allowed_chars='0123456789')
      
    OTP.objects.update_or_create(
        user=user,  
        defaults={'otp': otp}  
    )

    send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            'mahfouz.teyib@a2sv.org',
            [user.email],
            fail_silently=False,
    )
    
    log_user_activity(user, "OTP sent to user", request)
    return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)


  @staticmethod
  @api_view(['POST'])
  @permission_classes([AllowAny])  
  def verifyOtp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    if not email or not otp:
        return Response({"error": "Both email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    
    user = User.objects.filter(email=email).first()

    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
    
    otp_object = OTP.objects.filter(user = user, otp = otp).first()

    if not otp_object:
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    if otp_object.is_expired:  
        return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    log_user_activity(user, "OTP verified by user", request)
    return Response({
        'access': access_token,
        'refresh': str(refresh)
    }, status=status.HTTP_200_OK)
  

  @staticmethod
  @api_view(['POST'])
  @permission_classes([AllowAny])  
  def resendOtp(request):
    email = request.data.get('email')

    if not email:
      return Response({"message": "email must be provided!"}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.filter(email = email).first()

    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
    

    otp = get_random_string(length=6, allowed_chars='0123456789')
      
    OTP.objects.update_or_create(
        user=user,  
        defaults={'otp': otp}  
    )

    send_mail(
            'Your OTP Code',
            f'Your OTP is {otp}',
            'mahfouz.teyib@a2sv.org',
            [user.email],
            fail_silently=False,
    )

    log_user_activity(user, "OTP resent to user", request)

    return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
  
  @staticmethod
  @api_view(['POST'])
  @permission_classes([AllowAny])  
  def refreshToken(request:Request):
    refresh_token = request.data.get('refresh_token')

    if not refresh_token:
      return Response({"message": "refresh token must be provided"}, status=status.HTTP_400_BAD_REQUEST)
     

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        log_user_activity(request.user, "access token refreshed", request)

        return Response({
            'access': access_token,
            'refresh': str(refresh)
        }, status=status.HTTP_200_OK)
    
    except InvalidToken as e:
        # If the refresh token is invalid
        return Response({"message": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

    except TokenError as e:
        # If there is any other issue with the token
        return Response({"message": "Error occurred with the refresh token"}, status=status.HTTP_400_BAD_REQUEST)
    


class UserListView(APIView):
  # permission_classes = [IsAdminUser]
  
  @swagger_auto_schema(
        operation_summary="List all users",
        tags=["Users"],
        manual_parameters=[
            openapi.Parameter(
                name="Authorization",
                in_=openapi.IN_HEADER,
                description="Authorization token (Bearer <token>)",
                type=openapi.TYPE_STRING,
                required=True,
            )
        ]

  )
  def get(self, request: Request):
    users = User.objects.all()
    serializer = UserSerializer(users, many = True)

    return Response(data=serializer.data, status=status.HTTP_200_OK)

  @swagger_auto_schema(
        operation_summary="Create a new user",
        tags=["Users"],
        request_body=UserSerializer
  )
  def post(self, request: Request):
    serializer = UserSerializer(data = request.data)

    if serializer.is_valid():
      serializer.save()
      log_user_activity(request.user, "new user created", request)
      return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
class UserDetailView(APIView):
  permission_classes = [IsSelfOrAdmin]

  @swagger_auto_schema(
        operation_summary="Retrieve user details",
        tags=["Users"]
    )
  def get(self, request: Request, id):
    try:
      user = User.objects.get(pk = id)
      self.check_object_permissions(request, user)
      serializer = UserSerializer(user)
      return Response(data=serializer.data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
       return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

  @swagger_auto_schema(
        operation_summary="Update user details",
        tags=["Users"],
        request_body=UserSerializer
    )
  def put(self, request: Request, id):
    try:
      user = User.objects.get(pk = id)
      self.check_object_permissions(request, user)
      serializer = UserSerializer(user, data = request.data)

      if user.role != request.data["role"] and request.user.role != "admin":
        return Response(
            {'error': 'You cannot update your own role.'},
            status=status.HTTP_403_FORBIDDEN
        )

      if serializer.is_valid():
        serializer.save()
        log_user_activity(request.user, "user updated", request)
        return Response(data=serializer.data, status=status.HTTP_200_OK)
      
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except User.DoesNotExist:
       return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
  
  @swagger_auto_schema(
        operation_summary="Delete a user",
        tags=["Users"]
    )
  def delete(self, request: Request, id):
    if request.user.id == id:
        return Response(
            {'error': 'You cannot delete your own account.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    try:
      user = User.objects.get(pk = id)
      self.check_object_permissions(request, user)
      user.delete()
      log_user_activity(request.user, "user deleted", request)
      return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
       return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class TicketListView(APIView):
  permission_classes = [IsNotTechnician]

  @swagger_auto_schema(
        operation_summary="List all tickets",
        tags=["Tickets"]
    )
  def get(self, request: Request):
    tickets = Ticket.objects.all()
    serializer = TicketSerializer(tickets, many = True)

    return Response(data=serializer.data, status=status.HTTP_200_OK)

  @swagger_auto_schema(
        operation_summary="Create a new ticket",
        tags=["Tickets"],
        request_body=TicketSerializer
    )
  def post(self, request: Request):
    if request.user.role == 'technician':
      return Response(data = {"message" : "UNAUTHORIZED"} ,status = status.HTTP_401_UNAUTHORIZED)
    
    serializer = TicketSerializer(data = request.data)

    if serializer.is_valid():
      serializer.save(created_by=request.user)
      log_user_activity(request.user, "ticket created", request)
      return Response(data=serializer.data, status=status.HTTP_201_CREATED)
  
    return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TicketDetailView(APIView):

  def get_ticket(self, id):
    try:
      ticket = Ticket.objects.get(pk = id)
      return ticket
    except Ticket.DoesNotExist:
      raise Http404


  @swagger_auto_schema(
        operation_summary="Retrieve a specific ticket",
        tags=["Tickets"]
    )
  
  def get(self, request: Request, id):
    
    ticket = self.get_ticket(id)
    serializer = TicketSerializer(ticket)
    return Response(data=serializer.data, status=status.HTTP_200_OK)

  @swagger_auto_schema(
        operation_summary="Update a specific ticket",
        tags=["Tickets"],
        request_body=TicketSerializer
  )
  
  def put(self, request: Request, id):
    ticket = self.get_ticket(id)
    serializer = TicketSerializer(ticket, request.data)

    if serializer.is_valid():
      serializer.save()
      log_user_activity(request.user, "ticket updated", request)
      return Response(data=serializer.data, status=status.HTTP_200_OK)

    return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

  @swagger_auto_schema(
        operation_summary="Delete a specific ticket",
        tags=["Tickets"]
    )
  def delete(self, request: Request, id):
    ticket = self.get_ticket(id)
    ticket.delete()
    log_user_activity(request.user, "ticket deleted", request)
    return Response({'message': 'Ticket deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class CommentListView(APIView):

    @swagger_auto_schema(
        operation_summary="List all comments",
        tags=["Comments"]
    )
    def get(self, request: Request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Create a new comment",
        tags=["Comments"],
        request_body=CommentSerializer
    )
    def post(self, request: Request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user_id=request.user)
            log_user_activity(request.user, "comment created", request)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):

    def get_comment(self, id):
        try:
            comment = Comment.objects.get(pk=id)
            return comment
        except Comment.DoesNotExist:
            raise Http404

    @swagger_auto_schema(
        operation_summary="Retrieve a specific comment",
        tags=["Comments"]
    )
    def get(self, request: Request, id):
        comment = self.get_comment(id)
        serializer = CommentSerializer(comment)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Update a specific comment",
        tags=["Comments"],
        request_body=CommentSerializer
    )
    def put(self, request: Request, id):
        comment = self.get_comment(id)
        if comment.user_id != request.user.id or request.user.role != 'admin':
            return Response(
                {'error': 'UNAUTHORIZED'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            log_user_activity(request.user, "comment updated", request)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a specific comment",
        tags=["Comments"]
    )
    def delete(self, request: Request, id):
        comment = self.get_comment(id)
        if comment.user_id != request.user.id or request.user.role != 'admin':
            return Response(
                {'error': 'UNAUTHORIZED'},
                status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        log_user_activity(request.user, "comment deleted", request)
        return Response({'message': 'Comment deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class NotificationListView(APIView):

    @swagger_auto_schema(
        operation_summary="List all notifications",
        tags=["Notifications"]
    )
    def get(self, request: Request):
        notifications = Notification.objects.all()
        serializer = NotificationSerailizer(notifications, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Create a new notification",
        tags=["Notifications"],
        request_body=NotificationSerailizer
    )
    def post(self, request: Request):
        serializer = NotificationSerailizer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotificationDetailView(APIView):

    def get_notification(self, id):
        try:
            notification = Notification.objects.get(pk=id)
            return notification
        except Notification.DoesNotExist:
            raise Http404

    @swagger_auto_schema(
        operation_summary="Retrieve a specific notification",
        tags=["Notifications"]
    )
    def get(self, request: Request, id):
        notification = self.get_notification(id)
        serializer = NotificationSerailizer(notification)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_summary="Update a specific notification",
        tags=["Notifications"],
        request_body=NotificationSerailizer
    )
    def put(self, request: Request, id):
        notification = self.get_notification(id)
        serializer = NotificationSerailizer(notification, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_summary="Delete a specific notification",
        tags=["Notifications"]
    )
    def delete(self, request: Request, id):
        notification = self.get_notification(id)
        notification.delete()
        return Response({'message': 'Notification deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

class ActivityLogView(APIView):
  permission_classes = [IsAdminUser]
  
  @swagger_auto_schema(
        operation_summary="List all activity logs",
        tags=["Activity Logs"]
  )
  def get(self, request: Request):
    logs = ActivityLog.objects.all()
    serializer = ActivityLogSerializer(logs, many = True)

    return Response(data=serializer.data, status=status.HTTP_200_OK)
