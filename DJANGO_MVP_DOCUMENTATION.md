# Fato ou Farsa — Documentação Completa do MVP Backend em Django (TCC)

Este documento descreve integralmente a arquitetura, modelos, endpoints, regras de negócio e procedimentos de execução do backend **Python + Django 5 + Django REST Framework (DRF)** da plataforma **Fato ou Farsa — Plataforma de Verificação de Conteúdos do TikTok**.

---

## 1. Visão Geral da Arquitetura

O backend em Django foi desenvolvido para atender às exigências metodológicas de pesquisa acadêmica e Trabalho de Conclusão de Curso (TCC). Ele provê persistência relacional com Django ORM, endpoints RESTful padronizados, separação de camadas de serviço (business logic), conformidade com os termos de serviço oficiais do TikTok e integração com Inteligência Artificial forense.

```
/ (Workspace Root)
│
├── manage.py                          # Utilitário central de comandos administrativos do Django
├── requirements.txt                   # Dependências Python (Django 5, DRF, google-genai, etc.)
├── db.sqlite3                         # Banco de dados relacional SQLite do Django ORM
│
├── fato_backend/                      # Configurações do Projeto Central Django
│   ├── __init__.py
│   ├── settings.py                    # Configuração de apps, CORS, DRF, banco e credenciais
│   ├── urls.py                        # Roteamento raiz (/healthz, /admin/, /api/)
│   ├── wsgi.py                        # Ponto de entrada WSGI para servidores de produção
│   └── asgi.py                        # Ponto de entrada ASGI
│
└── verification/                      # App Principal de Auditoria e Verificação Forense
    ├── admin.py                       # Configuração avançada do Django Admin com inlines
    ├── apps.py                        # Registro do app VerificationConfig
    ├── models.py                      # Modelos relacionais (Profile, Video, Report, Claim, Source)
    ├── serializers.py                 # Serializadores DRF bidirecionais
    ├── urls.py                        # Roteador de endpoints REST (/api/status, /api/analyze, etc.)
    ├── views.py                       # Controllers/Views baseadas em @api_view
    ├── tests.py                       # 14 testes unitários automatizados (100% aprovados)
    │
    └── services/                      # Camada de Serviços Desacoplados
        ├── tiktok_service.py          # Normalização de URLs e integração oficial TikTok API v2
        ├── statistics_service.py      # Cálculos determinísticos, médias, medianas, IQR e taxas
        ├── fact_check_service.py      # Checagem de alegações com Base Forense Nacional e Gemini
        └── ai_analysis_service.py     # Classificação pericial nas 5 categorias oficiais pt-BR
```

---

## 2. Modelagem do Banco de Dados Relacional (Django ORM)

O banco de dados armazena o histórico completo das investigações realizadas, permitindo posterior análise estatística agregada para a pesquisa acadêmica.

### 2.1. `TikTokProfile` (Perfis e Criadores)
Armazena os metadados do criador auditado:
- `username`: Identificador único (@)
- `full_name`: Nome de exibição
- `avatar_url`: Imagem de perfil
- `is_verified`: Selo de verificação oficial do TikTok
- `followers_count`: Total de seguidores
- `following_count`: Total de contas seguidas
- `likes_received_count`: Total de curtidas recebidas no perfil
- `videos_count`: Total de vídeos publicados
- `biography`: Texto da bio
- `category`: Categoria temática (Saúde, Finanças, Notícias, etc.)
- `profile_url`: Link direto para o perfil

### 2.2. `TikTokVideo` (Publicações Individuais)
Armazena métricas públicas e transcrições dos vídeos:
- `video_id`: Identificador numérico do vídeo
- `profile`: Chave estrangeira (`ForeignKey`) para `TikTokProfile`
- `caption`: Legenda da publicação
- `transcript`: Transcrição da fala/áudio do vídeo
- `sound_title`: Título do som utilizado
- `views_count`: Contagem de visualizações/reproduções (plays)
- `likes_count`: Curtidas
- `comments_count`: Comentários
- `shares_count`: Compartilhamentos
- `is_outlier`: Flag booleana indicando desvio estatístico atípico
- `anomaly_score`: Pontuação de anomalia (0 a 100)

