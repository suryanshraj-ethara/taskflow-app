from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.projects.models import Project
from apps.tasks.models import Task
from django.utils import timezone

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        today = timezone.now().date()
        
        if user.role == 'ADMIN':
            projects = Project.objects.all()
            tasks = Task.objects.all()
        else:
            projects = Project.objects.filter(members=user)
            tasks = Task.objects.filter(assigned_to=user)

        total_projects = projects.count()
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='COMPLETED').count()
        overdue_tasks = tasks.filter(due_date__lt=today).exclude(status='COMPLETED').count()

        recent_tasks = tasks.order_by('-updated_at')[:5].values('id', 'title', 'status', 'updated_at')

        return Response({
            'total_projects': total_projects,
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'overdue_tasks': overdue_tasks,
            'recent_activity': list(recent_tasks)
        })
