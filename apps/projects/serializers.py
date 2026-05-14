from rest_framework import serializers
from .models import Project
from apps.users.serializers import UserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    created_by_details = UserSerializer(source='created_by', read_only=True)
    members_details = UserSerializer(source='members', many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'deadline', 'status', 'created_by', 'created_by_details', 'members', 'members_details', 'created_at', 'updated_at')
        read_only_fields = ('created_by',)