### 2.3. `InvestigationReport` (Dossiê de Investigação)
Registra o laudo pericial gerado a cada consulta:
- `report_id`: Código identificador do dossiê (`report_YYYYMMDD_HHMMSS`)
- `profile`: Chave estrangeira para `TikTokProfile`
- `data_source`: Fonte dos dados (`tiktok_display_api`, `sandbox_dataset`, `manual_input`)
- `is_demo`: Booleano identificando se foi executado com amostragem didática
- `sample_size`: Quantidade de vídeos auditados
- `average_views`: Média aritmética de visualizações
- `median_views`: Mediana de visualizações (resistente a outliers)
- `std_dev_views`: Desvio padrão
- `views_to_followers_ratio`: Relação percentual `(average_views / follower_count) * 100`
- `engagement_rate`: Taxa de engajamento percentual
- `overall_assessment`: Parecer final do modelo pericial
- `risk_score`: Score numérico de risco (0 a 100)
- `engine_used`: Identificação do motor utilizado (Gemini ou Base Forense)

### 2.4. `ClaimVerification` (Checagem Factual de Alegações)
Armazena afirmações isoladas extraídas do conteúdo:
- `report`: Vinculação ao dossiê
- `claim_text`: Texto da alegação analisada
- `category`: Área do conhecimento
- `verdict`: Veredito estrito entre as 6 categorias acadêmicas:
  1. *Confirmada pelas evidências consultadas*
  2. *Contradita pelas evidências consultadas*
  3. *Parcialmente correta ou fora de contexto*
  4. *Evidências conflitantes*
  5. *Não verificada*
  6. *Afirmação não verificável*
- `confidence_score`: Grau de certeza percentual
- `explanation`: Fundamentação técnica detalhada
- `scientific_consensus`: Consenso científico ou regulatório vigente

### 2.5. `EvidenceSource` (Fontes Institucionais de Evidência)
Referências primárias associadas à alegação checada:
- `claim`: Vinculação à `ClaimVerification`
- `name`: Nome do órgão ou instituição (ex: ANVISA, CFM, CVM, SBD, Agência Lupa)
- `title`: Título da diretriz, norma técnica ou checagem jornalística
- `url`: Link oficial da fonte
- `quote`: Citação direta ou trecho normativo
- `is_official`: Booleano diferenciando órgãos reguladores estatais de agências de fact-checking

---

## 3. Catálogo de Endpoints REST (Django REST Framework)

Todos os endpoints operam sob o prefixo `/api/` e retornam respostas em JSON com suporte total a CORS.

### 3.1. `GET /api/status`
Diagnóstico e status de prontidão da infraestrutura:
```json
{
  "system": "Fato ou Farsa API Gateway (Django REST Framework Backend)",
  "version": "4.0.0 (Django Architecture / TCC)",
  "framework": "Django 5 + Django REST Framework",
  "platform": "TikTok",
  "database": "SQLite3 (Django ORM)",
  "gemini": {
    "configured": true,
    "model": "gemini-2.5-flash",
    "searchGroundingSupported": true,
    "mode": "active"
  },
  "tiktok": {
    "configured": false,
    "mode": "sandbox_curated",
    "apiVersion": "v2",
    "permissionsRequired": ["user.info.basic", "user.info.profile", "user.info.stats", "video.list"],
    "researchApiEligible": false,
    "termsCompliance": "Anti-scraping strictly respected"
  }
}
```

### 3.2. `POST /api/analyze`
Executa a auditoria completa de um perfil e persiste os dados no SQLite via Django ORM.
Aceita dois formatos de entrada:
1. **Payload direto do frontend:** `{ "profile": {...}, "posts": [...], "statistics": {...} }`
2. **Entrada de link/usuário:** `{ "usernameOrUrl": "@saude_vital_brasil", "manualTranscript": "..." }`

