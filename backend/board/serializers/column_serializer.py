from multiprocessing import context
from rest_framework import serializers

from .todo_serializer import TodoSerializer

from board.models import Column


class ColumnSerializer(serializers.ModelSerializer):
    """
    Serializer For Columns

    Renders the todos by the TodosSerializer inside the columns
    """

    todos = serializers.SerializerMethodField()

    def get_todos(self, obj):
        board_id = self.context.get("board_id")
        request = self.context.get("request")
        if board_id:
            todos = obj.todos.filter(board_id = board_id).order_by('order')
            return TodoSerializer(todos, many = True, context={"request": request}).data
        return []

    class Meta:
        model = Column
        fields = "__all__"
