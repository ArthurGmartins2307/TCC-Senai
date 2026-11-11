"""
Fato ou Farsa — Suíte de Testes Automatizados do Django (Django TestCase / DRF APITestCase)
Testa modelos ORM, cálculos estatísticos com salvaguardas e endpoints REST da API.
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .models import (
    TikTokProfile,
    TikTokVideo,
    InvestigationReport,
    ClaimVerification,
    EvidenceSource
)
from .services.statistics_service import (
    compute_average,
    compute_median,
    compute_views_to_followers_ratio,
    compute_engagement_rate,
    calculate_statistical_summary
)
from .services.tiktok_service import (
    normalize_tiktok_input,
    test_tiktok_connection
)
from .services.fact_check_service import extract_claims_heuristic


class StatisticsServiceTestCase(TestCase):
    """Testa os algoritmos matemáticos e determinísticos do módulo de estatísticas."""

    def test_compute_average_and_median(self):
        self.assertEqual(compute_average([10.0, 20.0, 30.0]), 20.0)
        self.assertEqual(compute_average([]), 0.0)
        self.assertEqual(compute_median([10.0, 50.0, 20.0]), 20.0)
        self.assertEqual(compute_median([10.0, 20.0, 30.0, 40.0]), 25.0)

    def test_views_to_followers_ratio(self):
        # Fórmula oficial obrigatória: (average_views / follower_count) * 100
        # Exemplo 1: 5.000 views com 10.000 seguidores => 50.0%
        ratio1 = compute_views_to_followers_ratio(5000.0, 10000)
        self.assertEqual(ratio1, 50.0)

        # Exemplo 2: Vídeo viral (200.000 views com 50.000 seguidores) => 400.0%
        ratio2 = compute_views_to_followers_ratio(200000.0, 50000)
        self.assertEqual(ratio2, 400.0)

        # Salvaguardas de divisão por zero e ausência de dados
        self.assertIsNone(compute_views_to_followers_ratio(5000.0, 0))
        self.assertIsNone(compute_views_to_followers_ratio(5000.0, None))
        self.assertEqual(compute_views_to_followers_ratio(0.0, 10000), 0.0)

    def test_engagement_rate(self):
        # ((likes + comments + shares) / total_views) * 100
        # (100 + 20 + 10) / 1000 => 13.0%
        rate = compute_engagement_rate(100.0, 20.0, 10.0, 1000.0)
        self.assertEqual(rate, 13.0)
        # Proteção quando total_views = 0
        self.assertIsNone(compute_engagement_rate(10.0, 5.0, 2.0, 0.0))

    def test_calculate_statistical_summary(self):
        sample_posts = [
            {'viewsCount': 10000, 'likesCount': 1000, 'commentsCount': 100, 'sharesCount': 50},
            {'viewsCount': 30000, 'likesCount': 3000, 'commentsCount': 300, 'sharesCount': 150},
        ]
        summary = calculate_statistical_summary(sample_posts, follower_count=50000)
        self.assertEqual(summary['sample_size'], 2)
        self.assertEqual(summary['average_views'], 20000.0)
        self.assertEqual(summary['median_views'], 20000.0)
        self.assertEqual(summary['views_to_followers_ratio'], 40.0)
        self.assertIn('data_limitations', summary)


class TikTokServiceTestCase(TestCase):
    """Testa a validação e normalização de identificadores e links do TikTok."""

    def test_normalize_tiktok_video_url(self):
        res = normalize_tiktok_input("https://www.tiktok.com/@saude_vital/video/7389201928371928392")
        self.assertEqual(res['type'], 'video')
        self.assertEqual(res['username'], 'saude_vital')
        self.assertEqual(res['video_id'], '7389201928371928392')

    def test_normalize_tiktok_profile_url(self):
        res = normalize_tiktok_input("https://www.tiktok.com/@dra_mariana")
        self.assertEqual(res['type'], 'profile')
        self.assertEqual(res['username'], 'dra_mariana')

    def test_normalize_empty_input(self):
        with self.assertRaises(ValueError):
            normalize_tiktok_input("   ")


class FactCheckServiceTestCase(TestCase):
    """Testa a identificação e classificação de desinformação com base forense."""

    def test_medical_claim_classification(self):
        text = "Chá da Amazônia reverte diabetes tipo 2 em 48 horas e cura o pâncreas"
        claims = extract_claims_heuristic(text)
        self.assertTrue(len(claims) >= 1)
        lead = claims[0]
        self.assertEqual(lead['verdict'], 'Contradita pelas evidências consultadas')
        self.assertGreaterEqual(lead['confidence'], 90)
        self.assertTrue(any(s['isOfficial'] for s in lead['sources']))

    def test_financial_claim_classification(self):
        text = "Robô do pix com lucro garantido sem risco e retorno de 100% ao dia"
        claims = extract_claims_heuristic(text)
        self.assertTrue(len(claims) >= 1)
        lead = claims[0]
        self.assertEqual(lead['verdict'], 'Contradita pelas evidências consultadas')


class VerificationAPITestCase(APITestCase):
    """Testa os endpoints RESTful desenvolvidos com Django REST Framework."""

    def test_status_endpoint(self):
        url = reverse('api_status')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['platform'], 'TikTok')
        self.assertIn('Django', response.data['framework'])
        self.assertIn('SQLite3 (Django ORM)', response.data['database'])

    def test_calculate_stats_endpoint(self):
        url = reverse('calculate_stats')
        payload = {
            'followerCount': 100000,
            'posts': [
                {'viewsCount': 40000, 'likesCount': 2000},
                {'viewsCount': 60000, 'likesCount': 4000}
            ]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['average_views'], 50000.0)
        self.assertEqual(response.data['views_to_followers_ratio'], 50.0)

    def test_verify_claims_endpoint(self):
        url = reverse('verify_claims')
        payload = {'caption': 'Erva da Amazônia cura diabetes tipo 2'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data['claims']) >= 1)

    def test_full_analysis_and_orm_persistence(self):
        url = reverse('full_analyze')
        payload = {
            'usernameOrUrl': '@saude_vital_brasil',
            'manualTranscript': 'Chá que reverte diabetes em 48 horas'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('id', response.data)
        self.assertIn('profile', response.data)
        self.assertIn('statistics', response.data)
        self.assertIn('aiAnalysis', response.data)

        # Verifica se o relatório foi persistido no banco de dados SQLite via Django ORM
        report_id = response.data['id']
        self.assertTrue(InvestigationReport.objects.filter(report_id=report_id).exists())
        self.assertTrue(TikTokProfile.objects.filter(username='saude_vital_brasil').exists())

    def test_frontend_direct_analysis_payload(self):
        url = reverse('full_analyze')
        payload = {
            'profile': {
                'username': 'criador_teste',
                'fullName': 'Criador Teste',
                'followersCount': 50000,
                'category': 'Saúde'
            },
            'posts': [
                {
                    'id': 'v1',
                    'type': 'video',
                    'caption': 'Dicas de saúde e rotina',
                    'viewsCount': 20000,
                    'likesCount': 1500
                }
            ],
            'statistics': {
                'totalPostsAnalyzed': 1,
                'avgViews': 20000,
                'medianViews': 20000,
                'likesToViewsRatio': 7.5,
                'outlierCount': 0,
                'suspiciousEngagementScore': 15
            }
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('classification', response.data)
        self.assertIn('confidenceScore', response.data)
        self.assertIn('analyzedAspects', response.data)
        self.assertEqual(response.data['classification'], 'Sem indícios relevantes identificados')

