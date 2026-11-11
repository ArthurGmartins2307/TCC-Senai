/**
 * Fato ou Farsa - Aplicação Principal de Verificação de Conteúdos do TikTok
 * Arquitetura voltada para funcionalidade, clareza, simplicidade e rigor analítico.
 */

import React, { useState, useEffect } from 'react';
import {
  ThemeConfig,
  InvestigationReport,
  TikTokProfile,
  TikTokVideo,
} from './types';
import { calculateStatisticalSummary } from './utils/statistics';
import { DEMO_DATASETS } from './data/mockProfiles';
import { requestAiAnalysis, fetchTikTokProfileData } from './services/geminiService';
import { AppNavbar } from './components/layout/AppNavbar';
import { HomeSimpleView } from './components/home/HomeSimpleView';
import { DashboardView } from './components/dashboard/DashboardView';
import { SettingsModal } from './components/settings/SettingsModal';
import { HistoryDrawer } from './components/dashboard/HistoryDrawer';
import { NewAnalysisModal } from './components/dashboard/NewAnalysisModal';
import { DirectFactCheckModal } from './components/factcheck/DirectFactCheckModal';
import { ApiIntegrationsModal } from './components/integrations/ApiIntegrationsModal';
import { TermsPage } from './components/legal/TermsPage';
import { PrivacyPage } from './components/legal/PrivacyPage';

export type AppView = 'home' | 'dashboard' | 'terms' | 'privacy';

const getInitialView = (): AppView => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path === '/terms' || path.startsWith('/terms/')) return 'terms';
    if (path === '/privacy' || path.startsWith('/privacy/')) return 'privacy';
  }
  return 'home';
};

const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light',
  primaryColor: '#003876',
  secondaryColor: '#F5B800',
  accentColor: '#00A86B',
  reducedMotion: false,
  cursorParallax: false,
  scrollAnimations: false,
  visualIntensity: 1.0,
  decorativeTransparency: 1.0,
  visualDensity: 'comfortable',
};

