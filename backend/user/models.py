from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Default Quota: 10MB
DEFAULT_QUOTA = 10 * 1024 * 1024 

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Configurable limit for this specific user
    storage_limit = models.BigIntegerField(default=DEFAULT_QUOTA, help_text="Storage limit in bytes")
    storage_used = models.BigIntegerField(default=0, help_text="Current usage in bytes")

    def __str__(self):
        return f"{self.user.username} - {self.storage_limit} bytes"
