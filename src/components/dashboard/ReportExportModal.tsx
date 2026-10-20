/**
 * Fato ou Farsa - Modal de Exportação do Dossiê de Auditoria (TikTok)
 * Permite download do relatório em JSON, cópia em texto ou impressão em PDF.
 */

import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Printer,
  Check,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { InvestigationReport } from '../../types';
import { formatNumberBR, formatPercentBR } from '../../utils/statistics';

interface ReportExportModalProps {
  report: InvestigationReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const handleCopyText = () => {
    const textSummary = `
DOSSIÊ DE AUDITORIA FORENSE - FATO OU FARSA (TIKTOK)
--------------------------------------------------
Perfil / Conteúdo: @${report.profile.username} (${report.profile.fullName})
Data da Auditoria: ${report.createdAt}
Classificação Oficial: ${report.aiAnalysis.classification}
Grau de Evidência: ${report.aiAnalysis.confidenceLevel} (${report.aiAnalysis.confidenceScore}%)

SÍNTESE DE EVIDÊNCIAS:
${report.aiAnalysis.evidenceSummary}

RESUMO ESTATÍSTICO:
- Vídeos do TikTok Analisados: ${report.statistics.totalPostsAnalyzed}
- Mediana de Visualizações (Plays): ${formatNumberBR(report.statistics.medianViews)}
- Mediana de Curtidas: ${formatNumberBR(report.statistics.medianLikes)}
- Relação Curtidas/Views: ${formatPercentBR(report.statistics.likesToViewsRatio, 2)}
- Outliers Detectados: ${report.statistics.outlierCount}
- Índice de Anomalia: ${report.statistics.suspiciousEngagementScore}/100

PRINCIPAIS OBSERVAÇÕES:
${report.aiAnalysis.supportingObservations.map((o) => `• ${o}`).join('\n')}

HIPÓTESES ALTERNATIVAS:
${report.aiAnalysis.alternativeExplanations.map((a) => `• ${a}`).join('\n')}

LIMITAÇÕES:
${report.aiAnalysis.limitations.map((l) => `• ${l}`).join('\n')}

PRÓXIMOS PASSOS:
${report.aiAnalysis.recommendedNextSteps.map((s) => `• ${s}`).join('\n')}
--------------------------------------------------
Gerado pela plataforma Fato ou Farsa (TikTok Content Verification Engine)
Princípio: Analise as evidências. Explique a incerteza. Métricas isoladas não provam má-fé.
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dossie-tiktok-fato-ou-farsa-${report.profile.username}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-blue-800/40 bg-slate-900 shadow-2xl shadow-blue-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-950/50 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans">
                Exportar Dossiê de Auditoria do TikTok
              </h2>
              <p className="text-xs text-slate-400">
                Gere cópia em texto estruturado, arquivo JSON ou imprima para registro.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pré-visualização do Relatório */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs text-slate-300 space-y-2 whitespace-pre-wrap max-h-72 overflow-y-auto">
            <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2">
              DOSSIÊ DE AUDITORIA FORENSE - FATO OU FARSA
            </div>
            <div>
              <strong>Perfil:</strong> @{report.profile.username} ({report.profile.fullName})
            </div>
            <div>
              <strong>Classificação:</strong> {report.aiAnalysis.classification}
            </div>
            <div>
              <strong>Grau de Evidência:</strong> {report.aiAnalysis.confidenceLevel} ({report.aiAnalysis.confidenceScore}%)
            </div>
            <div className="text-slate-400 pt-1">
              <strong>Síntese:</strong> {report.aiAnalysis.evidenceSummary}
            </div>
            <div className="text-slate-400">
              <strong>Vídeos Auditados:</strong> {report.statistics.totalPostsAnalyzed} |{' '}
              <strong>Outliers:</strong> {report.statistics.outlierCount}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Documento apto para instrução de relatórios e canais de denúncia do TikTok.</span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Baixar JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
