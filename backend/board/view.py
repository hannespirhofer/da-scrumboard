import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from rest_framework.request import Request

class HelloWorld(APIView):
    # authentication_classes = [authentication.BasicAuthentication]
    # permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        print (request)
        if request.method == "GET":
            return Response({"message": "GET request!"})
        return Response({"message": "No GET request!"})