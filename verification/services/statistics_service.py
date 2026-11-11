"""
Fato ou Farsa — Módulo de Estatísticas Determinísticas (Django Service)
Calcula métricas agregadas do ecossistema do TikTok, médias, medianas,
taxas de conversão e anomalias prevenindo estritamente divisão por zero.
"""

import math
from typing import List, Dict, Any, Optional
from datetime import datetime


def safe_number(val: Any) -> Optional[float]:
    """Converte valor para float ou retorna None se for nulo/inválido."""
    if val is None:
        return None
    try:
        n = float(val)
        return None if math.isnan(n) else n
    except (ValueError, TypeError):
        return None


def compute_average(values: List[float]) -> float:
    """Calcula a média aritmética simples de uma lista de números válidos."""
    if not values:
        return 0.0
    return sum(values) / len(values)


def compute_median(values: List[float]) -> float:
    """Calcula a mediana estatística de uma lista de números válidos."""
    if not values:
        return 0.0
    s = sorted(values)
    n = len(s)
    mid = n // 2
    if n % 2 == 1:
        return float(s[mid])
    return (s[mid - 1] + s[mid]) / 2.0


def compute_std_dev(values: List[float], avg: float) -> float:
    """Calcula o desvio padrão amostral."""
    if len(values) < 2:
        return 0.0
    variance = sum((x - avg) ** 2 for x in values) / (len(values) - 1)
    return math.sqrt(variance)


def compute_views_to_followers_ratio(average_views: float, follower_count: Optional[int]) -> Optional[float]:
    """
    Calcula a relação percentual entre a média de visualizações e o total de seguidores.
    Fórmula obrigatória especificada pelo usuário:
        (average_views / follower_count) * 100

    NOTA METODOLÓGICA (TCC / Pesquisa):
    Este percentual NÃO representa a proporção de seguidores que assistiram aos vídeos.
    No TikTok, visualizações incluem recomendações para não seguidores na página "Para Você" (FYP),
    reproduções em loop e acessos externos.
    """
    if follower_count is None or follower_count <= 0:
        return None
    if average_views <= 0:
        return 0.0
    return round((average_views / float(follower_count)) * 100.0, 2)


def compute_engagement_rate(
    total_likes: float,
    total_comments: float,
    total_shares: float,
    total_views: float
) -> Optional[float]:
    """
    Calcula a taxa de engajamento baseada em interações totais sobre reproduções:
        ((likes + comments + shares) / total_views) * 100
    Retorna None caso total_views seja 0 ou indisponível.
    """
    if total_views <= 0:
        return None
    interactions = total_likes + total_comments + total_shares
    return round((interactions / total_views) * 100.0, 2)


