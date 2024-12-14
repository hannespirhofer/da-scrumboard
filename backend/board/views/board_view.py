from board.models import Board
from django.db.models import Q

from board.serializers.board_serializer import BoardSerializer, BoardsSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    TokenAuthentication,
)


class BoardViewset(viewsets.ModelViewSet):
    """
    API View for board

    This view handles the complete data needed to render a board based on the given ID.
    It renders the board's name, ID, its members, columns and also the todos of each column.
    """

    queryset = Board.objects.all()
    authentication_classes = [
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    """
    Overrides the default Serializer if request is action 'list'

    This method adds a more generic and simpler serializer to list all active
    boards, which can be displayed in the sidebar.
    """

    # already authenticated here
    def get_queryset(self):
        user = self.request.user
        boards = Board.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        return boards

    """
    Change serializer for Detail request on board/id
    """

    def get_serializer_class(self):
        # For a single item accessed by /boards/:id
        if self.action == "retrieve":
            return BoardSerializer
        # For list items - action list accessed on /boards/
        return BoardsSerializer

    """
    Overrides the default create method on POST and adds the authenticated user as the owner of the board.
    """
    # Todo -> add another Serializer here -> actually BoardsSerializer is used here
    def perform_create(self, serializer):
        board = serializer.save(owner=self.request.user)
        board.members.add(self.request.user)
        board.save()
