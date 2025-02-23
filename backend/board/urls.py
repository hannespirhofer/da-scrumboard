from django.urls import path, include
from rest_framework.routers import DefaultRouter
from board.views.member_view import MembersList
from board.views.test_view import test_context_view
from board.views import (
    LoginView,
    LogoutView,
    RegisterView,
    BoardViewset,
    TodoViewSet
)

# Create API router and register subroutes
router = DefaultRouter()
router.register(r"boards", BoardViewset)
router.register(r"todos", TodoViewSet)

# Django URLpatterns: /api/
urlpatterns = [
    path("", include(router.urls)),
    path("test/", test_context_view, name="test-context"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegisterView.as_view(), name="register"),
    path("members/", MembersList.as_view(), name="members"),
]
