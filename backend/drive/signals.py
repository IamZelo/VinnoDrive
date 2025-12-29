from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import F
from .models import FileReference
from user.models import UserProfile

@receiver(post_save, sender=FileReference)
def increase_storage_on_upload(sender, instance, created, **kwargs):
    """
    When a user adds a file, instantly add its size to their usage counter.
    """
    if created:
        # logical size = the size of the blob they are referencing
        file_size = instance.blob.size
        
        # Atomic update (Safe for concurrent uploads)
        UserProfile.objects.filter(user=instance.user).update(
            storage_used=F('storage_used') + file_size
        )

@receiver(post_delete, sender=FileReference)
def decrease_storage_on_delete(sender, instance, **kwargs):
    """
    When a user deletes a file, instantly subtract its size.
    """
    file_size = instance.blob.size
    
    # Atomic update
    UserProfile.objects.filter(user=instance.user).update(
        storage_used=F('storage_used') - file_size
    )