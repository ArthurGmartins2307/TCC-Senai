/**
 * Fato ou Farsa - Modal de Exportação do Dossiê de Auditoria
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
DOSSIÊ DE AUDITORIA FORENSE - FATO OU FARSA
--------------------------------------------------
Perfil: @${report.profile.username} (${report.profile.fullName})
Data da Auditoria: ${report.createdAt}
Classificação Oficial: ${report.aiAnalysis.classification}
Grau de Evidência: ${report.aiAnalysis.confidenceLevel} (${report.aiAnalysis.confidenceScore}%)

SÍNTESE DE EVIDÊNCIAS:
${report.aiAnalysis.evidenceSummary}

RESUMO ESTATÍSTICO:
- Publicações Analisadas: ${report.statistics.totalPostsAnalyzed}
- Mediana de Visualizações: ${formatNumberBR(report.statistics.medianViews)}
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
Gerado pela plataforma Fato ou Farsa (Fato ou Farsa Forensic Engine)
Princípio: Analise as evidências. Explique a incerteza. Nunca invente uma conclusão.
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dossie-fato-ou-farsa-${report.profile.username}-${Date.now()}.json`);
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
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-cyan-800/40 bg-slate-900 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/50 text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans">
                Exportar Dossiê de Auditoria
              </h2>
              <p className="text-xs text-slate-400">
                Relatório forense de @{report.profile.username}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
            <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-2">
              <span>ALVO: @{report.profile.username}</span>
              <span>EMISSÃO: {report.createdAt}</span>
            </div>
            <div className="text-cyan-400 font-semibold pt-1">
              STATUS: {report.aiAnalysis.classification.toUpperCase()}
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {report.aiAnalysis.evidenceSummary}
            </p>
            <div className="pt-2 text-[11px] text-slate-400 flex justify-between">
              <span>Outliers: {report.statistics.outlierCount}</span>
              <span>Anomalia: {report.statistics.suspiciousEngagementScore}/100</span>
              <span>Confiança: {report.aiAnalysis.confidenceLevel}</span>
            </div>
          </div>

          <p className="text-[11px] font-sans text-slate-400 leading-relaxed">
            Escolha o formato de saída mais adequado para anexar a relatórios institucionais,
            pesquisas acadêmicas ou encaminhamento aos órgãos competentes.
          </p>
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar texto'}</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Baixar JSON</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
