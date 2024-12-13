from rest_framework import serializers

from board.models import Board

from .user_serializer import UserSerializer
from .column_serializer import ColumnSerializer


# Part of the Board Serializer to serialize User Data


class BoardSerializer(serializers.ModelSerializer):
    """
    Serializer For the Board

    Renders the columns by the ColumnSerializer inside the board
    """

    owner = UserSerializer()
    members = UserSerializer(many=True)
    columns = ColumnSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = "__all__"


class BoardsOverviewSerializer(serializers.ModelSerializer):
    """
    Serializer for the Board List Overview (Sidebar)

    This serializer is used to provide a simplified overview of boards,
    including only the ID and the name of each board. It is intended
    to be used for rendering a list of boards in the sidebar.
    """

    class Meta:
        model = Board
        # fields = "__all__"
        exclude = (
            "owner",
            "members",
        )
