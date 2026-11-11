/**
 * Fato ou Farsa - Modal de Exportação do Dossiê de Auditoria (TikTok)
 * Permite download do laudo pericial formatado em PDF para arquivamento forense,
 * cópia em texto ou download dos dados brutos em JSON.
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
  Hash,
  ListVideo,
  Loader2,
  FileDown,
} from 'lucide-react';
import { InvestigationReport } from '../../types';
import { formatNumberBR, formatPercentBR } from '../../utils/statistics';
import { exportReportToForensicPDF } from '../../utils/pdfExport';

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
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [includeFullVideoList, setIncludeFullVideoList] = useState(true);
  const [includeForensicHash, setIncludeForensicHash] = useState(true);

  if (!isOpen || !report) return null;

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setPdfSuccess(false);
    try {
      await exportReportToForensicPDF(report, {
        includeFullVideoList,
        includeForensicHash,
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Erro ao gerar laudo pericial em PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

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
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-blue-800/40 bg-slate-900 shadow-2xl shadow-blue-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <FileDown className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans flex items-center gap-2">
                Exportar Laudo Pericial Forense (PDF)
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  A4 Padronizado
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gere documento formatado para arquivamento legal, cadeia de custódia e TCC acadêmico.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Caixa de Ação Principal em Destaque: PDF Forense */}
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-blue-950/30 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Laudo Pericial Oficial do TikTok (.PDF)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Documento multipágina estruturado com cabeçalho institucional, identificação do criador, gráficos métricos, veredito nos 5 níveis padronizados e certificado de autenticidade.
                </p>
              </div>

              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold px-5 py-3 text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer shrink-0"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando PDF...</span>
                  </>
                ) : pdfSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>PDF Baixado!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Baixar PDF Forense</span>
                  </>
                )}
              </button>
            </div>

            {/* Opções de Configuração do Laudo Forense */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={includeForensicHash}
                  onChange={(e) => setIncludeForensicHash(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-emerald-400" />
                  Hash SHA-256 (Cadeia de Custódia)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={includeFullVideoList}
                  onChange={(e) => setIncludeFullVideoList(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="flex items-center gap-1.5">
                  <ListVideo className="w-3.5 h-3.5 text-blue-400" />
                  Anexo com Tabela de Vídeos e Outliers
                </span>
              </label>
            </div>
          </div>

          {/* Pré-visualização Compacta dos Dados */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Síntese que constará no documento:</span>
              <span className="font-mono text-[11px] text-emerald-400">@{report.profile.username}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs text-slate-300 space-y-2 whitespace-pre-wrap max-h-48 overflow-y-auto">
              <div className="text-emerald-400 font-bold border-b border-slate-800 pb-2">
                DOSSIÊ DE AUDITORIA FORENSE — PLATAFORMA FATO OU FARSA
              </div>
              <div>
                <strong>Alvo:</strong> @{report.profile.username} ({report.profile.fullName})
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
                <strong>Amostragem:</strong> {report.statistics.totalPostsAnalyzed} vídeos auditados |{' '}
                <strong>Outliers IQR:</strong> {report.statistics.outlierCount}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com Outros Formatos (JSON, Texto, Impressão) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-800 bg-slate-950/80 px-5 sm:px-6 py-3.5 sm:py-4">
          <button
            onClick={handleCopyText}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 sm:py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 sm:py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
              title="Abrir diálogo de impressão do navegador"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-lg border border-blue-900 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 px-3.5 py-2.5 sm:py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer min-h-[40px] sm:min-h-0"
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

