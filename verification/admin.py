"""
Fato ou Farsa — Configuração do Painel Administrativo Django (Admin)
Permite gerenciar perfis, vídeos, dossiês e fontes de evidência para fins acadêmicos e auditoria.
"""

from django.contrib import admin
from .models import (
    TikTokProfile,
    TikTokVideo,
    InvestigationReport,
    ClaimVerification,
    EvidenceSource
)


class TikTokVideoInline(admin.TabularInline):
    model = TikTokVideo
    extra = 0
    fields = ('video_id', 'views_count', 'likes_count', 'comments_count', 'shares_count', 'is_outlier')
    readonly_fields = ('video_id', 'views_count', 'likes_count', 'comments_count', 'shares_count')


@admin.register(TikTokProfile)
class TikTokProfileAdmin(admin.ModelAdmin):
    list_display = ('username', 'full_name', 'followers_count', 'likes_received_count', 'videos_count', 'is_verified', 'category', 'updated_at')
    search_fields = ('username', 'full_name', 'biography')
    list_filter = ('is_verified', 'category')
    inlines = [TikTokVideoInline]


@admin.register(TikTokVideo)
class TikTokVideoAdmin(admin.ModelAdmin):
    list_display = ('video_id', 'profile', 'views_count', 'likes_count', 'is_outlier', 'formatted_date')
    search_fields = ('video_id', 'caption', 'transcript', 'profile__username')
    list_filter = ('is_outlier',)


class EvidenceSourceInline(admin.TabularInline):
    model = EvidenceSource
    extra = 0


class ClaimVerificationInline(admin.StackedInline):
    model = ClaimVerification
    extra = 0


@admin.register(InvestigationReport)
class InvestigationReportAdmin(admin.ModelAdmin):
    list_display = ('report_id', 'profile', 'data_source', 'average_views', 'views_to_followers_ratio', 'risk_score', 'created_at')
    search_fields = ('report_id', 'profile__username', 'overall_assessment')
    list_filter = ('data_source', 'is_demo')
    inlines = [ClaimVerificationInline]


@admin.register(ClaimVerification)
class ClaimVerificationAdmin(admin.ModelAdmin):
    list_display = ('claim_text', 'verdict', 'confidence_score', 'category', 'created_at')
    search_fields = ('claim_text', 'explanation')
    list_filter = ('verdict', 'category')
    inlines = [EvidenceSourceInline]


@admin.register(EvidenceSource)
class EvidenceSourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'is_official', 'url')
    search_fields = ('name', 'title', 'quote')
    list_filter = ('is_official',)
