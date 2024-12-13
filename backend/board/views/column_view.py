from board.models import Column

from board.serializers import ColumnSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)
from rest_framework.exceptions import PermissionDenied

# GET is not allowed
# All other methods are allowed like POST/PUT/PATCH/DELETE on /columns/<pk>/
# Add the trailing slash at the end!


class ColumnViewSet(viewsets.ModelViewSet):
    queryset = Column.objects.all()
    serializer_class = ColumnSerializer
    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.method == "GET":
            raise PermissionDenied("GET method is not allowed on this endpoint.")
        return super().get_queryset()
