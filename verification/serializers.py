"""
Fato ou Farsa — Serializadores Django REST Framework (DRF)
Estrutura de serialização e validação para modelos de auditoria e endpoints REST.
"""

from rest_framework import serializers
from .models import (
    TikTokProfile,
    TikTokVideo,
    InvestigationReport,
    ClaimVerification,
    EvidenceSource
)


class EvidenceSourceSerializer(serializers.ModelSerializer):
    """Serializador de fontes e pareceres de órgãos oficiais."""
    isOfficial = serializers.BooleanField(source='is_official')

    class Meta:
        model = EvidenceSource
        fields = ['id', 'name', 'title', 'url', 'quote', 'isOfficial']


class ClaimVerificationSerializer(serializers.ModelSerializer):
    """Serializador de alegações factuais e categorização forense."""
    claim = serializers.CharField(source='claim_text')
    confidence = serializers.IntegerField(source='confidence_score')
    scientificConsensus = serializers.CharField(source='scientific_consensus', required=False, allow_blank=True)
    sources = EvidenceSourceSerializer(many=True, read_only=True)

    class Meta:
        model = ClaimVerification
        fields = [
            'id',
            'claim',
            'category',
            'verdict',
            'confidence',
            'explanation',
            'scientificConsensus',
            'sources'
        ]


class TikTokVideoSerializer(serializers.ModelSerializer):
    """Serializador de vídeos do TikTok e métricas públicas."""
    id = serializers.CharField(source='video_id')
    videoId = serializers.CharField(source='video_id')
    soundTitle = serializers.CharField(source='sound_title', required=False, allow_blank=True)
    formattedDate = serializers.CharField(source='formatted_date', required=False, allow_blank=True)
    viewsCount = serializers.IntegerField(source='views_count', allow_null=True)
    likesCount = serializers.IntegerField(source='likes_count', allow_null=True)
    commentsCount = serializers.IntegerField(source='comments_count', allow_null=True)
    sharesCount = serializers.IntegerField(source='shares_count', allow_null=True)
    thumbnailUrl = serializers.CharField(source='thumbnail_url', required=False, allow_blank=True)
    isOutlier = serializers.BooleanField(source='is_outlier')
    anomalyScore = serializers.FloatField(source='anomaly_score', required=False)

    class Meta:
        model = TikTokVideo
        fields = [
            'id',
            'videoId',
            'caption',
            'transcript',
            'soundTitle',
            'url',
            'thumbnailUrl',
            'viewsCount',
            'likesCount',
            'commentsCount',
            'sharesCount',
            'formattedDate',
            'isOutlier',
            'anomalyScore'
        ]


class TikTokProfileSerializer(serializers.ModelSerializer):
    """Serializador de perfis e criadores de conteúdo do TikTok."""
    fullName = serializers.CharField(source='full_name', required=False, allow_blank=True)
    avatarUrl = serializers.CharField(source='avatar_url', required=False, allow_blank=True)
    isVerified = serializers.BooleanField(source='is_verified')
    followersCount = serializers.IntegerField(source='followers_count')
    followingCount = serializers.IntegerField(source='following_count')
    likesReceivedCount = serializers.IntegerField(source='likes_received_count')
    videosCount = serializers.IntegerField(source='videos_count')
    profileUrl = serializers.CharField(source='profile_url', required=False, allow_blank=True)

    class Meta:
        model = TikTokProfile
        fields = [
            'username',
            'fullName',
            'avatarUrl',
            'isVerified',
            'followersCount',
            'followingCount',
            'likesReceivedCount',
            'videosCount',
            'biography',
            'category',
            'profileUrl'
        ]


class InvestigationReportSerializer(serializers.ModelSerializer):
    """
    Serializador do Dossiê Completo de Auditoria.
    Compatível com os modelos de interface TypeScript do frontend React.
    """
    id = serializers.CharField(source='report_id')
    createdAt = serializers.SerializerMethodField()
    profile = TikTokProfileSerializer(read_only=True)
    posts = serializers.SerializerMethodField()
    statistics = serializers.SerializerMethodField()
    aiAnalysis = serializers.SerializerMethodField()
    dataSource = serializers.CharField(source='data_source')
    isDemo = serializers.BooleanField(source='is_demo')
    statusMessage = serializers.CharField(source='status_message')

    class Meta:
        model = InvestigationReport
        fields = [
            'id',
            'createdAt',
            'profile',
            'posts',
            'statistics',
            'aiAnalysis',
            'dataSource',
            'isDemo',
            'statusMessage'
        ]

    def get_createdAt(self, obj):
        return obj.created_at.strftime('%d/%m/%Y %H:%M:%S')

    def get_posts(self, obj):
        if not obj.profile:
            return []
        videos = obj.profile.videos.all()[:20]
        return TikTokVideoSerializer(videos, many=True).data

    def get_statistics(self, obj):
        return {
            'averageViews': obj.average_views,
            'medianViews': obj.median_views,
            'stdDevViews': obj.std_dev_views,
            'averageLikes': obj.average_likes,
            'averageComments': obj.average_comments,
            'averageShares': obj.average_shares,
            'viewsToFollowersRatio': obj.views_to_followers_ratio,
            'viewsToFollowersFormula': '(average_views / follower_count) * 100',
            'engagementRate': obj.engagement_rate,
            'postingFrequency': obj.frequency_json or {},
            'sampleSize': obj.sample_size,
            'dateRange': obj.date_range,
            'dataLimitations': obj.limitations_json or []
        }

    def get_aiAnalysis(self, obj):
        claims = obj.claims.all()
        return {
            'overallAssessment': obj.overall_assessment,
            'riskScore': obj.risk_score,
            'claims': ClaimVerificationSerializer(claims, many=True).data,
            'engineUsed': obj.engine_used,
            'investigatedAt': obj.created_at.strftime('%d/%m/%Y %H:%M:%S'),
            'sourcesCount': sum(c.sources.count() for c in claims)
        }
