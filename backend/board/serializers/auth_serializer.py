from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for User Registration

    This serializer handles the creation of a new user, including
    setting a password, and validating the required fields.
    """

    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    def create(self, validated_data):
        """
        Create and return a new user instance, given the validated data
        """

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user

    class Meta:
        """
        Meta options for RegisterSerializer

        Attributes
            model (User): The model that this serializer serializes
            fields (tuple): The fields that should be included in the serialized output
        """

        model = User
        fields = (
            "id",
            "email",
            "username",
            "password",
        )
