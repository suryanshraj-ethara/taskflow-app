from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.users.views import UserViewSet, RegisterView
from apps.projects.views import ProjectViewSet
from apps.tasks.views import TaskViewSet
from apps.dashboard.views import DashboardStatsView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Dashboard
    path('api/dashboard/', DashboardStatsView.as_view(), name='dashboard'),
    
    # ViewSets
    path('api/', include(router.urls)),
]

# Serve React frontend for all non-API routes in production
# This catch-all must come last so it doesn't override API/admin routes
import os
frontend_build = os.path.join(settings.BASE_DIR, 'frontend', 'dist')
if os.path.exists(os.path.join(frontend_build, 'index.html')):
    from django.views.static import serve as static_serve
    from django.http import FileResponse

    def serve_react(request):
        """Serve React index.html for any non-API route (SPA catch-all)"""
        return FileResponse(open(os.path.join(frontend_build, 'index.html'), 'rb'), content_type='text/html')

    urlpatterns += [
        # Serve static assets from React build
        re_path(r'^assets/(?P<path>.*)$', static_serve, {'document_root': os.path.join(frontend_build, 'assets')}),
        # Catch-all: serve React index.html for client-side routing
        re_path(r'^(?!api/|admin/).*$', serve_react),
    ]
