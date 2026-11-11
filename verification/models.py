"""
Fato ou Farsa — Modelos do Banco de Dados Relacional (Django ORM)
Estrutura modelada para auditoria forense, investigação de desinformação
no TikTok e fundamentação metodológica de TCC acadêmico.
"""

from django.db import models


class TikTokProfile(models.Model):
    """
    Metadados de perfis e criadores de conteúdo do TikTok.
    """
    username = models.CharField(max_length=150, unique=True, db_index=True, verbose_name="Nome de Usuário (@)")
    full_name = models.CharField(max_length=255, blank=True, verbose_name="Nome Completo / Exibição")
    avatar_url = models.URLField(max_length=1000, blank=True, verbose_name="URL do Avatar")
    is_verified = models.BooleanField(default=False, verbose_name="Conta Verificada")
    followers_count = models.BigIntegerField(default=0, verbose_name="Total de Seguidores")
    following_count = models.BigIntegerField(default=0, verbose_name="Seguindo")
    likes_received_count = models.BigIntegerField(default=0, verbose_name="Total de Curtidas Recebidas")
    videos_count = models.IntegerField(default=0, verbose_name="Total de Vídeos Publicados")
    biography = models.TextField(blank=True, verbose_name="Biografia / Descrição")
    category = models.CharField(max_length=100, default="Geral", verbose_name="Categoria")
    profile_url = models.URLField(max_length=1000, blank=True, verbose_name="URL do Perfil")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Cadastrado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Última Atualização")

    class Meta:
        verbose_name = "Perfil do TikTok"
        verbose_name_plural = "Perfis do TikTok"
        ordering = ['-updated_at']

    def __str__(self):
        return f"@{self.username} ({self.followers_count:,} seguidores)"


class TikTokVideo(models.Model):
    """
    Metadados e métricas individuais de vídeos do TikTok.
    """
    video_id = models.CharField(max_length=100, db_index=True, verbose_name="ID do Vídeo")
    profile = models.ForeignKey(
        TikTokProfile,
        on_delete=models.CASCADE,
        related_name="videos",
        verbose_name="Perfil Autor"
    )
    caption = models.TextField(blank=True, verbose_name="Legenda da Publicação")
    transcript = models.TextField(blank=True, verbose_name="Transcrição do Áudio / Fala")
    sound_title = models.CharField(max_length=255, blank=True, verbose_name="Título do Áudio / Música")
    url = models.URLField(max_length=1000, blank=True, verbose_name="Link do Vídeo")
    thumbnail_url = models.URLField(max_length=1000, blank=True, verbose_name="Capa / Miniatura")
    
    # Métricas públicas de engajamento do TikTok
    views_count = models.BigIntegerField(null=True, blank=True, verbose_name="Visualizações (Plays)")
    likes_count = models.BigIntegerField(null=True, blank=True, verbose_name="Curtidas")
    comments_count = models.BigIntegerField(null=True, blank=True, verbose_name="Comentários")
    shares_count = models.BigIntegerField(null=True, blank=True, verbose_name="Compartilhamentos")
    
    posted_at = models.DateTimeField(null=True, blank=True, verbose_name="Data de Postagem")
    formatted_date = models.CharField(max_length=50, blank=True, verbose_name="Data Formatada")
    
    is_outlier = models.BooleanField(default=False, verbose_name="Anomalia de Engajamento")
    anomaly_score = models.FloatField(default=0.0, verbose_name="Score de Desvio Estatístico")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Registrado no Sistema em")

    class Meta:
        verbose_name = "Vídeo do TikTok"
        verbose_name_plural = "Vídeos do TikTok"
        ordering = ['-posted_at', '-created_at']

    def __str__(self):
        return f"Vídeo {self.video_id} - @{self.profile.username} ({self.views_count or 0:,} views)"