export default function App() {
  // Visualização ativa: 'home', 'dashboard', 'terms' ou 'privacy'
  const [currentView, setCurrentView] = useState<AppView>(getInitialView);

  // Configuração de tema e acessibilidade
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('fatooufarsa_theme_config');
      return saved ? JSON.parse(saved) : DEFAULT_THEME_CONFIG;
    } catch {
      return DEFAULT_THEME_CONFIG;
    }
  });

  // Modais globais
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);
  const [isDirectFactCheckOpen, setIsDirectFactCheckOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Caso demo ativo
  const [selectedDemoId, setSelectedDemoId] = useState<string>('saude_vital');

  // Token oficial do TikTok salvo pelo usuário
  const [tiktokToken, setTiktokToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('fatooufarsa_tiktok_token') || null;
    } catch {
      return null;
    }
  });

  // Relatório ativo inicial
  const [activeReport, setActiveReport] = useState<InvestigationReport>(() => {
    const demo = DEMO_DATASETS['saude_vital'];
    const stats = calculateStatisticalSummary(demo.posts);
    return {
      id: 'report_initial',
      createdAt: new Date().toLocaleString('pt-BR'),
      profile: demo.profile,
      posts: demo.posts,
      statistics: stats,
      aiAnalysis: demo.presetAiResult,
      isDemo: true,
      dataSource: 'sandbox_dataset',
    };
  });

  // Histórico salvo
  const [historyReports, setHistoryReports] = useState<InvestigationReport[]>(() => {
    try {
      const saved = localStorage.getItem('fatooufarsa_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estado de carregamento da IA
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Sincronizar tema no DOM
  useEffect(() => {
    try {
      localStorage.setItem('fatooufarsa_theme_config', JSON.stringify(themeConfig));
      const isDark =
        themeConfig.mode === 'dark' ||
        (themeConfig.mode === 'auto' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [themeConfig]);

  // Navegação entre rotas com pushState
  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    const targetPath = view === 'terms' ? '/terms' : view === 'privacy' ? '/privacy' : '/';
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath && (view === 'terms' || view === 'privacy' || targetPath === '/')) {
        window.history.pushState(null, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sincronizar rota do navegador com popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/terms' || path.startsWith('/terms/')) {
        setCurrentView('terms');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (path === '/privacy' || path.startsWith('/privacy/')) {
        setCurrentView('privacy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (currentView === 'terms' || currentView === 'privacy') {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  // Salvar no histórico
  const saveToHistory = (report: InvestigationReport) => {
    setHistoryReports((prev) => {
      const filtered = prev.filter((r) => r.profile.username !== report.profile.username);
      const updated = [report, ...filtered].slice(0, 15);
      try {
        localStorage.setItem('fatooufarsa_history', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Carregar cenário de demonstração
  const handleSelectDemoScenario = (demoId: string) => {
    const demo = DEMO_DATASETS[demoId] || DEMO_DATASETS['saude_vital'];
    setSelectedDemoId(demoId);
    const stats = calculateStatisticalSummary(demo.posts);
    const newReport: InvestigationReport = {
      id: `report_${demoId}_${Date.now()}`,
      createdAt: new Date().toLocaleString('pt-BR'),
      profile: demo.profile,
      posts: demo.posts,
      statistics: stats,
      aiAnalysis: demo.presetAiResult,
      isDemo: true,
      dataSource: 'sandbox_dataset',
    };
    setActiveReport(newReport);
    saveToHistory(newReport);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Iniciar análise de vídeo ou perfil do TikTok
  const handlePerformAnalysis = async (input: string, manualTranscript?: string) => {
    let clean = input.trim();

    // Normalização de URL do TikTok se fornecida
    if (clean.includes('tiktok.com/')) {
      try {
        const url = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0 && parts[0].startsWith('@')) {
          clean = parts[0];
        }
      } catch {
        // Fallback
      }
    }

    clean = clean.replace('@', '').toLowerCase();

    // Mapeamento caso coincida com casos de demonstração
    if (clean.includes('saude') || clean.includes('vital')) {
      handleSelectDemoScenario('saude_vital');
      return;
    }
    if (clean.includes('invest') || clean.includes('tech') || clean.includes('pix') || clean.includes('trader')) {
      handleSelectDemoScenario('tech_investimentos');
      return;
    }
    if (clean.includes('mariana') || clean.includes('nutri') || clean.includes('dra')) {
      handleSelectDemoScenario('dra_mariana');
      return;
    }
    if (clean.includes('noticia') || clean.includes('urgente') || clean.includes('fato') || clean.includes('plantao')) {
      handleSelectDemoScenario('noticias_urgente');
      return;
    }

    // Perfil arbitrário ou vídeo com transcrição fornecido pelo usuário
    setIsLoadingAi(true);

    try {
      // 1. Consulta dados na TikTok Display API v2 oficial (ou fallback transparente)
      const tiktokData = await fetchTikTokProfileData(
        input,
        manualTranscript,
        tiktokToken || undefined
      );

      const targetProfile: TikTokProfile = {
        username: tiktokData.profile.username,
        fullName: tiktokData.profile.fullName,
        avatarUrl: tiktokData.profile.avatarUrl,
        isVerified: tiktokData.profile.isVerified,
        followersCount: tiktokData.profile.followersCount,
        followingCount: tiktokData.profile.followingCount,
        likesReceivedCount: tiktokData.profile.likesReceivedCount,
        videosCount: tiktokData.profile.videosCount,
        biography: tiktokData.profile.biography,
        category: tiktokData.profile.category,
        profileUrl: tiktokData.profile.profileUrl,
        joinedDate: tiktokData.profile.joinedDate,
      };

      const targetPosts: TikTokVideo[] = tiktokData.posts.map((p) => ({
        id: p.id,
        videoId: p.videoId,
        type: p.type,
        caption: p.caption,
        transcript: p.transcript,
        soundTitle: p.soundTitle,
        timestamp: p.timestamp,
        formattedDate: p.formattedDate,
        viewsCount: p.viewsCount,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        sharesCount: p.sharesCount,
        savesCount: p.savesCount,
        durationSeconds: p.durationSeconds,
        url: p.url,
        thumbnailUrl: p.thumbnailUrl,
        isOutlier: p.isOutlier,
        anomalyScore: p.anomalyScore,
        suspicionFlags: p.suspicionFlags,
      }));

      const stats = calculateStatisticalSummary(targetPosts);

      // 2. Executa a análise pericial com IA (Gemini ou Base Forense Nacional)
      const aiResult = await requestAiAnalysis(targetProfile, targetPosts, stats);

      const newReport: InvestigationReport = {
        id: `report_${targetProfile.username}_${Date.now()}`,
        createdAt: new Date().toLocaleString('pt-BR'),
        profile: targetProfile,
        posts: targetPosts,
        statistics: stats,
        aiAnalysis: aiResult,
        isDemo: !tiktokData.isLiveApi,
        dataSource: tiktokData.source,
        submittedTranscript: manualTranscript,
      };

      setActiveReport(newReport);
      saveToHistory(newReport);
    } catch (err) {
      console.error('Falha ao processar análise do TikTok:', err);
    } finally {
      setIsLoadingAi(false);
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reavaliar com IA
  const handleRefreshAi = async () => {
    setIsLoadingAi(true);
    try {
      const aiResult = await requestAiAnalysis(
        activeReport.profile,
        activeReport.posts,
        activeReport.statistics,
        activeReport.aiAnalysis
      );
      const updated = {
        ...activeReport,
        aiAnalysis: aiResult,
      };
      setActiveReport(updated);
      saveToHistory(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Barra de Navegação Compacta e Funcional Conforme Seção 4 */}
      <AppNavbar
        currentView={currentView}
        onNavigateHome={() => navigateTo('home')}
        onOpenNewAnalysis={() => setIsNewAnalysisOpen(true)}
        onOpenDirectFactCheck={() => setIsDirectFactCheckOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={historyReports.length}
        themeConfig={themeConfig}
        onToggleTheme={() =>
          setThemeConfig((prev) => ({
            ...prev,
            mode: prev.mode === 'dark' ? 'light' : 'dark',
          }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col">
        {currentView === 'terms' ? (
          <TermsPage onNavigateHome={() => navigateTo('home')} />
        ) : currentView === 'privacy' ? (
          <PrivacyPage onNavigateHome={() => navigateTo('home')} />
        ) : currentView === 'home' ? (
          <HomeSimpleView
            onStartAnalysis={handlePerformAnalysis}
            onSelectDemo={handleSelectDemoScenario}
            isLoading={isLoadingAi}
            onOpenDirectFactCheck={() => setIsDirectFactCheckOpen(true)}
            onOpenApiModal={() => setIsApiModalOpen(true)}
            isTikTokConnected={Boolean(tiktokToken)}
          />
        ) : (
          <DashboardView
            report={activeReport}
            onBackToHome={() => navigateTo('home')}
            onSelectDemoScenario={handleSelectDemoScenario}
            onPerformNewAnalysis={handlePerformAnalysis}
            onRefreshAi={handleRefreshAi}
            isLoadingAi={isLoadingAi}
            historyReports={historyReports}
            onSelectHistoryReport={(rep) => {
              setActiveReport(rep);
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={() => {
              setHistoryReports([]);
              try {
                localStorage.removeItem('fatooufarsa_history');
              } catch (e) {
                console.error(e);
              }
            }}
            selectedDemoId={selectedDemoId}
          />
        )}
      </main>

      {/* Rodapé da Aplicação com Links Legais */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-5 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Fato ou Farsa — Plataforma de Verificação de Conteúdos do TikTok
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px]">Em conformidade com a LGPD (Lei 13.709/2018) e termos oficiais do TikTok</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <a
              href="/terms"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('terms');
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-[#003876] dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              Termos de Uso
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('privacy');
              }}
              className="text-slate-600 dark:text-slate-400 hover:text-[#003876] dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              Política de Privacidade
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="text-slate-600 dark:text-slate-400 hover:text-[#003876] dark:hover:text-blue-400 hover:underline transition-colors cursor-pointer"
            >
              Status das APIs
            </button>
          </div>
        </div>
      </footer>

      {/* Modais Globais */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        themeConfig={themeConfig}
        onThemeConfigChange={setThemeConfig}
        onClearHistory={() => {
          setHistoryReports([]);
          try {
            localStorage.removeItem('fatooufarsa_history');
          } catch (e) {
            console.error(e);
          }
        }}
        historyCount={historyReports.length}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        reports={historyReports}
        onSelectReport={(rep) => {
          setActiveReport(rep);
          setCurrentView('dashboard');
          setIsHistoryOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onClearHistory={() => {
          setHistoryReports([]);
          try {
            localStorage.removeItem('fatooufarsa_history');
          } catch (e) {
            console.error(e);
          }
        }}
      />

      <NewAnalysisModal
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onSubmitAnalysis={handlePerformAnalysis}
        onSelectDemoScenario={handleSelectDemoScenario}
      />

      <DirectFactCheckModal
        isOpen={isDirectFactCheckOpen}
        onClose={() => setIsDirectFactCheckOpen(false)}
      />

      <ApiIntegrationsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onTokenChange={setTiktokToken}
      />
    </div>
  );
}
