from board.models import Todo

from board.serializers import TodoSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.exceptions import PermissionDenied

# GET is not allowed
# All other methods are allowed like POST/PUT/PATCH/DELETE on /todos/<pk>/
# Add the trailing slash at the end!


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == "GET":
            raise PermissionDenied("GET method is not allowed on this endpoint.")
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
