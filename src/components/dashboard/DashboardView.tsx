/**
 * Fato ou Farsa - Painel de Análise Focado (DashboardView para TikTok)
 * A. Profile Overview (Visão geral do criador/vídeo)
 * B. Key Metrics (4 cards de métricas)
 * C. Publication Analysis (Tabela de vídeos do TikTok + Gráfico)
 * D. AI Assessment ("Resultado da análise")
 * E. Reporting Guidance ("Consultar opções de denúncia no TikTok")
 * F. Fact-Checking de Vídeos com Evidências Verificadas
 */

import React, { useState } from 'react';
import {
  TikTokProfile,
  TikTokVideo,
  StatisticalSummary,
  AIAnalysisResult,
  InvestigationReport,
} from '../../types';
import { ProfileOverviewCard } from './ProfileOverviewCard';
import { KeyMetricsSection } from './KeyMetricsSection';
import { PublicationAnalysisSection } from './PublicationAnalysisSection';
import { AIAssessmentSection } from './AIAssessmentSection';
import { PostDetailModal } from './PostDetailModal';
import { ReportingGuidanceModal } from './ReportingGuidanceModal';
import { ReportExportModal } from './ReportExportModal';
import { HistoryDrawer } from './HistoryDrawer';
import { NewAnalysisModal } from './NewAnalysisModal';
import { FactCheckModal } from '../factcheck/FactCheckModal';

interface DashboardViewProps {
  report: InvestigationReport;
  onBackToHome: () => void;
  onSelectDemoScenario: (demoId: string) => void;
  onPerformNewAnalysis: (username: string, manualTranscript?: string) => void;
  onRefreshAi: () => void;
  isLoadingAi: boolean;
  historyReports: InvestigationReport[];
  onSelectHistoryReport: (report: InvestigationReport) => void;
  onClearHistory: () => void;
  selectedDemoId: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  report,
  onBackToHome,
  onSelectDemoScenario,
  onPerformNewAnalysis,
  onRefreshAi,
  isLoadingAi,
  historyReports,
  onSelectHistoryReport,
  onClearHistory,
  selectedDemoId,
}) => {
  const [selectedPost, setSelectedPost] = useState<TikTokVideo | null>(null);
  const [factCheckingPost, setFactCheckingPost] = useState<TikTokVideo | null>(null);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* SEÇÃO A: VISÃO GERAL DO PERFIL / VÍDEO */}
      <ProfileOverviewCard
        profile={report.profile}
        totalPosts={report.posts.length}
        isDemo={report.isDemo}
        selectedDemoId={selectedDemoId}
        onSelectDemo={onSelectDemoScenario}
        onNewAnalysis={() => setIsNewAnalysisOpen(true)}
        onExport={() => setIsExportOpen(true)}
        onOpenReporting={() => setIsReportingOpen(true)}
        investigatedAt={report.aiAnalysis.investigatedAt || report.createdAt}
      />

      {/* SEÇÃO B: MÉTRICAS PRINCIPAIS (4 cards compactos e objetivos) */}
      <KeyMetricsSection stats={report.statistics} />

      {/* SEÇÃO D: RESULTADO DA ANÁLISE (IA FORENSE & CONTEXTO) */}
      <AIAssessmentSection
        aiResult={report.aiAnalysis}
        isLoading={isLoadingAi}
        onRefreshAi={onRefreshAi}
        onOpenReporting={() => setIsReportingOpen(true)}
      />

      {/* SEÇÃO C: ANÁLISE DE PUBLICAÇÕES (Tabela de vídeos do TikTok + Gráfico) */}
      <PublicationAnalysisSection
        posts={report.posts}
        stats={report.statistics}
        onSelectPost={(post) => setSelectedPost(post)}
        onFactCheckPost={(post) => setFactCheckingPost(post)}
      />

      {/* Modais de Suporte e Detalhamento */}
      <PostDetailModal
        post={selectedPost}
        stats={report.statistics}
        onClose={() => setSelectedPost(null)}
        onFactCheck={(post) => {
          setSelectedPost(null);
          setFactCheckingPost(post);
        }}
      />

      <ReportingGuidanceModal
        isOpen={isReportingOpen}
        onClose={() => setIsReportingOpen(false)}
        username={report.profile.username}
      />

      <ReportExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        report={report}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        reports={historyReports}
        onSelectReport={onSelectHistoryReport}
        onClearHistory={onClearHistory}
      />

      <NewAnalysisModal
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onSubmitAnalysis={onPerformNewAnalysis}
        onSelectDemoScenario={onSelectDemoScenario}
      />

      {factCheckingPost && (
        <FactCheckModal
          isOpen={!!factCheckingPost}
          onClose={() => setFactCheckingPost(null)}
          postText={factCheckingPost.transcript || factCheckingPost.caption}
          postAuthor={report.profile.username}
          postUrl={factCheckingPost.url}
        />
      )}
    </div>
  );
};
