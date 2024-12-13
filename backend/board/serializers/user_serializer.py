from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model

    This serializer inlcudes the username, first name, last name and the ID of the user.
    """

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name")
