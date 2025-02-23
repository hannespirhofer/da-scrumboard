from rest_framework.response import Response
from rest_framework import serializers

class TestSerializer(serializers.Serializer):
    message = serializers.SerializerMethodField()

    def get_message(self, obj):
        user = self.context.get('request').user

        data = {
            "request_user": user,
            "request_exists": self.context.get("request") is not None,
            "user": str(self.context.get("request").user) if self.context.get("request") else "No user",
        }

        return (data)