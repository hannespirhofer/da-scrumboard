from django.urls import path, include
from rest_framework.routers import DefaultRouter
from board.views import (
    BoardViewset,
    TodoViewSet,
    LoginView,
    LogoutView,
    RegisterView,
)

# Create API router and register subroutes
router = DefaultRouter()
router.register(r"boards", BoardViewset)
router.register(r"todos", TodoViewSet)

# Django URLpatterns: /api/
urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
