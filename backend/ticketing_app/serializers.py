from rest_framework import serializers
from .models import ActivityLog, Notification, Ticket, User, Comment
from django.contrib.auth.hashers import make_password


class ActivityLogSerializer(serializers.ModelSerializer):
      class Meta:
            model = ActivityLog
            
            fields = [
                  "id",
                  "username",
                  "timestamp",
                  "ip_address",
                  "action"
            ]
            
class NotificationSerailizer(serializers.ModelSerializer):
      class Meta:
            model = Notification
            fields = [
                        'id',  
                        'user_id',
                        'message',
                        'is_read',
                        'created_at',
            ]
            read_only_fields = ['created_at']

class CommentSerializer(serializers.ModelSerializer):
      class Meta:
            model = Comment
            fields = [
                  'id',  
                  'ticket_id',
                  'user_id',
                  'comment_text',
                  'created_at',
                  'updated_at',
            ]
            read_only_fields = ['created_at', 'updated_at']

class TicketSerializer(serializers.ModelSerializer):
      comments = CommentSerializer(many = True, read_only = True)

      class Meta:
            model = Ticket
            fields = [
                  'id',  
                  "title",
                  "description",
                  "category",
                  "priority",
                  "supplementary_image",
                  "created_by",
                  "assigned_to",
                  "status",
                  "created_at",
                  "updated_at",
                  "comments"
            ]
            read_only_fields = ["created_at", "updated_at"]

class UserSerializer(serializers.ModelSerializer):
      created_tickets = TicketSerializer(many=True, read_only=True) 
      assigned_tickets = TicketSerializer(many=True, read_only=True)
      notifications = NotificationSerailizer(many = True, read_only = True)
      confirm_password = serializers.CharField(write_only=True)  

      class Meta:
            model = User
            fields = [
                  'id',  
                  'username',
                  'email',
                  'profile_image',
                  'role',
                  'password',
                  'confirm_password',
                  'created_at',
                  'updated_at',
                  'created_tickets',
                  'assigned_tickets',
                  'notifications',
            ]
            
            read_only_fields = ['created_at', 'updated_at']
            extra_kwargs = {
                  'password': {'write_only': True},  
            }
    
      def validate(self, data):
            if data['password'] != data['confirm_password']:            
                  raise serializers.ValidationError({"password": "Passwords do not match."})
            
            return data
    
      def create(self, validated_data):
       
            validated_data.pop('confirm_password')
            validated_data['password'] = make_password(validated_data['password'])

            return super().create(validated_data)
    
      def update(self, instance, validated_data):

            if 'password' in validated_data:
                  validated_data.pop('confirm_password', None)  
                  validated_data['password'] = make_password(validated_data['password'])
            
            return super().update(instance, validated_data)




'''
{
    "title": "Projector Not Working",
    "description": "The projector in room 101 is not turning on.",
    "status": "open",
    "created_by": 1,
    "category" : "category",
    "created_by" : 2,
    "assigned_to": 5
}

'''