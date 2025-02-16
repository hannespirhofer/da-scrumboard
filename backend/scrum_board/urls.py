from django.contrib import admin
from django.urls import include, path
from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path("api/", include("board.urls")),
    path("admin/", admin.site.urls),
] + debug_toolbar_urls()
