from board.models import Column, Todo

from board.serializers.todo_serializer import TodoSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    TokenAuthentication,
    BasicAuthentication
)
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

import logging

# GET is not allowed
# All other methods are allowed like POST/PUT/PATCH/DELETE on /todos/<pk>/
# Add the trailing slash at the end!


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == "GET":
            pass
            # Block this resource
            # raise PermissionDenied("GET method is not allowed on this endpoint.")

        # Set the default queryset, defined above -> use method instead prop for cached results
        return super().get_queryset()

    def perform_create(self, serializer):
        try:
            todo = serializer.save(author=self.request.user)
            logging.info(f"Todo saved: {todo}")
        except Exception as e:
            logging.error(f"Couldn `t save the todo: {e}")

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data

        old_order = instance.order

        if 'order' in data:
            instance.order = data['order']

        if 'column' in data:
            column_id = data['column']
            try:
                instance.column = Column.objects.get(id=column_id)
            except Column.DoesNotExist:
                return Response({'error': 'Invalid Column Id'}, status=400)

        instance.save(old_order=old_order)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data = request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