class InvestigationReport(models.Model):
    """
    Registro completo de auditoria e dossiê de verificação (Histórico).
    Armazena métricas quantitativas, avaliação de risco e contexto metodológico.
    """
    DATA_SOURCE_CHOICES = [
        ('tiktok_display_api', 'TikTok Display API (Oficial Login Kit)'),
        ('tiktok_research_api', 'TikTok Research API (Pesquisa Acadêmica)'),
        ('sandbox_dataset', 'Dataset Curado / Demonstração Educacional'),
        ('manual_input', 'Entrada Manual de Legenda/Transcrição'),
    ]

    report_id = models.CharField(max_length=100, primary_key=True, verbose_name="ID do Relatório")
    profile = models.ForeignKey(
        TikTokProfile,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reports",
        verbose_name="Perfil Auditado"
    )
    data_source = models.CharField(
        max_length=50,
        choices=DATA_SOURCE_CHOICES,
        default='sandbox_dataset',
        verbose_name="Fonte dos Dados"
    )
    is_demo = models.BooleanField(default=False, verbose_name="Cenário de Demonstração")
    status_message = models.TextField(blank=True, verbose_name="Nota Metodológica / Status da API")
    input_query = models.CharField(max_length=500, blank=True, verbose_name="Termo ou URL de Entrada")
    manual_transcript = models.TextField(blank=True, verbose_name="Transcrição Manual Submetida")

    # Métricas agregadas e estatísticas determinísticas
    sample_size = models.IntegerField(default=0, verbose_name="Tamanho da Amostra (Vídeos)")
    date_range = models.CharField(max_length=150, blank=True, verbose_name="Intervalo Temporal Auditado")
    average_views = models.FloatField(default=0.0, verbose_name="Média de Visualizações")
    median_views = models.FloatField(default=0.0, verbose_name="Mediana de Visualizações")
    std_dev_views = models.FloatField(default=0.0, verbose_name="Desvio Padrão de Visualizações")
    average_likes = models.FloatField(default=0.0, verbose_name="Média de Curtidas")
    average_comments = models.FloatField(default=0.0, verbose_name="Média de Comentários")
    average_shares = models.FloatField(default=0.0, verbose_name="Média de Compartilhamentos")
    
    # Relação Visualizações / Seguidores: (average_views / follower_count) * 100
    views_to_followers_ratio = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Taxa de Visualizações sobre Seguidores (%)"
    )
    engagement_rate = models.FloatField(null=True, blank=True, verbose_name="Taxa de Engajamento (%)")
    
    frequency_json = models.JSONField(default=dict, blank=True, verbose_name="Dados de Frequência de Postagem")
    limitations_json = models.JSONField(default=list, blank=True, verbose_name="Limitações da Amostra")

    # Avaliação geral da Inteligência Artificial
    overall_assessment = models.TextField(blank=True, verbose_name="Conclusão Geral da IA Forense")
    risk_score = models.IntegerField(default=0, verbose_name="Índice de Risco (0-100)")
    engine_used = models.CharField(max_length=150, blank=True, verbose_name="Motor Forense / Modelo de IA")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data e Hora da Auditoria")

    class Meta:
        verbose_name = "Dossiê de Investigação"
        verbose_name_plural = "Dossiês de Investigação"
        ordering = ['-created_at']

    def __str__(self):
        user = self.profile.username if self.profile else "Conteúdo Avulso"
        return f"Dossiê {self.report_id} - @{user} ({self.created_at.strftime('%d/%m/%Y %H:%M')})"


class ClaimVerification(models.Model):
    """
    Afirmações factuais identificadas e checadas individualmente.
    Classificadas estritamente nas 6 categorias oficiais em pt-BR.
    """
    VERDICT_CHOICES = [
        ('Confirmada pelas evidências consultadas', 'Confirmada pelas evidências consultadas'),
        ('Contradita pelas evidências consultadas', 'Contradita pelas evidências consultadas'),
        ('Parcialmente correta ou fora de contexto', 'Parcialmente correta ou fora de contexto'),
        ('Evidências conflitantes', 'Evidências conflitantes'),
        ('Não verificada', 'Não verificada'),
        ('Afirmação não verificável', 'Afirmação não verificável'),
    ]

    report = models.ForeignKey(
        InvestigationReport,
        on_delete=models.CASCADE,
        related_name="claims",
        verbose_name="Dossiê Associado"
    )
    claim_text = models.TextField(verbose_name="Afirmação Factual Extraída")
    category = models.CharField(max_length=100, default="Geral", verbose_name="Categoria da Alegação")
    verdict = models.CharField(
        max_length=100,
        choices=VERDICT_CHOICES,
        default='Não verificada',
        verbose_name="Veredito Forense Oficial"
    )
    confidence_score = models.IntegerField(default=0, verbose_name="Grau de Certeza / Confiança (%)")
    explanation = models.TextField(verbose_name="Explicação Detalhada Fundamentada em Evidências")
    scientific_consensus = models.TextField(blank=True, verbose_name="Consenso Técnico-Científico / Regulatório")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Identificada em")

    class Meta:
        verbose_name = "Checagem de Alegação Factual"
        verbose_name_plural = "Checagens de Alegações Factuais"
        ordering = ['id']

    def __str__(self):
        return f"[{self.verdict}] {self.claim_text[:80]}..."


class EvidenceSource(models.Model):
    """
    Fontes primárias, regulatórias, científicas e agências de checagem.
    """
    claim = models.ForeignKey(
        ClaimVerification,
        on_delete=models.CASCADE,
        related_name="sources",
        verbose_name="Alegação Factual"
    )
    name = models.CharField(max_length=255, verbose_name="Nome da Instituição ou Agência")
    title = models.CharField(max_length=500, verbose_name="Título do Parecer, Alerta ou Artigo")
    url = models.URLField(max_length=1000, verbose_name="Link Direto da Evidência")
    quote = models.TextField(blank=True, verbose_name="Citação Relevante do Parecer Oficial")
    is_official = models.BooleanField(default=False, verbose_name="Órgão Regulador / Oficial de Estado")

    class Meta:
        verbose_name = "Fonte de Evidência"
        verbose_name_plural = "Fontes de Evidência"

    def __str__(self):
        prefix = "🏛️ [Oficial]" if self.is_official else "📰 [Jornalismo/Checagem]"
        return f"{prefix} {self.name} - {self.title[:60]}"
