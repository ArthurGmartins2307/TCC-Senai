"""
Fato ou Farsa — Serviço de Integração com a API do TikTok (Django Service)
Gerencia a comunicação com as APIs oficiais do TikTok for Developers:
1. TikTok Display API (OAuth v2 via Login Kit)
2. TikTok Research API (Acesso qualificado para instituições de pesquisa acadêmica)
3. Fluxo de Fallback ético para legendas, transcrições e entradas informadas
"""

import urllib.parse
from typing import Dict, Any, List, Optional
import requests
from django.conf import settings


def normalize_tiktok_input(user_input: str) -> Dict[str, Any]:
    """
    Normaliza e extrai dados estruturados a partir de uma URL ou identificador do TikTok.
    Exemplos:
      - https://www.tiktok.com/@saude_vital/video/7389201928371928392
      - https://vm.tiktok.com/ZMxxxxxx/
      - @saude_vital
      - saude_vital
    """
    trimmed = (user_input or '').strip()
    if not trimmed:
        raise ValueError("Entrada vazia. Forneça uma URL de vídeo, perfil ou @usuário do TikTok.")

    # Se for uma URL completa
    if 'tiktok.com' in trimmed:
        url_str = trimmed if trimmed.startswith('http') else f"https://{trimmed}"
        parsed = urllib.parse.urlparse(url_str)
        path_parts = [p for p in parsed.path.split('/') if p]

        # Formato padrão: /@username/video/{video_id}
        user_part = next((p for p in path_parts if p.startswith('@')), None)
        video_idx = -1
        for idx, p in enumerate(path_parts):
            if p == 'video':
                video_idx = idx
                break

        if user_part and video_idx != -1 and len(path_parts) > video_idx + 1:
            clean_username = user_part.replace('@', '')
            video_id = path_parts[video_idx + 1].split('?')[0]
            return {
                'type': 'video',
                'username': clean_username,
                'video_id': video_id,
                'clean_input': f"@{clean_username} (Vídeo {video_id})",
                'url': f"https://www.tiktok.com/@{clean_username}/video/{video_id}"
            }

        if user_part:
            clean_username = user_part.replace('@', '')
            return {
                'type': 'profile',
                'username': clean_username,
                'video_id': None,
                'clean_input': f"@{clean_username}",
                'url': f"https://www.tiktok.com/@{clean_username}"
            }

        # Links encurtados vm.tiktok.com
        return {
            'type': 'video',
            'username': 'criador_tiktok',
            'video_id': None,
            'clean_input': trimmed,
            'url': url_str
        }

    # Se for identificador numérico
    if trimmed.isdigit() and len(trimmed) >= 15:
        return {
            'type': 'video',
            'username': 'criador_tiktok',
            'video_id': trimmed,
            'clean_input': f"Vídeo ID {trimmed}",
            'url': f"https://www.tiktok.com/video/{trimmed}"
        }

    clean_user = trimmed.replace('@', '').strip()
    return {
        'type': 'profile',
        'username': clean_user,
        'video_id': None,
        'clean_input': f"@{clean_user}",
        'url': f"https://www.tiktok.com/@{clean_user}"
    }


def test_tiktok_connection(access_token: Optional[str] = None) -> Dict[str, Any]:
    """
    Testa a conectividade com os endpoints oficiais da TikTok Developer Platform.
    Utiliza o access_token fornecido ou a chave de ambiente TIKTOK_ACCESS_TOKEN.
    """
    token = access_token or getattr(settings, 'TIKTOK_ACCESS_TOKEN', '')

    if not token or token.startswith('SEU_'):
        return {
            'success': False,
            'mode': 'unconfigured',
            'error': 'Nenhum Access Token do TikTok configurado.',
            'guidance': (
                'Para consultar a TikTok Display API, registre uma aplicação em '
                'https://developers.tiktok.com/ e configure as permissões: '
                'user.info.basic, user.info.profile, user.info.stats e video.list.'
            )
        }

    url = f"{getattr(settings, 'TIKTOK_API_BASE', 'https://open.tiktokapis.com/v2')}/user/info/"
    headers = {
        'Authorization': f"Bearer {token}",
        'Content-Type': 'application/json'
    }
    params = {
        'fields': 'open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count'
    }

    try:
        resp = requests.get(url, headers=headers, params=params, timeout=10)
        data = resp.json()

        if resp.status_code == 200 and data.get('error', {}).get('code') == 'ok':
            user_info = data.get('data', {}).get('user', {})
            return {
                'success': True,
                'mode': 'live_tiktok_display_api',
                'user': user_info,
                'message': 'Conexão autorizada com a TikTok Display API v2 estabelecida com sucesso.'
            }
        else:
            err_msg = data.get('error', {}).get('message') or resp.text
            return {
                'success': False,
                'status_code': resp.status_code,
                'error': f"Erro da API TikTok: {err_msg}",
                'mode': 'api_error'
            }
    except requests.exceptions.RequestException as e:
        return {
            'success': False,
            'error': f"Falha de rede ao conectar à API do TikTok: {str(e)}",
            'mode': 'network_failure'
        }


