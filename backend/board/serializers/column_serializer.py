from rest_framework import serializers

from .todo_serializer import TodoSerializer

from board.models import Column


class ColumnSerializer(serializers.ModelSerializer):
    """
    Serializer For Columns

    Renders the todos by the TodosSerializer inside the columns
    """

    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ("id", "name", "board", "todos")
