from rest_framework import serializers

from board.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    """
    Serializer For Todos

    """
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Todo
        fields = "__all__"
        extra_kwargs = {
            'author': {'required': False},
            'order': {'required': False}}

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return request.user == obj.author