def fetch_live_tiktok_videos(access_token: str, max_count: int = 15) -> List[Dict[str, Any]]:
    """
    Obtém vídeos do criador autenticado via /v2/video/list/
    """
    url = f"{getattr(settings, 'TIKTOK_API_BASE', 'https://open.tiktokapis.com/v2')}/video/list/"
    headers = {
        'Authorization': f"Bearer {access_token}",
        'Content-Type': 'application/json'
    }
    body = {'max_count': min(max_count, 20)}

    resp = requests.post(
        url,
        headers=headers,
        json=body,
        params={'fields': 'id,title,video_description,duration,cover_image_url,share_url,like_count,comment_count,share_count,view_count,create_time'},
        timeout=12
    )

    if resp.status_code != 200:
        raise RuntimeError(f"Erro {resp.status_code} na rota /v2/video/list/: {resp.text}")

    data = resp.json()
    raw_videos = data.get('data', {}).get('videos', [])
    normalized_videos = []

    for v in raw_videos:
        vid_id = v.get('id')
        create_time = v.get('create_time')
        date_str = ""
        if create_time:
            from datetime import datetime
            date_str = datetime.utcfromtimestamp(create_time).strftime('%d/%m/%Y')

        normalized_videos.append({
            'id': vid_id,
            'videoId': vid_id,
            'caption': v.get('video_description') or v.get('title') or 'Vídeo do TikTok sem legenda',
            'type': 'video',
            'viewsCount': v.get('view_count'),
            'likesCount': v.get('like_count'),
            'commentsCount': v.get('comment_count'),
            'sharesCount': v.get('share_count'),
            'timestamp': create_time,
            'formattedDate': date_str,
            'url': v.get('share_url') or f"https://www.tiktok.com/video/{vid_id}",
            'thumbnailUrl': v.get('cover_image_url') or ''
        })

    return normalized_videos


def get_demo_tiktok_dataset(username_or_topic: str) -> Dict[str, Any]:
    """
    Retorna conjuntos de dados curados para demonstração e pesquisa acadêmica,
    respeitando os cenários clássicos de desinformação no TikTok (Saúde, Finanças, Notícias).
    """
    clean = username_or_topic.lower()
    
    if 'saude' in clean or 'vital' in clean or 'cura' in clean:
        return {
            'profile': {
                'username': 'saude_vital_brasil',
                'fullName': 'Saúde & Vitalidade Natural',
                'avatarUrl': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150',
                'isVerified': False,
                'followersCount': 148500,
                'followingCount': 120,
                'likesReceivedCount': 1250000,
                'videosCount': 42,
                'biography': 'Dicas de saúde natural e receitas secretas para curar qualquer mal-estar.',
                'category': 'Saúde & Bem-estar',
                'profileUrl': 'https://www.tiktok.com/@saude_vital_brasil'
            },
            'posts': [
                {
                    'id': 'tt_video_01',
                    'videoId': '7389201928371928301',
                    'type': 'video',
                    'caption': 'Chá da Amazônia reverte diabetes tipo 2 em 48 horas! A indústria farmacêutica quer esconder.',
                    'transcript': 'Basta tomar 200ml dessa erva fervida antes de dormir para que seu pâncreas produza insulina nova em 48 horas e destrua a glicose alta para sempre.',
                    'soundTitle': 'Áudio original - Saúde e Vida',
                    'timestamp': '2026-10-18T14:30:00Z',
                    'formattedDate': '18/10/2026',
                    'viewsCount': 892000,
                    'likesCount': 64200,
                    'commentsCount': 3820,
                    'sharesCount': 18400,
                    'isOutlier': True,
                    'url': 'https://www.tiktok.com/@saude_vital_brasil/video/7389201928371928301',
                    'thumbnailUrl': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
                },
                {
                    'id': 'tt_video_02',
                    'videoId': '7389201928371928302',
                    'type': 'video',
                    'caption': 'Receita de suco verde matinal com maçã, couve e gengibre para desinchar.',
                    'transcript': 'Suco com ingredientes comuns para auxiliar na hidratação diária.',
                    'soundTitle': 'Som relaxante acústico',
                    'timestamp': '2026-10-14T09:15:00Z',
                    'formattedDate': '14/10/2026',
                    'viewsCount': 24500,
                    'likesCount': 1850,
                    'commentsCount': 110,
                    'sharesCount': 230,
                    'isOutlier': False,
                    'url': 'https://www.tiktok.com/@saude_vital_brasil/video/7389201928371928302',
                    'thumbnailUrl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
                },
                {
                    'id': 'tt_video_03',
                    'videoId': '7389201928371928303',
                    'type': 'video',
                    'caption': 'Água com limão morna em jejum emagrece 10kg em uma semana sem exercício.',
                    'transcript': 'Essa mistura dissolve gordura visceral enquanto você dorme, comprovado em estudo chinês.',
                    'soundTitle': 'Música motivacional de academia',
                    'timestamp': '2026-10-09T18:00:00Z',
                    'formattedDate': '09/10/2026',
                    'viewsCount': 420000,
                    'likesCount': 28900,
                    'commentsCount': 1420,
                    'sharesCount': 9200,
                    'isOutlier': True,
                    'url': 'https://www.tiktok.com/@saude_vital_brasil/video/7389201928371928303',
                    'thumbnailUrl': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400'
                }
            ]
        }

    # Padrão: perfil geral sob auditoria
    return {
        'profile': {
            'username': clean.replace('@', '') or 'criador_tiktok',
            'fullName': f"Canal TikTok {clean.replace('@', '').capitalize()}",
            'avatarUrl': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'isVerified': False,
            'followersCount': 50000,
            'followingCount': 200,
            'likesReceivedCount': 450000,
            'videosCount': 18,
            'biography': 'Perfil público investigado através da plataforma Fato ou Farsa.',
            'category': 'Geral',
            'profileUrl': f"https://www.tiktok.com/@{clean.replace('@', '')}"
        },
        'posts': [
            {
                'id': 'tt_generic_01',
                'videoId': '7390001928371928001',
                'type': 'video',
                'caption': 'Conteúdo recente publicado pelo perfil no TikTok para verificação.',
                'transcript': 'Declaração sob análise de evidências e conformidade institucional.',
                'soundTitle': 'Áudio Original',
                'timestamp': '2026-10-20T12:00:00Z',
                'formattedDate': '20/10/2026',
                'viewsCount': 78000,
                'likesCount': 5200,
                'commentsCount': 340,
                'sharesCount': 810,
                'isOutlier': False,
                'url': f"https://www.tiktok.com/@{clean.replace('@', '')}",
                'thumbnailUrl': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400'
            }
        ]
    }


