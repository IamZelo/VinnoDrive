from django.urls import path
from .views import CreateUserView, LogoutView, UserProfileView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("register/", CreateUserView.as_view(), name="register"),
    path("token/obtain/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('logout/', LogoutView.as_view(), name='logout'),
    path("profile/", UserProfileView.as_view(), name="profile")
    
]
