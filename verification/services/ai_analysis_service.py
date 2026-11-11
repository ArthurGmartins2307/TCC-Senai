"""
Fato ou Farsa — Serviço de Análise Forense de IA (Django Service)
Suporta Google GenAI SDK (gemini-2.5-flash / gemini-3.8-flash) e motor determinístico com 5 classificações oficiais:
- "Sem indícios relevantes identificados"
- "Indícios que merecem investigação"
- "Possível conteúdo enganoso"
- "Evidências consistentes de falsidade ou manipulação"
- "Dados insuficientes para concluir"
"""

import json
from datetime import datetime
from typing import Dict, Any, List
from django.conf import settings


def analyze_content_with_gemini(profile: Dict[str, Any], posts: List[Dict[str, Any]], statistics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executa a avaliação forense de vídeos e perfil do TikTok utilizando o SDK do Gemini
    ou aciona o motor determinístico de contingência caso a chave não esteja presente.
    """
    api_key = getattr(settings, 'GEMINI_API_KEY', '')
    gemini_model = getattr(settings, 'GEMINI_MODEL', 'gemini-2.5-flash')

    if api_key and not api_key.startswith('SUA_CHAVE'):
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)

            system_instruction = (
                "Você é o motor forense de Inteligência Artificial do Fato ou Farsa, uma plataforma de verificação de conteúdos e vídeos do TikTok.\n"
                "Sua missão é avaliar evidências numéricas, contextuais e semânticas de vídeos curtos de forma rigorosa, imparcial e em conformidade com as leis do Brasil.\n\n"
                "DIRETRIZES CRÍTICAS:\n"
                "1. Analise as evidências. Explique a incerteza. NUNCA invente uma conclusão.\n"
                "2. Mantenha estrita distinção entre padrões incomuns de engajamento no TikTok (entrega algorítmica da FYP) e desinformação ou fraudes.\n"
                "3. Responda ESTRITAMENTE em Português do Brasil (pt-BR).\n"
                "4. A classificação DEVE ser OBRIGATORIAMENTE uma destas 5 frases exatas:\n"
                '   - "Sem indícios relevantes identificados"\n'
                '   - "Indícios que merecem investigação"\n'
                '   - "Possível conteúdo enganoso"\n'
                '   - "Evidências consistentes de falsidade ou manipulação"\n'
                '   - "Dados insuficientes para concluir"\n'
            )

            prompt = f"""Investigue este criador e vídeos do TikTok:
Perfil:
- Usuário: @{profile.get('username', 'usuario')} ({profile.get('fullName', '')})
- Bio: "{profile.get('biography', '')}"
- Categoria: {profile.get('category', 'Geral')}
- Seguidores: {profile.get('followersCount', 0)} | Verificado: {'Sim' if profile.get('isVerified') else 'Não'}

Resumo Estatístico Calculado:
- Total de Vídeos Analisados: {statistics.get('totalPostsAnalyzed', len(posts))}
- Média de Plays (Views): {statistics.get('avgViews', 'N/D')} | Mediana: {statistics.get('medianViews', 'N/D')}
- Relação Curtidas / Views: {f"{statistics.get('likesToViewsRatio', 0):.2f}%" if statistics.get('likesToViewsRatio') is not None else 'N/D'}
- Outliers Detectados: {statistics.get('outlierCount', 0)}
- Pontuação de Anomalia de Engajamento: {statistics.get('suspiciousEngagementScore', 0)}/100

Amostra de Vídeos do TikTok:
{_format_sample_posts(posts[:8])}

Avalie com rigor forense e retorne o JSON estruturado."""

            config_params = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                response_mime_type="application/json"
            )

            response = client.models.generate_content(
                model=gemini_model,
                contents=prompt,
                config=config_params
            )

            if response and response.text:
                parsed = json.loads(response.text)
                return {
                    "classification": parsed.get("classification", "Sem indícios relevantes identificados"),
                    "confidenceScore": parsed.get("confidenceScore", 75),
                    "confidenceLevel": parsed.get("confidenceLevel", "Média"),
                    "evidenceSummary": parsed.get("evidenceSummary", "Análise de integridade concluída com o modelo de IA."),
                    "supportingObservations": parsed.get("supportingObservations", []),
                    "alternativeExplanations": parsed.get("alternativeExplanations", []),
                    "limitations": parsed.get("limitations", ["Dados baseados em amostragem pública do TikTok."]),
                    "recommendedNextSteps": parsed.get("recommendedNextSteps", ["Consultar fontes oficiais para alegações de saúde e finanças."]),
                    "analyzedAspects": parsed.get("analyzedAspects", []),
                    "investigatedAt": datetime.now().strftime("%d/%m/%Y, %H:%M:%S"),
                    "modelUsed": f"Google GenAI ({gemini_model}) via Django",
                    "requiresOfficialReport": parsed.get("requiresOfficialReport", False)
                }
        except Exception:
            # Fallback determinístico silencioso
            pass

    return get_fallback_deterministic_analysis(profile, posts, statistics)


def _format_sample_posts(posts: List[Dict[str, Any]]) -> str:
    lines = []
    for i, p in enumerate(posts):
        caption_text = p.get('caption', '')
        transcript_text = p.get('transcript') or ''
        line = (
            f"[Vídeo {i+1}] Formato: {p.get('type', 'video')} | Plays: {p.get('viewsCount', 'N/D')} | Curtidas: {p.get('likesCount', 'N/D')}\n"
            f'Legenda: "{caption_text}"'
        )
        if transcript_text:
            line += f'\nTranscrição: "{transcript_text}"'
        lines.append(line)
    return "\n\n".join(lines)


def get_fallback_deterministic_analysis(
    profile: Dict[str, Any],
    posts: List[Dict[str, Any]],
    statistics: Dict[str, Any],
    error_detail: str = ""
) -> Dict[str, Any]:
    """
    Análise determinística de segurança quando o Gemini estiver offline ou sem chave.
    """
    outlier_count = statistics.get('outlierCount', 0)
    suspicious_score = statistics.get('suspiciousEngagementScore', 0)
    likes_to_views = statistics.get('likesToViewsRatio')

    # Regra de classificação entre as 5 oficiais
    if suspicious_score > 70:
        classification = "Evidências consistentes de falsidade ou manipulação"
        confidence_level = "Alta"
        requires_report = True
    elif suspicious_score > 45 or outlier_count > 1:
        classification = "Indícios que merecem investigação"
        confidence_level = "Média"
        requires_report = False
    elif not posts:
        classification = "Dados insuficientes para concluir"
        confidence_level = "Baixa"
        requires_report = False
    else:
        classification = "Sem indícios relevantes identificados"
        confidence_level = "Média"
        requires_report = False

    confidence_score = min(88, max(50, suspicious_score + 25))

    likes_ratio_str = f"{likes_to_views:.2f}%" if likes_to_views is not None else "Indisponível"

    return {
        "classification": classification,
        "confidenceScore": confidence_score,
        "confidenceLevel": confidence_level,
        "evidenceSummary": (
            f"Auditoria determinística realizada com {len(posts)} vídeos do TikTok. "
            f"{f'Identificados {outlier_count} vídeos com desvios atípicos nas métricas de visualização.' if outlier_count > 0 else 'Distribuição estatística homogênea e compatível com criadores do TikTok.'}"
        ),
        "supportingObservations": [
            f"Amostragem de {len(posts)} vídeos analisados para o criador @{profile.get('username', 'usuario')}.",
            f"Relação de curtidas por visualizações: {likes_ratio_str}.",
            (
                f"Presença de {outlier_count} vídeo(s) classificado(s) como outlier estatístico via IQR."
                if outlier_count > 0
                else "Ausência de discrepâncias severas entre visualizações e reações do público."
            )
        ],
        "alternativeExplanations": [
            "Picos de visualização no TikTok são frequentemente causados pelo algoritmo de recomendação da FYP (For You Page).",
            "Variações na taxa de engajamento podem refletir diferentes formatos, temas de nicho ou compartilhamentos externos."
        ],
        "limitations": [
            "Análise restrita a dados públicos e metadados agregados disponíveis no momento da checagem.",
            error_detail or "Métricas detalhadas de retenção e tempo médio assistido exigem permissão expressa da conta no TikTok."
        ],
        "recommendedNextSteps": [
            "Consultar registros oficiais em órgãos reguladores (ANVISA, CFM, CVM) para alegações médicas ou financeiras.",
            "Verificar as fontes citadas nas legendas dos vídeos em caso de ofertas e promessas de resultados imediatos."
        ],
        "analyzedAspects": [
            {
                "aspect": "Integridade Estatística",
                "evaluation": "Padrão com dispersão atípica de reproduções." if outlier_count > 0 else "Padrão estável.",
                "status": "alerta" if outlier_count > 1 else "normal"
            },
            {
                "aspect": "Consistência de Engajamento",
                "evaluation": f"Pontuação de anomalia calculada em {suspicious_score}/100.",
                "status": "alerta" if suspicious_score > 50 else "normal"
            }
        ],
        "investigatedAt": datetime.now().strftime("%d/%m/%Y, %H:%M:%S"),
        "modelUsed": "Motor Determinístico Forense (Django Backend Fallback)",
        "requiresOfficialReport": requires_report
    }
