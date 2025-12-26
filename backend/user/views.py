from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveAPIView
from .serializers import UserProfileSerializer
from core.throttles import TwoSecondThrottle

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer;
    permission_classes = [AllowAny]
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        try:
            # 1. Get the refresh token from the request body
            refresh_token = request.data["refresh"]
            
            # 2. Create a RefreshToken object
            token = RefreshToken(refresh_token)
            
            # 3. Blacklist it (it can no longer be used to get access tokens)
            token.blacklist()

            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
class UserProfileView(RetrieveAPIView):
    """
    Securely returns the current user's details based on the JWT token.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [TwoSecondThrottle]
    serializer_class = UserProfileSerializer

    def get_object(self):
        # Return the user associated with the token in the request
        return self.request.user