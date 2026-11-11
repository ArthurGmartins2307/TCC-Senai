/**
 * Fato ou Farsa - Barra de Navegação Responsiva com Menu Hambúrguer
 * Conforme Requisitos Oficiais de Design Responsivo:
 * - Apenas o ícone/logotipo oficial é exibido no cabeçalho (sem o nome de texto ao lado)
 * - Desktop: preserva as ações principais limpas e organizadas
 * - Mobile e telas menores: Menu Hambúrguer acessível, touch-friendly, com gaveta lateral e overlay
 * - Acessibilidade completa: aria-expanded, aria-label, suporte a tecla Escape e bloqueio de scroll
 */

import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  History,
  Sun,
  Moon,
  SlidersHorizontal,
  ArrowLeft,
  Server,
  FileCheck2,
  ChevronRight,
} from 'lucide-react';
import { LogoIcon } from '../brand/Logo';
import { ThemeConfig } from '../../types';

interface AppNavbarProps {
  currentView: 'home' | 'dashboard' | 'terms' | 'privacy';
  onNavigateHome: () => void;
  onNavigateTerms?: () => void;
  onNavigatePrivacy?: () => void;
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
  onNavigateTerms,
  onNavigatePrivacy,
  onOpenNewAnalysis,
  onOpenDirectFactCheck,
  onOpenApiModal,
  onOpenHistory,
  historyCount,
  themeConfig,
  onToggleTheme,
  onOpenSettings,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fecha o menu ao redimensionar a janela para telas maiores que md (768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Fecha o menu com a tecla Escape e previne scroll de fundo quando a gaveta está aberta
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleAction = (callback: () => void) => {
    setIsMobileMenuOpen(false);
    callback();
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm transition-colors">
        <div className="w-full flex h-16 items-center justify-between px-3 sm:px-5 lg:px-6">
          {/* Identidade Visual: Estritamente o Ícone Oficial no cabeçalho (sem texto ao lado) */}
          <div
            onClick={onNavigateHome}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigateHome();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Fato ou Farsa — Ir para a página inicial"
            className="cursor-pointer group flex items-center p-1.5 -ml-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003876] dark:focus:ring-blue-500 transition-all"
            title="Fato ou Farsa — Ir para o início"
          >
            <LogoIcon
              size={36}
              className="group-hover:scale-105 transition-transform drop-shadow-sm h-9 w-9"
              altText="Fato ou Farsa — Ícone Oficial de Verificação"
            />
          </div>

          {/* Navegação Desktop (Visível a partir de md: 768px) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
            {/* Botão de Verificação Direta de Fatos */}
            <button
              onClick={onOpenDirectFactCheck}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="Verificar alegação, transcrição ou legenda de vídeo do TikTok"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Checar Alegação</span>
            </button>

            {/* Botão Principal: Analisar Perfil / Vídeo ou Voltar ao Início */}
            {currentView !== 'home' ? (
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-1.5 rounded-lg border border-slate-250 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Página Inicial</span>
              </button>
            ) : (
              <button
                onClick={onOpenNewAnalysis}
                className="flex items-center gap-1.5 rounded-lg bg-[#003876] dark:bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#002D62] dark:hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Analisar TikTok</span>
              </button>
            )}

            {/* Botão de Status das APIs & Integrações */}
            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
              title="Status e documentação das APIs oficiais (TikTok Display API, Gemini AI, Base Forense)"
            >
              <Server className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden lg:inline">APIs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>

            {/* Botão de Histórico */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
              title="Histórico de auditorias realizadas"
            >
              <History className="h-3.5 w-3.5" />
              <span>Histórico</span>
              {historyCount > 0 && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Alternador de Tema Claro / Escuro */}
            <button
              onClick={onToggleTheme}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
              title={themeConfig.mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              aria-label={themeConfig.mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
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
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer"
              title="Configurações da aplicação"
              aria-label="Configurações"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Controles Mobile & Tablet (< md: 768px): Botão de Tema Rápido + Menu Hambúrguer */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Alternador de Tema Rápido no Mobile */}
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 active:bg-slate-200 dark:active:bg-slate-800 transition-colors"
              title={themeConfig.mode === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              aria-label={themeConfig.mode === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            >
              {themeConfig.mode === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Botão Hambúrguer Acessível e Touch-friendly */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center min-w-[42px] min-h-[42px] rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-xs active:bg-slate-100 dark:active:bg-slate-800 transition-colors cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Gaveta de Navegação Mobile (Mobile Drawer) com Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal de navegação"
          className="fixed inset-0 z-50 md:hidden flex justify-end animate-in fade-in duration-200"
        >
          {/* Backdrop semi-transparente que fecha o menu ao tocar fora */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Painel Lateral da Gaveta */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-y-auto p-5 z-10 animate-in slide-in-from-right duration-200 text-slate-800 dark:text-slate-100">
            {/* Topo da Gaveta: Logo e Botão Fechar */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <LogoIcon size={32} className="h-8 w-8" />
                  <div className="flex items-baseline font-bold tracking-tight text-base">
                    <span className="text-[#003876] dark:text-[#38bdf8]">Fato</span>
                    <span className="text-[#F5B800] px-1 text-[0.88em]">ou</span>
                    <span className="text-[#00A86B] dark:text-[#34d399]">Farsa</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center h-9 w-9 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status do Mecanismo */}
              <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">Verificação TikTok:</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ativa
                </span>
              </div>

              {/* Lista de Ações Principais do Menu */}
              <nav className="space-y-1.5 text-sm font-medium pt-1">
                {/* 1. Página Inicial / Analisar TikTok */}
                <button
                  onClick={() => handleAction(currentView !== 'home' ? onNavigateHome : onOpenNewAnalysis)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#003876] dark:text-blue-400 flex items-center justify-center shrink-0">
                      {currentView !== 'home' ? <ArrowLeft className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        {currentView !== 'home' ? 'Página Inicial' : 'Analisar TikTok'}
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        {currentView !== 'home' ? 'Retornar à tela principal' : 'Investigar novo vídeo ou perfil'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 2. Checagem Factual Direta */}
                <button
                  onClick={() => handleAction(onOpenDirectFactCheck)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileCheck2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        Checar Alegação
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        Verificar alegação ou legenda isolada
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 3. Histórico de Auditorias */}
                <button
                  onClick={() => handleAction(onOpenHistory)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <History className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        Histórico de Auditorias
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        {historyCount} laudo{historyCount !== 1 ? 's' : ''} em cache local
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {historyCount}
                  </span>
                </button>

                {/* 4. APIs & Integrações Oficiais */}
                <button
                  onClick={() => handleAction(onOpenApiModal)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <Server className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        APIs &amp; Status
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        TikTok Display API &amp; Gemini
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* 5. Configurações da Plataforma */}
                <button
                  onClick={() => handleAction(onOpenSettings)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <SlidersHorizontal className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                        Configurações
                      </span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        Tema, densidade e cache
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </nav>
            </div>

            {/* Base da Gaveta: Diretrizes e Contrato (Apenas Texto) e Alternador de Tema */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 space-y-3">
              <div className="space-y-1 text-xs">
                {/* Termos de Uso */}
                <button
                  onClick={() => handleAction(onNavigateTerms || onNavigateHome)}
                  className="w-full flex items-center px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left font-medium"
                >
                  <span>Termos de Uso</span>
                </button>

                {/* Política de Privacidade */}
                <button
                  onClick={() => handleAction(onNavigatePrivacy || onNavigateHome)}
                  className="w-full flex items-center px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left font-medium"
                >
                  <span>Política de Privacidade (LGPD)</span>
                </button>
              </div>

              {/* Botão de Troca de Tema Integrado */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-600 dark:text-slate-400">Tema ativo:</span>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-200 shadow-xs"
                >
                  {themeConfig.mode === 'dark' ? (
                    <>
                      <Sun className="h-3.5 w-3.5 text-amber-400" />
                      <span>Modo Escuro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-3.5 w-3.5 text-slate-600" />
                      <span>Modo Claro</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
