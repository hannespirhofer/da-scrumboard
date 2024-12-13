from django.db import models
from django.contrib.auth.models import User


class Board(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(
        User, related_name="boards", on_delete=models.CASCADE
    )  # TODO Add signal to transfer the board to next member on deletion
    members = models.ManyToManyField(User, related_name="board_members")

    def __str__(self):
        return self.name


class Column(models.Model):
    name = models.CharField(max_length=255)
    board = models.ForeignKey(Board, related_name="columns", on_delete=models.CASCADE)

    def __str__(self):
        return f"({self.board}) {self.name}"


class Todo(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    column = models.ForeignKey(Column, related_name="todos", on_delete=models.CASCADE)
    author = models.ForeignKey(
        User, related_name="todo_author", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.title