**Retorno estruturado:**
```json
{
  "classification": "Indícios que merecem investigação",
  "confidenceScore": 85,
  "confidenceLevel": "Média",
  "evidenceSummary": "Identificado 1 vídeo com desvio atípico entre visualizações e taxa de curtidas.",
  "supportingObservations": [
    "Amostragem de vídeos do TikTok analisada.",
    "Presença de outlier estatístico detectado via IQR."
  ],
  "alternativeExplanations": [
    "Picos de reproduções no TikTok podem decorrer da distribuição orgânica da FYP."
  ],
  "limitations": [
    "Análise restrita a dados públicos e metadados informados no momento da checagem."
  ],
  "recommendedNextSteps": [
    "Consultar órgãos reguladores (ANVISA, CFM, CVM) antes de qualquer tomada de decisão."
  ],
  "analyzedAspects": [
    { "aspect": "Integridade Estatística", "evaluation": "Padrão com dispersão atípica", "status": "alerta" }
  ],
  "modelUsed": "Google GenAI (gemini-2.5-flash) via Django",
  "requiresOfficialReport": false
}
```

### 3.3. `POST /api/verify-claims`
Checagem pontual de alegações factuais contidas em legendas ou transcrições de vídeos:
- **Body:** `{ "caption": "Chá da Amazônia cura diabetes em 48 horas", "topic": "Saúde" }`
- **Retorno:** Lista de alegações classificadas com fontes institucionais (SBD, ANVISA, Agência Lupa).

### 3.4. `POST /api/calculate-stats`
Cálculo puro e determinístico de métricas agregadas:
- **Body:** `{ "posts": [...], "followerCount": 100000 }`
- **Retorno:** Médias, medianas, desvio padrão, IQR, fórmula de `views_to_followers_ratio` e limitações amostrais.

### 3.5. `POST /api/tiktok/profile`
Obtenção e normalização de vídeos e perfil do TikTok a partir de URL ou username com conformidade OAuth v2.

### 3.6. `GET /api/history`
Consulta os dossiês e auditorias previamente gravados no banco de dados SQLite via Django ORM.

---

## 4. Instruções de Execução do Backend Django

### 4.1. Instalação de Dependências
```bash
pip install -r requirements.txt
```

### 4.2. Aplicação de Migrações do Banco de Dados
```bash
python manage.py migrate
```

### 4.3. Execução dos Testes Automatizados (14 Testes)
```bash
python manage.py test verification -v 2
```
*Garante a validação de cálculos estatísticos, normalização de URLs do TikTok, categorização de alegações e integridade de persistência no ORM.*

### 4.4. Inicialização do Servidor Django
```bash
python manage.py runserver 127.0.0.1:5001 --noreload
```

### 4.5. Criação de Administrador para o Painel Django Admin
```bash
python manage.py createsuperuser
```
Acesse o painel em: `http://127.0.0.1:5001/admin/`

---

## 5. Fundamentação Teórica e Metodológica para o TCC

1. **Relação Visualizações sobre Seguidores:**
   - Fórmula: `(average_views / follower_count) * 100`
   - *Ressalva Metodológica:* Não reflete proporção de seguidores alcançados, dado que o algoritmo de recomendação do TikTok ("Para Você" / FYP) entrega conteúdos para usuários não seguidores.
2. **Classificação nos 5 Vereditos de Integridade:**
   - Previne termos sensacionalistas e garante imparcialidade conforme preceitos do Marco Civil da Internet (Lei 12.965/2014) e da Lei Geral de Proteção de Dados (LGPD).
3. **Respeito aos Termos de Serviço da TikTok Developer Platform:**
   - Repúdio ao *web scraping* não autorizado; distinção clara entre Display API (dados autorizados do titular) e Research API (pesquisa acadêmica formal).
