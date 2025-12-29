from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password":{"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializes user data for the profile endpoint.
    """
    storage_used = serializers.IntegerField(source='profile.storage_used', read_only=True)
    storage_quota = serializers.IntegerField(source='profile.storage_limit', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'storage_used', 'storage_quota']
        read_only_fields = ['id', 'date_joined']
