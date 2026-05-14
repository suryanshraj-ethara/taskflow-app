from rest_framework import serializers
from .models import Task
from apps.users.serializers import UserSerializer
from apps.projects.serializers import ProjectSerializer

class TaskSerializer(serializers.ModelSerializer):
    assigned_to_details = UserSerializer(source='assigned_to', read_only=True)
    # Exclude full project details to avoid deep nesting, maybe just simple info
    
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'priority', 'status', 'due_date', 'project', 'assigned_to', 'assigned_to_details', 'created_at', 'updated_at')
