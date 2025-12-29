from django.contrib.auth.models import User
from django.db.models import Sum
from drive.models import FileReference
from user.models import UserProfile

print("Starting repair...")

for user in User.objects.all():
    # 1. Create the profile if it's missing (The Fix)
    profile, created = UserProfile.objects.get_or_create(user=user)
    
    if created:
        print(f" -> Created missing profile for: {user.username}")

    # 2. Calculate total size
    total_bytes = FileReference.objects.filter(user=user).aggregate(
        total=Sum('blob__size')
    )['total'] or 0
    
    # 3. Update the field
    profile.storage_used = total_bytes
    profile.save()
    
    print(f"Updated {user.username}: {total_bytes} bytes")

print("Done! All users are synced.")