from rest_framework import serializers

from board.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """
    Serializer For Todos

    Renders the todos inside the columns
    """

    class Meta:
        model = Todo
        fields = ("id", "title", "description", "column", "completed", "author")
