from django.contrib import admin
from .models import UserProfile

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'storage_limit_mb', 'storage_used_mb')
    search_fields = ('user__username', 'user__email')

    # Helper to show readable MBs in the list
    def storage_limit_mb(self, obj):
        return f"{obj.storage_limit / (1024*1024):.2f} MB"
    
    def storage_used_mb(self, obj):
        return f"{obj.storage_used / (1024*1024):.2f} MB"