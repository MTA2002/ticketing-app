from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'
    
class IsSelfOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.id == obj.id or request.user.role == 'admin'

class IsNotTechnician(BasePermission):
    def has_permission(self, request, view):
        return request.user.role != 'technician'