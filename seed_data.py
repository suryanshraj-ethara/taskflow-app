import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.projects.models import Project
from apps.tasks.models import Task
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

def seed():
    # Clear existing
    Task.objects.all().delete()
    Project.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete() # keep original superuser if any, though we clear anyway
    User.objects.all().delete()

    # Create Admin
    admin = User.objects.create_superuser('admin', 'admin@example.com', 'admin123', first_name='Admin', last_name='User', role='ADMIN')
    
    # Create Members
    member1 = User.objects.create_user('member1', 'member1@example.com', 'password123', first_name='Alice', last_name='Smith', role='MEMBER')
    member2 = User.objects.create_user('member2', 'member2@example.com', 'password123', first_name='Bob', last_name='Jones', role='MEMBER')

    # Create Projects
    p1 = Project.objects.create(title='Website Redesign', description='Redesign the main corporate website', status='ACTIVE', deadline=timezone.now().date() + timedelta(days=30), created_by=admin)
    p1.members.add(member1, member2)

    p2 = Project.objects.create(title='Mobile App MVP', description='Build the first version of the mobile app', status='ACTIVE', deadline=timezone.now().date() + timedelta(days=60), created_by=admin)
    p2.members.add(member1)

    # Create Tasks
    Task.objects.create(title='Design Figma Mockups', description='Create mockups for landing page', priority='HIGH', status='COMPLETED', due_date=timezone.now().date() - timedelta(days=2), project=p1, assigned_to=member1)
    Task.objects.create(title='Implement Frontend', description='React UI development', priority='HIGH', status='IN_PROGRESS', due_date=timezone.now().date() + timedelta(days=5), project=p1, assigned_to=member1)
    Task.objects.create(title='Setup Database', description='PostgreSQL schema setup', priority='MEDIUM', status='TODO', due_date=timezone.now().date() + timedelta(days=1), project=p1, assigned_to=member2)
    
    Task.objects.create(title='API Design', description='Design REST endpoints', priority='HIGH', status='TODO', due_date=timezone.now().date() - timedelta(days=1), project=p2, assigned_to=member1)

    print("Seed data created successfully.")

if __name__ == '__main__':
    seed()
