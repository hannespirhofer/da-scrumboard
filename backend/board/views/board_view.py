from board.models import Board
from django.db.models import Q

from board.serializers import BoardSerializer, BoardsOverviewSerializer

from rest_framework import permissions, viewsets
from rest_framework.authentication import (
    BasicAuthentication,
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
        # BasicAuthentication,
        TokenAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    """
    Overrides the default Serializer if request is action 'list'

    This method adds a more generic and simpler serializer to list all active
    boards, which can be displayed in the sidebar.
    """

    def get_queryset(self):
        user = self.request.user
        boards = Board.objects.filter(Q(owner=user) | Q(members=user)).distinct()
        return boards

    # All methods available (just a simpler serializer for retrieve (Detail View) method)

    def get_serializer_class(self):
        # For a single item
        if self.action == "retrieve":
            return BoardSerializer
        # For list items - action list
        return BoardsOverviewSerializer

    """
    Overrides the default create method on POST and adds the authenticated user as the owner of the board.
    """

    def perform_create(self, serializer):
        board = serializer.save(owner=self.request.user)
        board.members.add(self.request.user)
        board.save()
