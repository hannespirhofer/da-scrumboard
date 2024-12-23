from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from board.models import Todo



@receiver(post_delete, sender=Todo)
def reorder_after_delete(sender, instance, **kwargs):
    Todo.objects.filter(column=instance.column, board=instance.board, order__gt=instance.order).update(order=models.F('order') - 1)
