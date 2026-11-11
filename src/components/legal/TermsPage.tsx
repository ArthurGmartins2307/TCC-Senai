/**
 * Fato ou Farsa - Página de Termos de Uso do Serviço (/terms)
 * Redigida em português brasileiro para conformidade com a legislação nacional
 * (Marco Civil da Internet, LGPD, Lei de Direitos Autorais) e requisitos do TikTok for Developers.
 */

import React from 'react';
import {
  ShieldCheck,
  Scale,
  AlertTriangle,
  FileText,
  Lock,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface TermsPageProps {
  onNavigateHome: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Botão de retorno e Navegação */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a página inicial</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Última atualização: 10 de novembro de 2026
        </span>
      </div>

      {/* Cabeçalho da Página */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-[#003876] dark:text-blue-300">
          <Scale className="w-3.5 h-3.5" />
          <span>Documento Jurídico Oficial</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Termos de Uso do Serviço
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          Bem-vindo ao <strong>Fato ou Farsa</strong>. Estes Termos de Uso regem o acesso e a utilização de nossa plataforma de auditoria forense e verificação de alegações em vídeos e conteúdos digitais publicados no TikTok.
        </p>
      </div>

      {/* Sumário Executivo */}
      <div className="rounded-2xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/50 dark:bg-blue-950/30 p-5 sm:p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Princípios Essenciais em Destaque</span>
        </h2>
        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Finalidade Educacional e Acadêmica:</strong> O Fato ou Farsa é uma plataforma de pesquisa científica e checagem de fatos, sem fins lucrativos ou caráter persecutório.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Limitação de IA:</strong> As análises combinam estatística determinística (IQR) e modelos de linguagem, devendo ser interpretadas como suporte analítico e não como verdade jurídica absoluta.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Respeito ao TikTok:</strong> A plataforma cumpre as Diretrizes da Comunidade do TikTok e proíbe terminantemente raspagem pirata ou engenharia reversa.</span>
          </li>
        </ul>
      </div>

      {/* Seções dos Termos */}
      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Seção 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">1</span>
            Objetivo e Natureza da Aplicação
          </h2>
          <p>
            O <strong>Fato ou Farsa</strong> é um sistema informatizado desenvolvido para investigar e avaliar a credibilidade de afirmações e a consistência de engajamento público no ecossistema de vídeos curtos do TikTok.
          </p>
          <p>
            A plataforma opera em duas vertentes complementares:
          </p>
          <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Auditoria Estatística Quantitativa:</strong> Análise de dispersão amostral (IQR — Amplitude Interquartil, mediana de reproduções e razão entre curtidas e visualizações) para detectar desvios numéricos atípicos em amostras públicas.
            </li>
            <li>
              <strong>Verificação Factual Qualitativa com Inteligência Artificial:</strong> Extração e checagem de afirmações factuais contra bases de conhecimento consolidadas, dados de órgãos reguladores nacionais (ANVISA, CFM, CVM, Banco Central) e literatura científica.
            </li>
          </ol>
        </section>

        {/* Seção 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">2</span>
            Aceitação dos Termos e Capacidade Jurídica
          </h2>
          <p>
            Ao acessar a plataforma, submeter links do TikTok, pesquisar criadores ou utilizar qualquer uma de suas ferramentas, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com a nossa <a href="/privacy" onClick={(e) => { e.preventDefault(); window.history.pushState(null, '', '/privacy'); window.dispatchEvent(new PopStateEvent('popstate')); }} className="text-[#003876] dark:text-blue-400 font-semibold underline">Política de Privacidade</a>.
          </p>
          <p>
            Caso não concorde com qualquer disposição aqui estabelecida, você deve abster-se imediatamente de utilizar os serviços.
          </p>
        </section>

        {/* Seção 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">3</span>
            Uso Aceitável e Responsabilidades do Usuário
          </h2>
          <p>Você se compromete expressamente a utilizar o Fato ou Farsa estritamente para finalidades legítimas, sendo estritamente proibido:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400">Proibição de Assédio e Linchamento</span>
              <p className="text-slate-600 dark:text-slate-400">É vedado utilizar as análises da plataforma para promover ataques coordenados, perseguição digital (*doxxing*), difamação ou ameaças contra criadores de conteúdo do TikTok.</p>
            </div>
            <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
              <span className="font-bold text-rose-700 dark:text-rose-400">Proibição de Abuso de Infraestrutura</span>
              <p className="text-slate-600 dark:text-slate-400">É vedado efetuar ataques de negação de serviço (DoS/DDoS), engenharia reversa das APIs de backend ou burlar os limites operacionais do serviço.</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            O usuário assume integral responsabilidade civil e criminal pelas informações, transcrições e alegações que submeter à análise, respondendo por eventuais danos causados a terceiros na forma da lei (Art. 186 do Código Civil Brasileiro).
          </p>
        </section>

        {/* Seção 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">4</span>
            Limitações Metodológicas e Inteligência Artificial
          </h2>
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Aviso Importante sobre Inteligência Artificial e Estatística</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
              O sistema utiliza modelos de linguagem natural (LLMs) e cálculos matemáticos determinísticos para apoiar a checagem. No entanto:
            </p>
            <ul className="list-disc pl-5 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <li><strong>Não é sentença judicial nem laudo pericial oficial do Estado:</strong> O resultado é um instrumento informativo para auxílio à formação de convicção crítica.</li>
              <li><strong>Métricas atípicas não provam fraude isoladamente:</strong> Picos de reproduções com poucas curtidas no TikTok podem decorrer da dinâmica da página "Para Você" (FYP), de rejeição temática ou de fatores técnicos benignos. O sistema sempre apresenta hipóteses alternativas.</li>
              <li><strong>Inexistência de infalibilidade:</strong> Modelos de IA podem apresentar imprecisões contextuais. Recomendamos sempre a checagem cruzada nas fontes e links institucionais anexados ao relatório.</li>
            </ul>
          </div>
        </section>

        {/* Seção 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">5</span>
            Propriedade Intelectual e Uso Legítimo (Fair Use)
          </h2>
          <p>
            O código-fonte, a arquitetura de software, as marcas e os elementos de identidade visual do <strong>Fato ou Farsa</strong> são protegidos pela legislação de direitos autorais e propriedade intelectual (Lei nº 9.609/1998 e Lei nº 9.610/1998).
          </p>
          <p>
            Os conteúdos analisados (vídeos, áudios, legendas, nomes e fotos de perfil de terceiros no TikTok) permanecem sob a exclusiva titularidade de seus respectivos criadores e da plataforma TikTok. A análise e exibição de fragmentos no Fato ou Farsa ocorrem sob o amparo do <strong>Art. 46 da Lei de Direitos Autorais (Lei nº 9.610/1998)</strong>, com propósitos estritos de:
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li>Citação para fins de crítica, estudo, verificação jornalística e debate acadêmico;</li>
            <li>Identificação da fonte e preservação de evidências públicas digitais em contexto probatório;</li>
            <li>Defesa do direito do consumidor e combate à desinformação pública em saúde e finanças.</li>
          </ul>
        </section>

        {/* Seção 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">6</span>
            Integração com APIs Oficiais e Termos do TikTok
          </h2>
          <p>
            O Fato ou Farsa adota estrita conformidade com os termos de desenvolvedores do TikTok (<a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-[#003876] dark:text-blue-400 underline inline-flex items-center gap-0.5">TikTok for Developers <ExternalLink className="w-3 h-3 inline" /></a>):
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li>Utilizamos os fluxos oficiais da <strong>TikTok Display API v2</strong> para contas autenticadas sob o consentimento do criador;</li>
            <li>Não realizamos raspagem não autorizada (*scraping*), automações clandestinas ou contorno de medidas técnicas de segurança;</li>
            <li>Não violamos a privacidade dos criadores: nenhum dado pessoal restrito ou mensagem privada é acessado.</li>
          </ul>
        </section>

        {/* Seção 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">7</span>
            Disponibilidade, Modificações e Foro
          </h2>
          <p>
            O serviço é disponibilizado no estado em que se encontra (*"as is"*), sem garantias de operação ininterrupta. Reservamo-nos o direito de aprimorar, modificar ou descontinuar funcionalidades a qualquer tempo para acompanhar evoluções técnicas ou regulatórias.
          </p>
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil, em particular o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), ficando eleito o foro da comarca competente no Brasil para dirimir eventuais controvérsias.
          </p>
        </section>

        {/* Seção 8: Contato */}
        <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#003876] dark:text-blue-400" />
            <span>Dúvidas e Contato Institucional</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Para dúvidas relativas a estes Termos de Uso, esclarecimentos metodológicos ou solicitações acadêmicas, contate a coordenação do projeto pelo e-mail institucional: <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">contato@fatooufarsa.com.br</span> ou via repositório acadêmico do TCC.
          </p>
        </section>
      </div>

      {/* Rodapé Interno da Página Legal */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <button
          onClick={onNavigateHome}
          className="font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer"
        >
          &larr; Retornar para a verificação de conteúdos
        </button>
        <div className="flex items-center gap-4">
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:underline text-slate-700 dark:text-slate-300 font-medium"
          >
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
};
