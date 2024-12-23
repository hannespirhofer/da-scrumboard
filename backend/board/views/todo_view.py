from board.models import Todo

from board.serializers.todo_serializer import TodoSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.exceptions import PermissionDenied

import logging

# GET is not allowed
# All other methods are allowed like POST/PUT/PATCH/DELETE on /todos/<pk>/
# Add the trailing slash at the end!


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == "GET":
            # Block this resource
            raise PermissionDenied("GET method is not allowed on this endpoint.")

        # Set the default queryset, defined above -> use method instead prop for cached results
        return super().get_queryset()

    def perform_create(self, serializer):
        try:
            todo = serializer.save(author=self.request.user)
            logging.info(f"Todo saved: {todo}")
        except Exception as e:
            logging.error(f"Couldn `t save the todo: {e}")
