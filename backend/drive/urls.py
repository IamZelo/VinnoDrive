from django.urls import path
from . import views

urlpatterns = [
    # Endpoint to list all files for the logged-in user
    path('files/', views.get_files, name='get_files'),
    
    # Endpoint to upload a new file (with deduplication logic)
    path('upload/', views.upload_file, name='upload_file'),
]