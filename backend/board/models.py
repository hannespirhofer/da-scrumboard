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
    order = models.PositiveIntegerField(null=False, blank=False)

    def __str__(self):
        return f"{self.title} [{self.pk}] (Order: {self.order})"

    def save(self, *args, **kwargs):
        todos = Todo.objects.filter(column=self.column, board=self.board)
        old_order = kwargs.pop('old_order', None)
        totaltodos = todos.count()

        # mir hobn kuane order - a nuies todo
        if self.order is None:
            # setzn auf letztn plotz
            self.order = totaltodos

        # mir hobn an self.order
        else:
            # wenn er greaser isch wie die todoliste
            if self.order > totaltodos:
                self.order = totaltodos - 1
            # mir brauchn die olte order ah
            elif old_order is not None:
            # wenn er innerholb der liste isch
                if self.order > old_order:
                    todos.filter(order__gt=old_order, order__lte=self.order).update(order=models.F('order') - 1)
                elif self.order < old_order:
                    todos.filter(order__gte=self.order, order__lt=old_order).update(order=models.F('order') + 1)

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        deleted_order = self.order

        super().delete(*args, **kwargs)

        Todo.objects.filter(column=self.column, board=self.board, order__gt=deleted_order).update(order=models.F('order') - 1)