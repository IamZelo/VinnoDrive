from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import PhysicalBlob, FileReference
from .serializers import FileReferenceSerializer, FileUploadSerializer
from django.db.models import F

@api_view(['GET'])
def get_files(request):
    """
    Returns a list of all files uploaded by the current user.
    """
    # 1. Query the Database
    files = FileReference.objects.filter(user=request.user)
    
    # 2. CALL THE SERIALIZER
    # 'many=True' tells it we are converting a list, not just one item.
    # 'context' is passed so the serializer can build full URLs (http://localhost...).
    serializer = FileReferenceSerializer(files, many=True, context={'request': request})
    
    # 3. Return the JSON data
    return Response(serializer.data)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """
    Handles file upload with deduplication logic.
    """
    # We validate the hash/filename before even looking at the file content
    meta_serializer = FileUploadSerializer(data=request.data)
    
    if not meta_serializer.is_valid():
        return Response(meta_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Extract validated data
    file_hash = meta_serializer.validated_data['hash']
    filename = meta_serializer.validated_data['filename']
    uploaded_file = request.FILES.get('file')

    if not uploaded_file:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        # Check if the blob already exists
        blob, created = PhysicalBlob.objects.get_or_create(
            sha256_hash=file_hash,
            defaults={
                'file': uploaded_file,
                'size': uploaded_file.size,
                'content_type': uploaded_file.content_type
            }
        )

        # Store reference count
        blob.ref_count = F('ref_count') + 1
        blob.save()

        blob.refresh_from_db()

        # Create the user's reference to this blob
        file_ref = FileReference.objects.create(
            user=request.user,
            blob=blob,
            filename=filename
        )

    # 3. CALL SERIALIZER FOR RESPONSE
    # Return the newly created file data to the frontend
    response_serializer = FileReferenceSerializer(file_ref, context={'request': request})
    
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
def delete_file(request, file_id):
    """
    Handles file deletion with reference counting logic.
    """
    print(file_id)
    try:
        # Ensure only the owner can delete their reference
        file_ref = FileReference.objects.get(id=file_id, user=request.user)
    except FileReference.DoesNotExist:
        return Response(
            {"error": "File not found or unauthorized"}, 
            status=status.HTTP_404_NOT_FOUND
        )

    # Get the associated blob before we delete the reference
    blob = file_ref.blob

    with transaction.atomic():
        # Delete user reference
        file_ref.delete()

        # Decrement blob count
        blob.ref_count = F('ref_count') - 1
        blob.save()
        
        # Refresh to get the actual value for the zero-check
        blob.refresh_from_db()

        # If no one else is pointing to this blob, delete it and the physical file
        if blob.ref_count <= 0:
            blob.file.delete(save=False)
            
            # Delete the blob record entirely
            blob.delete()

    return Response(
        {"message": "File removed successfully"}, 
        status=status.HTTP_204_NO_CONTENT
    )