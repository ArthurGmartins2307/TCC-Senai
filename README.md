# Fato ou Farsa — Plataforma de Verificação de Conteúdos do Instagram

**Fato ou Farsa** é uma ferramenta prática, funcional e leve projetada para investigar perfis do Instagram, auditar métricas públicas disponíveis, identificar anomalias estatísticas e avaliar a credibilidade contextual de publicações com o apoio de Inteligência Artificial forense (Google Gemini 3.8 Flash).

---

## 👁️ Identidade Visual: Fato ou Farsa

- **Símbolo:** Olho estilizado formado por dois balões de diálogo sobrepostos (azul marinho `#003876` e verde esmeralda `#00A86B`), íris em azul profundo com reflexo de luz e tique dourado de verificação (`#F5B800`).
- **Wordmark:** "Fato" (azul marinho), "ou" (amarelo ouro) e "Farsa" (verde esmeralda).

---

## 🎯 Abordagem de Produto (Application-First)

Diferente de websites promocionais tradicionais, o **Fato ou Farsa** coloca a ferramenta no centro da experiência:
1. **Entrada Imediata:** O usuário abre o sistema e já encontra o campo de busca de perfil, sem precisar rolar por seções de marketing.
2. **Três Pilares Claros:**
   - **Métricas:** médias e medianas de visualizações e curtidas.
   - **Investigação:** detecção determinística de padrões atípicos e evidências contextuais.
   - **Relatório:** resultados explicados em linguagem acessível e orientações oficiais de denúncia.
3. **Casos para Teste:** Disponibiliza perfis simulados para demonstração imediata de cenários reais (alegações médicas, robôs financeiros, perfis acadêmicos e vídeos reciclados).

---

## 📊 Painel de Análise Estruturado

- **A. Visão Geral do Perfil:** Identificador `@usuario`, URL direta, status da auditoria, data/hora da consulta e fonte de dados.
- **B. Métricas Principais:** Cards compactos com Média de visualizações, Média de curtidas, Mediana de visualizações (resistente a outliers) e Publicações analisadas, com total de postagens elegíveis e dados ausentes destacados sem falsificação.
- **C. Análise de Publicações:** Tabela legível com busca e filtros, acompanhada de gráfico de dispersão cronológica de reproduções vs curtidas e modal com metadados detalhados de cada post.
- **D. Resultado da Análise (IA Forense):**
  - Classificação nos 5 níveis padronizados:
    1. *Sem indícios relevantes identificados*
    2. *Indícios que merecem investigação*
    3. *Possível conteúdo enganoso*
    4. *Evidências consistentes de falsidade ou manipulação*
    5. *Dados insuficientes para concluir*
  - Principais motivos e evidências de suporte
  - Hipóteses alternativas (contexto benigno)
  - Informações não verificadas e próximos passos
- **E. Opções de Denúncia:** Botão *"Consultar opções de denúncia"* com passo a passo no app do Instagram e links diretos para a Central de Ajuda da Meta.

---

## ⚖️ Princípio Ético & Legal

> **"A análise depende dos dados disponíveis. Métricas de engajamento, isoladamente, não comprovam que um conteúdo é falso."**

- Não realizamos denúncias automáticas.
- Não incentivamos assédio ou denúncias em massa.
- Em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e o Marco Civil da Internet.

---

## 🛠️ Tecnologias

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & IA:** Express / Vite proxy com `@google/genai` utilizando `gemini-3.8-flash` no servidor.
- **Estatística:** Métodos determinísticos (Intervalo Interquartil - IQR, medianas e taxas de conversão relativas).
