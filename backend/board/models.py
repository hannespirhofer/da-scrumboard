from django.db import models
from django.db.models import Max
from django.contrib.auth.models import User
from requests import delete


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
    order = models.PositiveIntegerField(null=False, blank=False)

    def __str__(self):
        return f"Todo: {self.pk} - Order: {self.order}"

    def save(self, *args, **kwargs):
        todos = Todo.objects.filter(column=self.column, board=self.board)

        if self.order is None:
            self.order = todos.aggregate(Max('order'))['order__max'] + 1 if todos.exists() else 0
        else:
            total_todos = todos.count()
            if self.order > total_todos:
                self.order = total_todos

            todos.filter(order__gte=self.order).update(order=models.F('order') + 1)

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        deleted_order = self.order

        super().delete(*args, **kwargs)

        Todo.objects.filter(column=self.column, board=self.board, order__gt=deleted_order).update(order=models.F('order') - 1)