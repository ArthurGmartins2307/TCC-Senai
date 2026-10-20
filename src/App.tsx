/**
 * Fato ou Farsa - Aplicação Principal de Verificação de Conteúdos do Instagram
 * Arquitetura voltada para funcionalidade, simplicidade, usabilidade e rigor analítico.
 */

import React, { useState, useEffect } from 'react';
import {
  ThemeConfig,
  InvestigationReport,
  InstagramProfile,
  InstagramPost,
} from './types';
import { calculateStatisticalSummary } from './utils/statistics';
import { DEMO_DATASETS } from './data/mockProfiles';
import { requestAiAnalysis } from './services/geminiService';
import { AppNavbar } from './components/layout/AppNavbar';
import { HomeSimpleView } from './components/home/HomeSimpleView';
import { DashboardView } from './components/dashboard/DashboardView';
import { SettingsModal } from './components/settings/SettingsModal';
import { HistoryDrawer } from './components/dashboard/HistoryDrawer';
import { NewAnalysisModal } from './components/dashboard/NewAnalysisModal';

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
  // Visualização ativa: 'home' ou 'dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

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

  // Caso demo ativo
  const [selectedDemoId, setSelectedDemoId] = useState<string>('saude_vital');

  // Relatório ativo
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
    };
    setActiveReport(newReport);
    saveToHistory(newReport);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Iniciar análise de perfil (digitado pelo usuário)
  const handlePerformAnalysis = async (input: string) => {
    const clean = input.replace('@', '').trim().toLowerCase();

    // Mapeamento caso coincida com casos de demonstração
    if (clean.includes('saude') || clean.includes('vital')) {
      handleSelectDemoScenario('saude_vital');
      return;
    }
    if (clean.includes('invest') || clean.includes('tech') || clean.includes('pix')) {
      handleSelectDemoScenario('tech_investimentos');
      return;
    }
    if (clean.includes('mariana') || clean.includes('nutri') || clean.includes('dra')) {
      handleSelectDemoScenario('dra_mariana');
      return;
    }
    if (clean.includes('noticia') || clean.includes('urgente') || clean.includes('fato')) {
      handleSelectDemoScenario('noticias_urgente');
      return;
    }

    // Perfil arbitrário fornecido pelo usuário
    setIsLoadingAi(true);

    const generatedProfile: InstagramProfile = {
      username: clean,
      fullName: clean.charAt(0).toUpperCase() + clean.slice(1),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      isVerified: false,
      followersCount: 52000,
      followingCount: 380,
      postsCount: 24,
      biography: `Perfil público em @${clean}. Análise forense realizada através do Fato ou Farsa.`,
      category: 'Criador de Conteúdo',
      profileUrl: `https://www.instagram.com/${clean}/`,
      joinedDate: '2023',
    };

    const generatedPosts: InstagramPost[] = [
      {
        id: `post_${clean}_1`,
        shortcode: 'C9Z1x8qLo',
        type: 'reel',
        caption: `Confira o comunicado oficial e compartilhe com sua rede. Mais detalhes no link da bio.`,
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        formattedDate: 'Há 2 dias',
        viewsCount: 240000,
        likesCount: 5400,
        commentsCount: 380,
        sharesCount: 1200,
        url: `https://instagram.com/${clean}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
        isOutlier: false,
        anomalyScore: 18,
        suspicionFlags: [],
      },
      {
        id: `post_${clean}_2`,
        shortcode: 'C8Y0a7bJp',
        type: 'reel',
        caption: `Método exclusivo revelado pela primeira vez. Não perca esta oportunidade antes que encerrem as inscrições.`,
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        formattedDate: 'Há 5 dias',
        viewsCount: 980000,
        likesCount: 1200, // Discrepância
        commentsCount: 920,
        sharesCount: 2400,
        url: `https://instagram.com/${clean}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
        isOutlier: true,
        anomalyScore: 56,
        suspicionFlags: ['Discrepância acentuada entre reproduções e taxa de curtidas'],
      },
      {
        id: `post_${clean}_3`,
        shortcode: 'C7X9c6dLa',
        type: 'carousel',
        caption: `3 dicas essenciais para o seu dia a dia. Deslize para o lado para conferir as lâminas.`,
        timestamp: new Date(Date.now() - 12 * 86400000).toISOString(),
        formattedDate: 'Há 12 dias',
        viewsCount: null, // Contador não exposto
        likesCount: 1840,
        commentsCount: 75,
        sharesCount: null,
        url: `https://instagram.com/${clean}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=80',
        isOutlier: false,
        anomalyScore: 6,
        suspicionFlags: [],
      },
    ];

    const stats = calculateStatisticalSummary(generatedPosts);

    try {
      const aiResult = await requestAiAnalysis(generatedProfile, generatedPosts, stats);
      const newReport: InvestigationReport = {
        id: `report_${clean}_${Date.now()}`,
        createdAt: new Date().toLocaleString('pt-BR'),
        profile: generatedProfile,
        posts: generatedPosts,
        statistics: stats,
        aiAnalysis: aiResult,
        isDemo: true,
      };
      setActiveReport(newReport);
      saveToHistory(newReport);
    } catch (err) {
      console.error(err);
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
      {/* Barra de Navegação Compacta e Funcional */}
      <AppNavbar
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNewAnalysis={() => setIsNewAnalysisOpen(true)}
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
        {currentView === 'home' ? (
          <HomeSimpleView
            onStartAnalysis={handlePerformAnalysis}
            onSelectDemo={handleSelectDemoScenario}
            isLoading={isLoadingAi}
          />
        ) : (
          <DashboardView
            report={activeReport}
            onBackToHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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

      {/* Rodapé Conciso da Aplicação */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-4 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Fato ou Farsa — Ferramenta de Análise e Verificação de Conteúdos</span>
          <span className="text-[11px]">Em conformidade com a LGPD (Lei 13.709/2018) e termos públicos do Instagram</span>
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
    </div>
  );
}
