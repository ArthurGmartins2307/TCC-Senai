# Fato ou Farsa — Plataforma de Verificação de Conteúdos do TikTok

**Fato ou Farsa** é uma ferramenta analítica, prática e leve desenvolvida para investigar vídeos, áudios, legendas e criadores do TikTok. O sistema audita métricas de engajamento público, detecta anomalias estatísticas e avalia a credibilidade factual de alegações através de Inteligência Artificial forense (Google Gemini 3.8 Flash com Google Search Grounding) e bases regulatórias oficiais.

---

## 👁️ Identidade Visual: Fato ou Farsa

- **Símbolo Oficial:** Baseado no asset oficial fornecido (`/assets/aistudio/FatoOuFarsa_9cc0d652.jpeg`). Apresenta o olho estilizado formado por dois balões de diálogo sobrepostos (azul marinho `#003876` à esquerda e verde esmeralda `#00A86B` à direita), íris em azul profundo com anel branco, reflexo de luz e marca de verificação dourada (`#F5B800`).
- **Cabeçalho Limpo:** Conforme requisitos de design, o cabeçalho exibe exclusivamente o ícone oficial da marca sem rótulos de texto adicionais ao lado, garantindo navegação rápida, proporções preservadas e acessibilidade por leitores de tela.
- **Posicionamento do Nome:** O nome do produto **"Fato ou Farsa"** é destacado na área nobre da página inicial, nos títulos de dossiês e nos metadados institucionais.

---

## 🎯 Abordagem de Produto (Application-First)

1. **Entrada Imediata:** O usuário acessa a aplicação e encontra diretamente o campo para inserir o link de um vídeo do TikTok (`tiktok.com/@usuario/video/...`), identificador ou `@usuario`, além de um botão dedicado para inserir transcrições ou alegações diretas.
2. **Três Pilares Funcionais:**
   - **Métricas:** Médias e medianas de reproduções (plays) e curtidas, taxa de engajamento e contagem de vídeos elegíveis sem falsificação de valores nulos.
   - **Investigação:** Detecção determinística de desvios métricos (método de Intervalo Interquartil - IQR) combinada com extração de alegações factuais.
   - **Relatório:** Resultados transparentes nos 5 níveis padronizados, explicação de incertezas, fontes institucionais (ANVISA, CFM, CVM, Agência Lupa, Aos Fatos) e orientações oficiais de denúncia no TikTok.
3. **Casos Didáticos de Teste:** Perfis e vídeos simulados representativos de dinâmicas comuns no TikTok (curas milagrosas em 48h, robôs de lucro diário no Pix, divulgação científica com registro profissional e cortes sensacionalistas reciclados).

---

## 📱 Avaliação das APIs Oficiais do TikTok

Em conformidade com as diretrizes do projeto, não se assume que qualquer perfil ou vídeo de terceiro pode ser consultado anonimamente sem autorização:

1. **TikTok Display API (`https://open.tiktokapis.com/v2/`):**
   - **Escopo:** Exibe perfil e vídeos do *próprio usuário autenticado* que concedeu permissão via TikTok Login Kit.
   - **Permissões necessárias:** `user.info.basic`, `user.info.profile`, `user.info.stats`, `video.list`.
   - **Restrição:** Não permite consultar vídeos de criadores de terceiros que não autorizaram a aplicação.
2. **TikTok Research API:**
   - **Escopo:** Permite consultas amplas de interesse público a dados de vídeos e tendências.
   - **Restrição e Elegibilidade:** Restrita a pesquisadores acadêmicos filiados a instituições sem fins lucrativos em regiões elegíveis (EUA/UE), sujeita a submissão formal de projeto, contrato jurídico e aprovação manual pela equipe do TikTok.
3. **Fluxo de Fallback (Entrada Manual & Validação Cruzada):**
   - Permite que qualquer cidadão ou analista insira a legenda, a transcrição do áudio ou a alegação central do vídeo para investigação imediata com busca de evidências e checagem cruzada via IA.

---

## 📊 Estrutura do Painel de Auditoria

- **A. Visão Geral:** Nome `@usuario`, URL direta no TikTok, amostragem de vídeos auditados, data da consulta e fonte dos dados.
- **B. Métricas Principais:** 4 cards compactos (Média de visualizações, Média de curtidas, Mediana resistente a outliers e Total de vídeos analisados com dados ausentes destacados).
- **C. Análise de Vídeos:** Tabela interativa com busca, filtros por anomalia, gráfico de dispersão cronológica de reproduções vs curtidas e modal de inspeção detalhada com transcrição e áudio.
- **D. Resultado da Análise (IA Forense):**
  - Classificação nos 5 níveis oficiais:
    1. *Sem indícios relevantes identificados*
    2. *Indícios que merecem investigação*
    3. *Possível conteúdo enganoso*
    4. *Evidências consistentes de falsidade ou manipulação*
    5. *Dados insuficientes para concluir*
  - Principais evidências e fatos verificáveis
  - Hipóteses alternativas benignas
  - Limitações e próximos passos recomendados
- **E. Diretrizes de Denúncia no TikTok:** Passo a passo auditado para denúncia manual no app do TikTok (Compartilhar > Denunciar > Desinformação / Fraude) e links para o Centro de Segurança do TikTok Brasil.
- **F. Checagem Factual com Fontes:** Decomposição de afirmações com vereditos (Falso, Enganoso, Sem Evidências, Verdadeiro) e links diretos para órgãos oficiais e agências de checagem.

---

## ⚖️ Princípio Ético & Legal

> **"A análise depende dos dados disponíveis. Métricas de engajamento, isoladamente, não comprovam que um conteúdo é falso."**

- **Sem automação de denúncias:** Não realizamos denúncias automatizadas nem estimulamos assédio ou linchamento virtual.
- **Conformidade regulatória:** Em conformidade com a LGPD (Lei 13.709/2018), o Marco Civil da Internet (Lei 12.965/2014) e as Diretrizes da Comunidade do TikTok.

---

## 🛠️ Tecnologias

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & IA:** Node.js, Express / Vite middleware, `@google/genai` (Gemini 3.8 Flash com Google Search Grounding).
- **Testes Unitários:** Runner nativo `node:test` (`npm test`).
