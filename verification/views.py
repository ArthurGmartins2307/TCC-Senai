"""
Fato ou Farsa — Views da API REST (Django REST Framework)
Endpoints que atendem ao frontend React, processam auditorias,
persistem relatórios no Django ORM e conectam os serviços forenses.
"""

from datetime import datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings

from .models import (
    TikTokProfile,
    TikTokVideo,
    InvestigationReport,
    ClaimVerification,
    EvidenceSource
)
from .serializers import (
    InvestigationReportSerializer,
    TikTokProfileSerializer,
    TikTokVideoSerializer
)
from .services.tiktok_service import (
    test_tiktok_connection,
    fetch_tiktok_content,
    normalize_tiktok_input
)
from .services.statistics_service import (
    calculate_statistical_summary,
    compute_views_to_followers_ratio
)
from .services.fact_check_service import verify_claims_with_gemini
from .services.ai_analysis_service import analyze_content_with_gemini


@api_view(['GET'])
@permission_classes([AllowAny])
def api_status_view(request):
    """
    Retorna o status operacional do sistema, tecnologias ativas e conformidade da API.
    """
    has_gemini = bool(settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith('SUA_CHAVE'))
    has_tiktok_token = bool(settings.TIKTOK_ACCESS_TOKEN and not settings.TIKTOK_ACCESS_TOKEN.startswith('SEU_ACCESS'))
    has_tiktok_client = bool(settings.TIKTOK_CLIENT_KEY and not settings.TIKTOK_CLIENT_KEY.startswith('SEU_CLIENT'))

    return Response({
        'system': 'Fato ou Farsa API Gateway (Django REST Framework Backend)',
        'version': '4.0.0 (Django Architecture / TCC)',
        'framework': 'Django 5 + Django REST Framework',
        'platform': 'TikTok',
        'database': 'SQLite3 (Django ORM)',
        'gemini': {
            'configured': has_gemini,
            'model': settings.GEMINI_MODEL,
            'searchGroundingSupported': True,
            'mode': 'active' if has_gemini else 'deterministic_fallback'
        },
        'tiktok': {
            'configured': has_tiktok_token,
            'clientKeyConfigured': has_tiktok_client,
            'mode': 'tiktok_display_api' if has_tiktok_token else 'sandbox_curated',
            'apiVersion': 'v2',
            'permissionsRequired': [
                'user.info.basic',
                'user.info.profile',
                'user.info.stats',
                'video.list'
            ],
            'researchApiEligible': False,
            'termsCompliance': 'Anti-scraping strictly respected'
        },
        'factCheckEngine': {
            'status': 'online',
            'categories': [
                'Confirmada pelas evidências consultadas',
                'Contradita pelas evidências consultadas',
                'Parcialmente correta ou fora de contexto',
                'Evidências conflitantes',
                'Não verificada',
                'Afirmação não verificável'
            ],
            'sourcesCount': 8,
            'regulatoryAgencies': ['ANVISA', 'CFM', 'SBD', 'CVM', 'Banco Central'],
            'factCheckingPartners': ['Agência Lupa', 'Aos Fatos', 'Projeto Comprova', 'G1 Fato ou Fake']
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def tiktok_test_connection_view(request):
    """
    Testa credenciais oficiais com os endpoints da TikTok Developer Platform.
    """
    token = request.data.get('token')
    result = test_tiktok_connection(token)
    status_code = status.HTTP_200_OK if result.get('success') else status.HTTP_400_BAD_REQUEST
    return Response(result, status=status_code)


@api_view(['POST'])
@permission_classes([AllowAny])
def tiktok_profile_view(request):
    """
    Obtém informações de perfil e lista de vídeos do TikTok.
    """
    username_or_url = (
        request.data.get('usernameOrUrl') or
        request.data.get('username') or
        request.query_params.get('usernameOrUrl')
    )
    manual_transcript = request.data.get('manualTranscript')
    token = request.data.get('token')

    if not username_or_url and not manual_transcript:
        return Response(
            {'error': 'O link de vídeo do TikTok, @usuário ou transcrição manual é obrigatório.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        data = fetch_tiktok_content(
            username_or_url=username_or_url or '@video_tiktok',
            manual_transcript=manual_transcript,
            access_token=token
        )
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_stats_view(request):
    """
    Calcula métricas quantitativas, médias, medianas e taxas a partir de posts fornecidos.
    """
    posts = request.data.get('posts', [])
    follower_count = request.data.get('followerCount')

    stats_result = calculate_statistical_summary(posts, follower_count)
    return Response(stats_result)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_claims_view(request):
    """
    Checa afirmações factuais a partir de um texto, legenda ou transcrição.
    """
    caption = request.data.get('caption') or request.data.get('text') or request.data.get('transcript')
    if not caption:
        return Response({'error': 'O texto ou legenda para verificação é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    topic = request.data.get('topic', 'Geral')
    profile_name = request.data.get('profileName', '')

    result = verify_claims_with_gemini(caption, topic, profile_name)
    return Response(result)


@api_view(['POST'])
@permission_classes([AllowAny])
def full_analysis_view(request):
    """
    Executa a auditoria completa de um perfil/vídeo do TikTok e persiste no Django ORM:
    1. Obtenção dos dados do TikTok ou entrada manual
    2. Cálculo de métricas determinísticas
    3. Análise pelo agente de IA forense
    4. Persistência de Profile, Vídeos, Dossiê e Fontes no banco de dados SQLite
    5. Retorno do relatório estruturado
    """
    # Caso 1: Requisição do frontend para análise de IA com dados já carregados ({ profile, posts, statistics })
    if 'profile' in request.data and 'posts' in request.data:
        profile_data = request.data.get('profile') or {}
        posts_data = request.data.get('posts') or []
        stats_data = request.data.get('statistics') or {}
        ai_res = analyze_content_with_gemini(profile_data, posts_data, stats_data)
        return Response(ai_res, status=status.HTTP_200_OK)

    username_or_url = request.data.get('usernameOrUrl') or request.data.get('username')
    manual_transcript = request.data.get('manualTranscript')
    token = request.data.get('token')

    if not username_or_url and not manual_transcript:
        return Response({'error': 'Parâmetro usernameOrUrl ou manualTranscript é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Obtenção de dados do TikTok
        tiktok_res = fetch_tiktok_content(
            username_or_url=username_or_url or '@video_tiktok',
            manual_transcript=manual_transcript,
            access_token=token
        )

        raw_profile = tiktok_res['profile']
        raw_posts = tiktok_res['posts']

        # 2. Cálculos estatísticos
        stats = calculate_statistical_summary(raw_posts, raw_profile.get('followersCount'))

        # 3. Análise pelo agente de IA
        lead_post = raw_posts[0] if raw_posts else {}
        text_for_ai = manual_transcript or lead_post.get('transcript') or lead_post.get('caption') or raw_profile.get('biography') or ''
        
        fact_check = verify_claims_with_gemini(
            caption_or_transcript=text_for_ai,
            topic=raw_profile.get('category', 'Geral'),
            profile_name=raw_profile.get('username', '')
        )

        # 4. Persistência no Django ORM
        # a) Perfil
        profile_obj, _ = TikTokProfile.objects.update_or_create(
            username=raw_profile.get('username', 'criador_tiktok'),
            defaults={
                'full_name': raw_profile.get('fullName', ''),
                'avatar_url': raw_profile.get('avatar_url', ''),
                'is_verified': raw_profile.get('isVerified', False),
                'followers_count': raw_profile.get('followersCount', 0),
                'following_count': raw_profile.get('followingCount', 0),
                'likes_received_count': raw_profile.get('likesReceivedCount', 0),
                'videos_count': raw_profile.get('videosCount', len(raw_posts)),
                'biography': raw_profile.get('biography', ''),
                'category': raw_profile.get('category', 'Geral'),
                'profile_url': raw_profile.get('profileUrl', ''),
            }
        )

        # b) Vídeos
        for p in raw_posts:
            v_id = p.get('id') or p.get('videoId') or f"vid_{datetime.now().timestamp()}"
            TikTokVideo.objects.update_or_create(
                video_id=v_id,
                profile=profile_obj,
                defaults={
                    'caption': p.get('caption', ''),
                    'transcript': p.get('transcript', ''),
                    'sound_title': p.get('soundTitle', ''),
                    'url': p.get('url', ''),
                    'thumbnail_url': p.get('thumbnailUrl', ''),
                    'views_count': p.get('viewsCount'),
                    'likes_count': p.get('likesCount'),
                    'comments_count': p.get('commentsCount'),
                    'shares_count': p.get('sharesCount'),
                    'formatted_date': p.get('formattedDate', ''),
                    'is_outlier': p.get('isOutlier', False),
                    'anomaly_score': p.get('anomalyScore', 0.0)
                }
            )

        # c) Dossiê de Investigação
        report_id = f"report_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        overall_assessment = (
            'Risco Elevado: Foram identificadas afirmações sem comprovação científica ou em desacordo com órgãos reguladores.'
            if fact_check['overall_risk_level'] in ['alto', 'critico'] else
            'Análise Factual Concluída: Verifique as fontes institucionais associadas a cada alegação.'
        )
        risk_score = 85 if fact_check['overall_risk_level'] in ['alto', 'critico'] else 35

        report_obj = InvestigationReport.objects.create(
            report_id=report_id,
            profile=profile_obj,
            data_source=tiktok_res.get('source', 'sandbox_dataset'),
            is_demo=not tiktok_res.get('isLiveApi', False),
            status_message=tiktok_res.get('statusMessage', ''),
            input_query=username_or_url or '',
            manual_transcript=manual_transcript or '',
            sample_size=stats['sample_size'],
            date_range=stats['date_range'],
            average_views=stats['average_views'],
            median_views=stats['median_views'],
            std_dev_views=stats['std_dev_views'],
            average_likes=stats['average_likes'],
            average_comments=stats['average_comments'],
            average_shares=stats['average_shares'],
            views_to_followers_ratio=stats['views_to_followers_ratio'],
            engagement_rate=stats['engagement_rate'],
            frequency_json=stats['posting_frequency'],
            limitations_json=stats['data_limitations'],
            overall_assessment=overall_assessment,
            risk_score=risk_score,
            engine_used=fact_check['engine_used']
        )

        # d) Alegações e Evidências
        for claim_data in fact_check.get('claims', []):
            claim_obj = ClaimVerification.objects.create(
                report=report_obj,
                claim_text=claim_data.get('claim', ''),
                category=claim_data.get('category', 'Geral'),
                verdict=claim_data.get('verdict', 'Não verificada'),
                confidence_score=claim_data.get('confidence', 50),
                explanation=claim_data.get('explanation', ''),
                scientific_consensus=claim_data.get('scientific_consensus', '')
            )
            for src_data in claim_data.get('sources', []):
                EvidenceSource.objects.create(
                    claim=claim_obj,
                    name=src_data.get('name', 'Fonte Institucional'),
                    title=src_data.get('title', 'Documento de Referência'),
                    url=src_data.get('url', 'https://www.gov.br'),
                    quote=src_data.get('quote', ''),
                    is_official=src_data.get('isOfficial', True)
                )

        # Retorna serializado diretamente via DRF
        serializer = InvestigationReportSerializer(report_obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': f"Erro ao processar auditoria no Django: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def investigation_history_view(request):
    """
    Retorna o histórico persistido de investigações no banco de dados SQLite via Django ORM.
    """
    reports = InvestigationReport.objects.select_related('profile').prefetch_related('claims__sources').all()[:50]
    serializer = InvestigationReportSerializer(reports, many=True)
    return Response(serializer.data)
