# Full Stack Team Task Manager

A production-ready Full Stack Team Task Manager built with Django, Django REST Framework, and React (Vite + Tailwind CSS).

## Features
- **Role-Based Access Control**: Admin and Member roles with different permissions.
- **Project & Task Management**: Create projects, assign tasks, track deadlines and priorities.
- **JWT Authentication**: Secure login with access and refresh tokens.
- **Modern Dashboard**: Visualize task progress, overdue tasks, and recent activity using Recharts.
- **Responsive UI**: Built with Tailwind CSS and Lucide React icons.

## Quick Start (Development)

### Backend (Django)
1. Navigate to the project root: `cd task-manager`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `.\venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Seed database (optional): `python seed_data.py` (Creates admin/admin123 and test users)
7. Start server: `python manage.py runserver`

### Frontend (React)
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## API Documentation
- **Auth**: `/api/auth/register/`, `/api/auth/login/`, `/api/auth/refresh/`
- **Users**: `/api/users/`, `/api/users/me/`
- **Projects**: `/api/projects/` (CRUD)
- **Tasks**: `/api/tasks/` (CRUD, Filterable by status, priority, etc.)
- **Dashboard**: `/api/dashboard/`

## Deployment (Railway)
This repository is configured as a Monorepo for Railway.
1. Connect this repo to Railway.
2. Create **two** services from the same repo.
3. **Backend Service**:
   - Root Directory: `/`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `gunicorn core.wsgi --log-file -`
   - Env Vars: `DATABASE_URL` (PostgreSQL), `SECRET_KEY`, `CORS_ALLOWED_ORIGINS` (Frontend URL)
4. **Frontend Service**:
   - Root Directory: `/frontend`
   - Env Vars: `VITE_API_URL` (Backend URL)
