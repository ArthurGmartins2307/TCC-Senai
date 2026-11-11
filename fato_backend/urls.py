"""
Fato ou Farsa — Roteador Central de URLs do Django
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def healthz_view(request):
    return JsonResponse({"status": "ok", "service": "django-fato-ou-farsa", "framework": "Django"})

urlpatterns = [
    path('healthz', healthz_view, name='healthz'),
    path('healthz/', healthz_view, name='healthz_slash'),
    path('admin/', admin.site.urls),
    path('api/', include('verification.urls')),
]

