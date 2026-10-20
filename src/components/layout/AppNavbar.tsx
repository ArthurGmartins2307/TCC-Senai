/**
 * Fato ou Farsa - Barra de Navegação Compacta e Funcional
 * Conforme Seção 4:
 * - Apenas o ícone/logotipo oficial é exibido no cabeçalho
 * - Nenhum rótulo de texto posicionado imediatamente ao lado do ícone
 * - Clicável para retornar à página inicial com acessibilidade
 */

import React from 'react';
import {
  Search,
  History,
  Sun,
  Moon,
  SlidersHorizontal,
  ArrowLeft,
  Server,
  FileCheck2,
} from 'lucide-react';
import { LogoIcon } from '../brand/Logo';
import { ThemeConfig } from '../../types';

interface AppNavbarProps {
  currentView: 'home' | 'dashboard';
  onNavigateHome: () => void;
  onOpenNewAnalysis: () => void;
  onOpenDirectFactCheck: () => void;
  onOpenApiModal: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  themeConfig: ThemeConfig;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenNewAnalysis,
  onOpenDirectFactCheck,
  onOpenApiModal,
  onOpenHistory,
  historyCount,
  themeConfig,
  onToggleTheme,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Identidade Visual: Apenas o ícone oficial no cabeçalho conforme Seção 4 */}
        <div
          onClick={onNavigateHome}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onNavigateHome();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Fato ou Farsa — Página Inicial"
          className="cursor-pointer group flex items-center focus:outline-none focus:ring-2 focus:ring-[#003876] dark:focus:ring-blue-500 rounded-lg p-0.5"
          title="Fato ou Farsa — Ir para o início"
        >
          <LogoIcon
            size={38}
            className="group-hover:scale-105 transition-transform drop-shadow-sm"
          />
        </div>

        {/* Ações da Barra Superior */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Botão de Verificação Direta de Fatos */}
          <button
            onClick={onOpenDirectFactCheck}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            title="Verificar alegação, transcrição ou legenda de vídeo do TikTok"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Checar Alegação</span>
          </button>

          {/* Botão Principal: Analisar Perfil / Vídeo */}
          {currentView === 'dashboard' ? (
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 rounded-lg border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Nova verificação</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewAnalysis}
              className="flex items-center gap-1.5 rounded-lg bg-[#003876] dark:bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#002D62] dark:hover:bg-blue-500 transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Analisar TikTok</span>
            </button>
          )}

          {/* Botão de Status das APIs & Integrações */}
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            title="Status e documentação das APIs oficiais (TikTok Display API, Gemini AI, Base Forense)"
          >
            <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">APIs</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Botão de Histórico */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            title="Histórico de auditorias realizadas"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Histórico</span>
            {historyCount > 0 && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {historyCount}
              </span>
            )}
          </button>

          {/* Alternador de Tema Claro / Escuro */}
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title={themeConfig.mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {themeConfig.mode === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Configurações */}
          <button
            onClick={onOpenSettings}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            title="Configurações da aplicação"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
