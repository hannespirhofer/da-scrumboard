from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from rest_framework.authentication import (
    TokenAuthentication,
)
from rest_framework.response import Response
from board.serializers.member_serializer import MemberSerializer

class MembersList(ListAPIView):
    queryset = User.objects.all()
    serializer_class = MemberSerializer
    authentication_classes = [
        TokenAuthentication
    ]
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        queryset = User.objects.filter(is_active=True).order_by('-date_joined')
        serializer = MemberSerializer(queryset, many=True)
        return Response(serializer.data)