import os
import sys

# Update this path to the path of your virtual environment
sys.path.insert(0, os.path.dirname(__file__))

# Add the project directory to the sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'optuce_p'))

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'optuce_p.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
