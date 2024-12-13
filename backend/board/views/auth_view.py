from django.contrib.auth import logout
from django.contrib.auth.models import User

from board.serializers import RegisterSerializer

from rest_framework import permissions
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import (
    BasicAuthentication,
    TokenAuthentication,
)


class RegisterView(CreateAPIView):
    """
    API View for user registration

    This view handles the creation of a new user. It allows any user
    to create an account by providing the necessary registration details

    Attributes:
        model (User): The model that this view interacts with
        permission_classes (list): The list of permission classes that are used by this view.
        serializer_class (RegisterSerializer): The serializer class that handles validation and
                                                deserialization of input data, as well as serialization
                                                of the response data.
    """

    model = User
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class LoginView(ObtainAuthToken):
    """
    API view for user login.

    This view handles user authentication and returns an authentication token
    upon successful login. It extends the ObtainAuthToken view provided by DRF.
    """

    def post(self, request, *args, **kwargs):
        """
        Handle POST requests for login

        This method validates the user credentials provided in the request data,
        generates an authentication token if the credentials are valid, and
        returns the token along with the users ID and email.
        """
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_id": user.pk, "email": user.email})


class LogoutView(APIView):

    authentication_classes = [
        BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response(
                {"message": "Logged out successfully"}, status=status.HTTP_200_OK
            )
        except Token.DoesNotExist:
            return Response(
                {"error": "Token does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )
