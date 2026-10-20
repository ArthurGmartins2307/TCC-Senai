/**
 * Fato ou Farsa - Página Inicial Simplificada e Funcional
 * Conforme Seção 4: Ponto de entrada compacto focado na análise de perfis
 */

import React, { useState } from 'react';
import { Search, BarChart3, SearchCheck, FileText, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { LogoIcon } from '../brand/Logo';

interface HomeSimpleViewProps {
  onStartAnalysis: (usernameOrUrl: string) => void;
  onSelectDemo: (demoId: string) => void;
  isLoading: boolean;
  onOpenDirectFactCheck?: () => void;
}

const DEMO_PRESETS = [
  {
    id: 'saude_vital',
    handle: '@saude_vital_brasil',
    category: 'Saúde & Bem-estar',
    tag: 'Alegações milagrosas',
    tagColor: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900',
  },
  {
    id: 'tech_investimentos',
    handle: '@tech_investimentos_oficial',
    category: 'Serviços Financeiros',
    tag: 'Lucro diário garantido',
    tagColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900',
  },
  {
    id: 'dra_mariana',
    handle: '@dra_mariana_nutricao',
    category: 'Nutrição & Ciência',
    tag: 'Perfil autêntico/USP',
    tagColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900',
  },
  {
    id: 'noticias_urgente',
    handle: '@noticias_urgente_brasil',
    category: 'Mídia & Jornalismo',
    tag: 'Vídeos antigos reciclados',
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMsg('Por favor, digite o nome de usuário ou cole o link do perfil.');
      return;
    }

    onStartAnalysis(trimmed);
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-10 sm:py-16 max-w-3xl mx-auto w-full">
      {/* Cabeçalho Limpo e Direto ao Ponto */}
      <div className="text-center space-y-3 mb-8 sm:mb-10 w-full">
        <div className="inline-flex items-center justify-center mb-1">
          <LogoIcon size={52} />
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 font-sans">
          Verifique conteúdos do Instagram
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Analise métricas, investigue padrões suspeitos e consulte evidências para avaliar conteúdos que merecem verificação.
        </p>
      </div>

      {/* Caixa Principal de Entrada */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm transition-colors">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Perfil do Instagram
          </label>

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
                placeholder="Digite @usuário ou cole o link do perfil"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003876] dark:focus:ring-blue-500 focus:border-transparent transition-all"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#003876] hover:bg-[#002D62] dark:bg-blue-600 dark:hover:bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer whitespace-nowrap"
            >
              <span>{isLoading ? 'Analisando...' : 'Analisar perfil'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 pt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nota Oficial Abaixo da Entrada Obrigatória */}
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1 leading-relaxed">
            A análise depende dos dados disponíveis. Métricas de engajamento, isoladamente, não comprovam que um conteúdo é falso.
          </p>
        </form>

        {/* Casos Rápidos para Teste Imediato */}
        <div className="mt-6 pt-5 border-t border-slate-150 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Perfis de demonstração para testar agora:
            </span>
            <span className="text-[10px] font-mono text-slate-400">Dados simulados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEMO_PRESETS.map((demo) => (
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
                <span>Tem apenas um Reel ou alegação específica para checar?</span>
                <span className="underline">Checagem Direta de Fato &rarr;</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Três Funcionalidades Compactas Oficiais Obrigatórias */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8 w-full">
        {/* Recurso 1: Métricas */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#003876] dark:text-blue-400">
            <BarChart3 className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Métricas</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            médias de visualizações e curtidas.
          </p>
        </div>

        {/* Recurso 2: Investigação */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#F5B800] dark:text-amber-400">
            <SearchCheck className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Investigação</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            padrões atípicos e evidências contextuais.
          </p>
        </div>

        {/* Recurso 3: Relatório */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 p-4 text-left">
          <div className="flex items-center gap-2 mb-1.5 text-[#00A86B] dark:text-emerald-400">
            <FileText className="h-4 w-4" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Relatório</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            resultados explicados e orientações para verificação.
          </p>
        </div>
      </div>
    </div>
  );
};
