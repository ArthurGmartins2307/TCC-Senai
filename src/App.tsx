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
import { requestAiAnalysis } from './services/geminiService';
import { AppNavbar } from './components/layout/AppNavbar';
import { HomeSimpleView } from './components/home/HomeSimpleView';
import { DashboardView } from './components/dashboard/DashboardView';
import { SettingsModal } from './components/settings/SettingsModal';
import { HistoryDrawer } from './components/dashboard/HistoryDrawer';
import { NewAnalysisModal } from './components/dashboard/NewAnalysisModal';
import { DirectFactCheckModal } from './components/factcheck/DirectFactCheckModal';
import { ApiIntegrationsModal } from './components/integrations/ApiIntegrationsModal';

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
  const [isDirectFactCheckOpen, setIsDirectFactCheckOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Caso demo ativo
  const [selectedDemoId, setSelectedDemoId] = useState<string>('saude_vital');

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

    const generatedProfile: TikTokProfile = {
      username: clean || 'criador_tiktok',
      fullName: clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : 'Criador do TikTok',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      isVerified: false,
      followersCount: 68000,
      followingCount: 140,
      likesReceivedCount: 520000,
      videosCount: 32,
      biography: `Perfil em @${clean || 'criador_tiktok'}. Análise de conformidade e evidências realizada via Fato ou Farsa.`,
      category: 'Criador de Conteúdo',
      profileUrl: `https://www.tiktok.com/@${clean || 'criador_tiktok'}`,
      joinedDate: '2023',
    };

    const mainCaption = manualTranscript
      ? `Publicação sob investigação: "${manualTranscript.slice(0, 180)}..."`
      : `Conteúdo de vídeo publicado no TikTok com potencial de ampla circulação. Verifique as fontes.`;

    const generatedPosts: TikTokVideo[] = [
      {
        id: `video_${clean}_1`,
        videoId: '7379201948201928374',
        type: 'video',
        caption: mainCaption,
        transcript: manualTranscript || 'Transcrição não informada diretamente. Investigação focada em padrões de métricas e legenda.',
        soundTitle: 'som original - ' + (clean || 'Criador'),
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        formattedDate: 'Há 2 dias',
        viewsCount: 380000,
        likesCount: 6200,
        commentsCount: 540,
        sharesCount: 1900,
        savesCount: 1200,
        durationSeconds: 45,
        url: `https://www.tiktok.com/@${clean || 'criador_tiktok'}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
        isOutlier: false,
        anomalyScore: 22,
        suspicionFlags: manualTranscript ? ['Texto inserido manualmente submetido para validação cruzada'] : [],
      },
      {
        id: `video_${clean}_2`,
        videoId: '7372910481920192831',
        type: 'video',
        caption: 'Revelação inédita que todos deveriam saber antes que removam do ar! #alerta #viral',
        transcript: 'Método revelado pela primeira vez. Não perca esta oportunidade antes que encerrem as inscrições.',
        soundTitle: 'Dramatic Suspense - Beat Audio',
        timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
        formattedDate: 'Há 5 dias',
        viewsCount: 1150000,
        likesCount: 940, // Discrepância
        commentsCount: 1200,
        sharesCount: 3400,
        savesCount: 890,
        durationSeconds: 38,
        url: `https://www.tiktok.com/@${clean || 'criador_tiktok'}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
        isOutlier: true,
        anomalyScore: 68,
        suspicionFlags: ['Discrepância acentuada entre reproduções (1,1M) e taxa de curtidas (0,08%)'],
      },
      {
        id: `video_${clean}_3`,
        videoId: '7369182736451928372',
        type: 'video',
        caption: 'Rotina e bastidores do processo diário. #vlog #diaadia',
        transcript: 'Acompanhe comigo um pouco do fluxo de trabalho e dicas práticas.',
        soundTitle: 'Acoustic Chill Vibes',
        timestamp: new Date(Date.now() - 11 * 86400000).toISOString(),
        formattedDate: 'Há 11 dias',
        viewsCount: 210000,
        likesCount: 16500,
        commentsCount: 380,
        sharesCount: 720,
        savesCount: 1400,
        durationSeconds: 32,
        url: `https://www.tiktok.com/@${clean || 'criador_tiktok'}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=80',
        isOutlier: false,
        anomalyScore: 8,
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
        dataSource: manualTranscript ? 'manual_input' : 'sandbox_dataset',
        submittedTranscript: manualTranscript,
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
      {/* Barra de Navegação Compacta e Funcional Conforme Seção 4 */}
      <AppNavbar
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
        {currentView === 'home' ? (
          <HomeSimpleView
            onStartAnalysis={handlePerformAnalysis}
            onSelectDemo={handleSelectDemoScenario}
            isLoading={isLoadingAi}
            onOpenDirectFactCheck={() => setIsDirectFactCheckOpen(true)}
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
          <span>Fato ou Farsa — Plataforma de Verificação de Conteúdos do TikTok</span>
          <span className="text-[11px]">Em conformidade com a LGPD (Lei 13.709/2018) e termos oficiais do TikTok</span>
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
      />
    </div>
  );
}