def compute_posting_frequency(posts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calcula a frequência média de publicação (vídeos por semana e intervalo em dias)
    baseado nas datas dos vídeos da amostra.
    """
    timestamps: List[datetime] = []
    for p in posts:
        ts = p.get('timestamp') or p.get('create_time') or p.get('posted_at')
        if ts:
            try:
                if isinstance(ts, (int, float)):
                    timestamps.append(datetime.utcfromtimestamp(ts))
                elif isinstance(ts, str):
                    cleaned_ts = ts.replace('Z', '+00:00')
                    timestamps.append(datetime.fromisoformat(cleaned_ts))
                elif isinstance(ts, datetime):
                    timestamps.append(ts)
            except Exception:
                continue

    if len(timestamps) < 2:
        return {
            'videos_per_week': None,
            'days_between_posts_avg': None,
            'date_range_start': timestamps[0].strftime('%d/%m/%Y') if timestamps else None,
            'date_range_end': timestamps[0].strftime('%d/%m/%Y') if timestamps else None,
            'total_days_span': 0
        }

    timestamps.sort()
    start_dt = timestamps[0]
    end_dt = timestamps[-1]
    days_span = max(1, (end_dt - start_dt).days)

    posts_count = len(timestamps)
    videos_per_day = posts_count / float(days_span)
    videos_per_week = round(videos_per_day * 7.0, 1)
    days_between = round(float(days_span) / max(1, posts_count - 1), 1)

    return {
        'videos_per_week': videos_per_week,
        'days_between_posts_avg': days_between,
        'date_range_start': start_dt.strftime('%d/%m/%Y'),
        'date_range_end': end_dt.strftime('%d/%m/%Y'),
        'total_days_span': days_span
    }


def calculate_statistical_summary(
    posts: List[Dict[str, Any]],
    follower_count: Optional[int] = None
) -> Dict[str, Any]:
    """
    Executa a auditoria quantitativa completa da amostra de vídeos do TikTok.
    """
    if not posts:
        return {
            'sample_size': 0,
            'date_range': 'Nenhum dado',
            'average_views': 0.0,
            'median_views': 0.0,
            'std_dev_views': 0.0,
            'average_likes': 0.0,
            'average_comments': 0.0,
            'average_shares': 0.0,
            'views_to_followers_ratio': None,
            'views_to_followers_formula': '(average_views / follower_count) * 100',
            'engagement_rate': None,
            'posting_frequency': {},
            'outlier_videos': [],
            'data_limitations': [
                'Nenhum vídeo fornecido ou selecionado para a amostra de análise.'
            ]
        }

    views_list = [safe_number(p.get('viewsCount') or p.get('views') or p.get('view_count')) for p in posts]
    likes_list = [safe_number(p.get('likesCount') or p.get('likes') or p.get('like_count')) for p in posts]
    comments_list = [safe_number(p.get('commentsCount') or p.get('comments') or p.get('comment_count')) for p in posts]
    shares_list = [safe_number(p.get('sharesCount') or p.get('shares') or p.get('share_count')) for p in posts]

    valid_views = [v for v in views_list if v is not None]
    valid_likes = [l for l in likes_list if l is not None]
    valid_comments = [c for c in comments_list if c is not None]
    valid_shares = [s for s in shares_list if s is not None]

    avg_views = round(compute_average(valid_views), 1)
    median_views = round(compute_median(valid_views), 1)
    std_views = round(compute_std_dev(valid_views, avg_views), 1)

    avg_likes = round(compute_average(valid_likes), 1)
    avg_comments = round(compute_average(valid_comments), 1)
    avg_shares = round(compute_average(valid_shares), 1)

    total_views = sum(valid_views)
    total_likes = sum(valid_likes)
    total_comments = sum(valid_comments)
    total_shares = sum(valid_shares)

    views_to_followers = compute_views_to_followers_ratio(avg_views, follower_count)
    engagement_rate = compute_engagement_rate(total_likes, total_comments, total_shares, total_views)
    frequency = compute_posting_frequency(posts)

    # Identificar vídeos atípicos (outliers com fator multiplicador sobre a mediana)
    outliers = []
    threshold = max(50000.0, median_views * 2.5) if median_views > 0 else 100000.0
    for p in posts:
        v = safe_number(p.get('viewsCount') or p.get('views') or p.get('view_count')) or 0
        if v > threshold and len(posts) > 2:
            outliers.append({
                'id': p.get('id') or p.get('videoId') or p.get('video_id'),
                'caption': p.get('caption') or 'Vídeo sem legenda',
                'views': v,
                'likes': safe_number(p.get('likesCount') or p.get('likes') or p.get('like_count')) or 0,
                'anomaly_factor': round(v / max(1.0, median_views), 1)
            })

    limitations = [
        'A taxa de visualizações por seguidores pode ultrapassar 100% devido ao algoritmo de recomendação do TikTok (página Para Você / FYP).',
        'Contagens de visualizações incluem repetições do mesmo usuário e não devem ser interpretadas como alcance exclusivo.',
        'Os dados refletem exclusivamente a amostra consultada e métricas disponibilizadas pela TikTok API ou inseridas pelo usuário.'
    ]

    return {
        'sample_size': len(posts),
        'date_range': f"{frequency.get('date_range_start') or 'Início'} até {frequency.get('date_range_end') or 'Recente'}",
        'average_views': avg_views,
        'median_views': median_views,
        'std_dev_views': std_views,
        'average_likes': avg_likes,
        'average_comments': avg_comments,
        'average_shares': avg_shares,
        'views_to_followers_ratio': views_to_followers,
        'views_to_followers_formula': '(average_views / follower_count) * 100',
        'engagement_rate': engagement_rate,
        'posting_frequency': frequency,
        'outlier_videos': outliers,
        'data_limitations': limitations
    }
