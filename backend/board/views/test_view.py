from rest_framework.decorators import api_view
from rest_framework.response import Response
from board.serializers.test_serializer import TestSerializer

@api_view(('GET',))
def test_context_view(request):
    serializer = TestSerializer({}, context={"request": request})
    return Response(serializer.data)