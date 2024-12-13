from django.contrib import admin

from board.models import Board, Column, Todo


admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Todo)
