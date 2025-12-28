from rest_framework import serializers
from .models import PhysicalBlob, FileReference

class FileReferenceSerializer(serializers.ModelSerializer):
    """
    Converts the database model to JSON for the React frontend.
    It flattens the relationship so the frontend sees 'size' and 'hash' directly.
    """
    # Pulling data from the related PhysicalBlob
    size = serializers.IntegerField(source='blob.size', read_only=True)
    hash = serializers.CharField(source='blob.sha256_hash', read_only=True)
    content_type = serializers.CharField(source='blob.content_type', read_only=True)
    
    # Custom calculated fields
    download_url = serializers.SerializerMethodField()
    is_duplicate = serializers.SerializerMethodField()

    class Meta:
        model = FileReference
        fields = [
            'id', 
            'filename', 
            'size', 
            'hash',
            'is_primary_uploader', 
            'download_url', 
            'content_type', 
            'upload_timestamp', 
            'is_duplicate'
        ]
        read_only_fields = ['id', 'upload_timestamp']

    def get_is_duplicate(self, obj):
        """
        Returns True if more than 1 reference points to this blob and if not primary uploader
        False if ref count is 1
        """
        return obj.blob.ref_count > 1 and (not obj.is_primary_uploader)

    def get_download_url(self, obj):
        """
        Generates the full absolute URL for the file.
        e.g., http://localhost:8000/media/blobs/myfile.png
        """
        if obj.blob.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.blob.file.url)
            return obj.blob.file.url
        return None

class FileUploadSerializer(serializers.Serializer):
    """
    Validates the initial metadata sent by React.
    Used to check if a hash already exists or to validate the upload payload.
    """
    filename = serializers.CharField(max_length=255)
    hash = serializers.CharField(max_length=64, min_length=64)
    size = serializers.IntegerField(min_value=0)
    content_type = serializers.CharField(max_length=100, required=False, default="application/octet-stream")