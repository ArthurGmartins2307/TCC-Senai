/**
 * Fato ou Farsa - Página Inicial Simplificada e Funcional (Plataforma TikTok)
 * Conforme Seção 4, Seção 5 e solicitação do usuário:
 * - Apenas o ícone oficial é exibido na logo (sem o nome embutido)
 * - Na tela principal, a logo é exibida com tamanho ampliado e destaque visual
 * - O nome "Fato ou Farsa" é posicionado elegantemente no identificador da aplicação
 * - Textos padronizados conforme Seção 5 do briefing oficial (pt-BR)
 */

import React, { useState } from 'react';
import {
  Search,
  BarChart3,
  SearchCheck,
  FileText,
  AlertCircle,
  ArrowRight,
  FileCheck2,
  Video,
} from 'lucide-react';
import { LogoIcon } from '../brand/Logo';

interface HomeSimpleViewProps {
  onStartAnalysis: (usernameOrUrl: string, manualTranscript?: string) => void;
  onSelectDemo: (demoId: string) => void;
  isLoading: boolean;
  onOpenDirectFactCheck?: () => void;
}

const TIKTOK_DEMO_PRESETS = [
  {
    id: 'saude_vital',
    handle: '@saude_vital_brasil',
    category: 'Saúde & Bem-estar',
    tag: 'Cura milagrosa em 48h',
    tagColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900',
  },
  {
    id: 'tech_investimentos',
    handle: '@tech_investimentos_oficial',
    category: 'Finanças & Cripto',
    tag: 'Robô do Pix / Lucro fixo',
    tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
  },
  {
    id: 'dra_mariana',
    handle: '@dra_mariana_nutricao',
    category: 'Ciência & Nutrição',
    tag: 'Perfil autêntico (USP/CRN)',
    tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
  },
  {
    id: 'noticias_urgente',
    handle: '@noticias_urgente_brasil',
    category: 'Mídia & Jornalismo',
    tag: 'Cortes sensacionalistas',
    tagColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900',
  },
];

export const HomeSimpleView: React.FC<HomeSimpleViewProps> = ({
  onStartAnalysis,
  onSelectDemo,
  isLoading,
  onOpenDirectFactCheck,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showManualTranscript, setShowManualTranscript] = useState(false);
  const [manualTranscript, setManualTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = inputValue.trim();
    if (!trimmed && !manualTranscript.trim()) {
      setErrorMsg('Cole aqui o link do vídeo do TikTok, digite o @usuário ou insira a legenda/transcrição para análise.');
      return;
    }

    onStartAnalysis(trimmed || '@conteudo_tiktok', manualTranscript.trim() || undefined);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12 max-w-3xl mx-auto w-full">
      {/* Cabeçalho Principal: Logo Ampliada e Título Conforme Seções 4 e 5 */}
      <div className="text-center space-y-4 mb-8 sm:mb-10 w-full flex flex-col items-center">
        {/* Logo Ampliada na Tela Principal (Apenas o Ícone Oficial, sem texto na logo) */}
        <div className="relative inline-flex items-center justify-center p-2 rounded-2xl transition-transform hover:scale-105 duration-300">
          <LogoIcon
            size={124}
            className="h-28 sm:h-36 md:h-40 w-auto drop-shadow-xl"
            altText="Fato ou Farsa — Ícone Oficial de Verificação"
          />
        </div>

        {/* Identificador Oficial do Produto em Local Apropriado */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-xs font-semibold shadow-xs">
          <span className="text-[#003876] dark:text-[#38bdf8] font-bold">Fato</span>
          <span className="text-[#F5B800] font-bold">ou</span>
          <span className="text-[#00A86B] dark:text-[#34d399] font-bold">Farsa</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Plataforma de Verificação TikTok</span>
        </div>

        {/* Título Principal Conforme Seção 5: Verificação de conteúdo */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Verificação de conteúdo
        </h1>

        {/* Descrição Conforme Seção 5 */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Investigue afirmações publicadas no TikTok com apoio de fontes verificáveis e análise contextual.
        </p>
      </div>

      {/* Caixa Principal de Entrada */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm transition-colors">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            {/* Campo Principal Conforme Seção 5: Link do vídeo do TikTok */}
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Video className="h-4 w-4 text-[#003876] dark:text-blue-400" />
              <span>Link do vídeo do TikTok</span>
            </label>
            <button
              type="button"
              onClick={() => setShowManualTranscript(!showManualTranscript)}
              className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {showManualTranscript ? 'Ocultar legenda/transcrição' : '+ Inserir legenda ou transcrição'}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                /* Placeholder Conforme Seção 5: Cole aqui o link do vídeo que deseja investigar */
                placeholder="Cole aqui o link do vídeo que deseja investigar"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003876] dark:focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {/* Ação Principal Conforme Seção 5: Analisar conteúdo */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003876] hover:bg-[#002D62] dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              <span>{isLoading ? 'Analisando...' : 'Analisar conteúdo'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Fallback de Transcrição / Legenda Manual Conforme Seção 3 e Seção 6 */}
          {showManualTranscript && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
                <span>Legenda, transcrição de áudio ou alegação específica:</span>
                <span className="text-[10px] text-slate-400">Fluxo alternativo para conteúdos sem API direta</span>
              </div>
              <textarea
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="Cole aqui a legenda completa do vídeo, transcrição do áudio ou a afirmação específica que deseja verificar..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#003876]"
              />
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nota Informativa Conforme Seção 5 */}
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
            <strong>Nota informativa:</strong> A análise depende dos dados disponíveis e das evidências encontradas. A ausência de evidências não significa que uma afirmação seja falsa.
          </p>
        </form>

        {/* Casos Prontos do TikTok para Teste Imediato */}
        <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Cenários de teste no TikTok disponíveis:
            </span>
            <span className="text-[10px] font-mono text-slate-400">Demonstração</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIKTOK_DEMO_PRESETS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => onSelectDemo(demo.id)}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group cursor-pointer"
              >
                <div className="truncate mr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate group-hover:text-[#003876] dark:group-hover:text-blue-400">
                    {demo.handle}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                    {demo.category}
                  </span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border shrink-0 ${demo.tagColor}`}>
                  {demo.tag}
                </span>
              </button>
            ))}
          </div>

          {onOpenDirectFactCheck && (
            <div className="mt-3 pt-3 border-t border-slate-150 dark:border-slate-800 flex justify-center">
              <button
                type="button"
                onClick={onOpenDirectFactCheck}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>Deseja checar diretamente um fato isolado?</span>
                <span className="underline">Checagem Factual Direta &rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Três Pilares Metodológicos Funcionais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8 w-full">
        {/* Pilar 1: Métricas do TikTok */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#003876] dark:text-blue-400">
            <BarChart3 className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Métricas</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            Visualizações (plays), curtidas, comentários, compartilhamentos e taxa de conversão no TikTok.
          </p>
        </div>

        {/* Pilar 2: Investigação Forense */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#F5B800] dark:text-amber-400">
            <SearchCheck className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Investigação</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            Detecção determinística de anomalias estatísticas e checagem de alegações com IA baseada em evidências.
          </p>
        </div>

        {/* Pilar 3: Relatório com Fontes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#00A86B] dark:text-emerald-400">
            <FileText className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Relatório</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            Classificações fundamentadas, fontes citadas com URLs e diretrizes oficiais de denúncia no TikTok.
          </p>
        </div>
      </div>
    </div>
  );
};
