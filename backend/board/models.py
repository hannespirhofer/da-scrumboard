from django.db import models
from django.contrib.auth.models import User


class Board(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(
        User, related_name="boards", on_delete=models.CASCADE
    )  # TODO Add signal to transfer the board to next member on deletion
    members = models.ManyToManyField(User, related_name="board_members")

    def __str__(self):
        return f"ID: {self.pk} - {self.name}"


class Column(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"ID: {self.pk} - {self.name}"


class Todo(models.Model):
    title = models.CharField(max_length=255) #required as cant be null
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)

    board = models.ForeignKey(Board, related_name="todos", on_delete=models.CASCADE) #required as cant be null
    column = models.ForeignKey(Column, related_name="todos", on_delete=models.CASCADE) #required as cant be null
    author = models.ForeignKey(User, related_name="todos", on_delete=models.CASCADE) #required as cant be null

    def __str__(self):
        return f"ID: {self.pk} - {self.title}"
