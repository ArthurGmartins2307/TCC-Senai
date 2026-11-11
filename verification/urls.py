"""
Fato ou Farsa — Roteador de URLs do Módulo de Verificação (Django)
"""

from django.urls import path
from .views import (
    api_status_view,
    tiktok_test_connection_view,
    tiktok_profile_view,
    calculate_stats_view,
    verify_claims_view,
    full_analysis_view,
    investigation_history_view
)

urlpatterns = [
    # Status e diagnósticos
    path('status', api_status_view, name='api_status'),
    path('status/', api_status_view, name='api_status_slash'),

    # Testes de integração oficial do TikTok (e retrocompatibilidade)
    path('tiktok/test', tiktok_test_connection_view, name='tiktok_test'),
    path('tiktok/test/', tiktok_test_connection_view, name='tiktok_test_slash'),
    path('instagram/test', tiktok_test_connection_view, name='instagram_test_compat'),

    # Consulta de perfis e vídeos do TikTok
    path('tiktok/profile', tiktok_profile_view, name='tiktok_profile'),
    path('tiktok/profile/', tiktok_profile_view, name='tiktok_profile_slash'),
    path('instagram/profile', tiktok_profile_view, name='instagram_profile_compat'),

    # Cálculo estatístico determinístico
    path('calculate-stats', calculate_stats_view, name='calculate_stats'),
    path('calculate-stats/', calculate_stats_view, name='calculate_stats_slash'),

    # Checagem factual com IA e base forense
    path('verify-claims', verify_claims_view, name='verify_claims'),
    path('verify-claims/', verify_claims_view, name='verify_claims_slash'),

    # Pipeline forense completo com persistência no Django ORM
    path('analyze', full_analysis_view, name='full_analyze'),
    path('analyze/', full_analysis_view, name='full_analyze_slash'),

    # Histórico de auditorias
    path('history', investigation_history_view, name='investigation_history'),
    path('history/', investigation_history_view, name='investigation_history_slash'),
]
