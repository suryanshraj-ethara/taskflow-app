"""
WSGI config for core project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = get_wsgi_application()

try:
    if not os.environ.get('RUN_MAIN') and not os.environ.get('DATA_SEEDED'):
        from django.core.management import call_command
        import seed_data
        
        print("Auto-running migrations...")
        call_command('migrate', interactive=False)
        
        print("Auto-seeding database...")
        seed_data.seed()
        
        os.environ['DATA_SEEDED'] = 'True'
except Exception as e:
    print(f"Error during auto-seed: {e}")
