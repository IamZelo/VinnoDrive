from django.db import models
from django.contrib.auth.models import User
import uuid

class PhysicalBlob(models.Model):
    """
    Represents the unique physical file stored on your server's disk.
    Deduplication Core: Multiple users can point to this single record.
    """
    # SHA-256 is the unique identifier for the content
    sha256_hash = models.CharField(
        max_length=64, 
        unique=True, 
        primary_key=True, 
        help_text="SHA-256 hash of the file content"
    )
    
    file = models.FileField(upload_to='blobs/', help_text="Actual file stored on local disk")
    
    size = models.BigIntegerField(help_text="File size in bytes")
    content_type = models.CharField(max_length=100, default="application/octet-stream")
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Track how many users have this file. 
    # Logic: Only delete the physical file when this hits 0.
    ref_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.sha256_hash[:8]}... ({self.size} bytes)"

class FileReference(models.Model):
    """
    Represents a file in a specific User's dashboard.
    This is what the user sees. It points to a PhysicalBlob.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    
    # PROTECT ensures we don't accidentally delete the blob while a user still has it
    blob = models.ForeignKey(PhysicalBlob, on_delete=models.PROTECT, related_name='references')
    
    filename = models.CharField(max_length=1024)
    upload_timestamp = models.DateTimeField(auto_now_add=True)
    
    is_primary_uploader = models.BooleanField(default=False)
    
    
    class Meta:
        ordering = ['-upload_timestamp']
        verbose_name = "User File"
        verbose_name_plural = "User Files"

    def __str__(self):
        return f"{self.user.username} - {self.filename}"