def fetch_tiktok_content(
    username_or_url: str,
    manual_transcript: Optional[str] = None,
    access_token: Optional[str] = None
) -> Dict[str, Any]:
    """
    Ponto de entrada unificado para obtenção de dados do TikTok:
    1. Tenta API oficial se token for fornecido/configurado.
    2. Incorpora transcrição/legenda manual se enviada pelo usuário.
    3. Utiliza conjunto de demonstração transparente com sinalização clara.
    """
    normalized = normalize_tiktok_input(username_or_url)
    target_username = normalized.get('username') or 'criador_tiktok'
    token = access_token or getattr(settings, 'TIKTOK_ACCESS_TOKEN', '')

    if token and not token.startswith('SEU_'):
        test_res = test_tiktok_connection(token)
        if test_res.get('success'):
            try:
                user_api = test_res.get('user', {})
                videos_api = fetch_live_tiktok_videos(token)
                
                profile_data = {
                    'username': user_api.get('display_name') or target_username,
                    'fullName': user_api.get('display_name') or target_username,
                    'avatarUrl': user_api.get('avatar_url') or '',
                    'isVerified': bool(user_api.get('is_verified')),
                    'followersCount': user_api.get('follower_count', 0),
                    'followingCount': user_api.get('following_count', 0),
                    'likesReceivedCount': user_api.get('likes_count', 0),
                    'videosCount': user_api.get('video_count', len(videos_api)),
                    'biography': user_api.get('bio_description') or '',
                    'category': 'Criador Autorizado',
                    'profileUrl': user_api.get('profile_deep_link') or f"https://www.tiktok.com/@{target_username}"
                }

                if manual_transcript and videos_api:
                    videos_api[0]['transcript'] = manual_transcript

                from datetime import datetime
                return {
                    'source': 'tiktok_display_api',
                    'isLiveApi': True,
                    'statusMessage': 'Dados obtidos diretamente da TikTok Display API v2 com credenciais autorizadas.',
                    'retrievedAt': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
                    'profile': profile_data,
                    'posts': videos_api,
                    'apiDetails': {
                        'endpoint': '/v2/video/list/ e /v2/user/info/',
                        'scopes': ['user.info.basic', 'user.info.stats', 'video.list']
                    }
                }
            except Exception as e:
                print(f"[TikTokService Django] Erro ao carregar dados oficiais: {e}")

    curated = get_demo_tiktok_dataset(target_username)
    posts = curated.get('posts', [])

    if manual_transcript and posts:
        posts[0]['transcript'] = manual_transcript
        posts[0]['caption'] = f"{posts[0].get('caption', '')} (Transcrição informada pelo usuário)"

    from datetime import datetime
    return {
        'source': 'sandbox_dataset' if not manual_transcript else 'manual_input',
        'isLiveApi': False,
        'statusMessage': (
            'Modo de Pesquisa / Simulação Transparente: APIs públicas do TikTok para contas de terceiros '
            'exigem elegibilidade de pesquisa (Research API). Operando com amostragem homologada e checagem factual direta.'
            if not manual_transcript else
            'Fluxo de Entrada Informada: Legenda e transcrição fornecidas manualmente para verificação factual.'
        ),
        'retrievedAt': datetime.now().strftime('%d/%m/%Y %H:%M:%S'),
        'profile': curated['profile'],
        'posts': posts,
        'apiDetails': {
            'endpoint': 'Fluxo Alternativo Conforme Termos de Serviço TikTok',
            'researchApiEligible': False,
            'note': 'Em conformidade com a política anti-scraping do TikTok'
        }
    }
