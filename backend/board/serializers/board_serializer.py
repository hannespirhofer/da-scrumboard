from rest_framework import serializers
from board.models import Board, Column

from board.serializers.user_serializer import UserSerializer
from board.serializers.column_serializer import ColumnSerializer


# Part of the Board Serializer to serialize User Data

class BoardSerializer(serializers.ModelSerializer):
    """
    Serializer For the Board
    Renders the columns by the ColumnSerializer inside the board
    -> It adds the owner, members, columns data to the Board Serializer
    """
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = "__all__"

    owner = UserSerializer()
    members = UserSerializer(many=True)
    columns = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context.get("request")
        user = request.user
        return user == obj.owner

    # SerilizerMethodField checks for get_name method inside Class
    def get_columns(self, obj):
        columns = Column.objects.all()
        request = self.context.get("request")
        serializer_context = {
            "board_id": obj.id,
            "request": request
            }
        return ColumnSerializer(columns, many=True, context=serializer_context).data


class BoardsSerializer(serializers.ModelSerializer):
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
