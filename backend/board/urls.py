from django.urls import path, include
from rest_framework.routers import DefaultRouter
from board.views import (
    BoardViewset,
    LoginView,
    LogoutView,
    RegisterView,
    TodoViewSet,
)

# Create API router and register subroutes
router = DefaultRouter()
router.register(r"boards", BoardViewset)
router.register(r"todos", TodoViewSet)

# Django URLpatterns including router.urls(/api routes)
urlpatterns = [
    path("", include(router.urls)),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
]
