/**
 * Fato ou Farsa - Modal de Entrada para Nova Análise no TikTok
 * Suporte a link de vídeo do TikTok, link de perfil, @usuário, ID de vídeo
 * e fluxo de fallback para transcrição/legenda manual.
 */

import React, { useState } from 'react';
import { X, Search, Video, AlertCircle, ArrowRight, Sparkles, FileText } from 'lucide-react';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnalysis: (usernameOrUrl: string, manualTranscript?: string) => void;
  onSelectDemoScenario: (demoId: string) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnalysis,
  onSelectDemoScenario,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [manualTranscript, setManualTranscript] = useState('');
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed && !manualTranscript.trim()) {
      setErrorMessage('Por favor, informe um link de vídeo do TikTok, @usuário ou insira uma transcrição.');
      return;
    }

    onSubmitAnalysis(trimmed || '@video_tiktok', manualTranscript.trim() || undefined);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl border border-blue-800/40 bg-slate-900 shadow-2xl shadow-blue-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-950/50 text-blue-400">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans">
                Analisar Conteúdo do TikTok
              </h2>
              <p className="text-xs text-slate-400">
                Informe o link de um vídeo, @usuário ou ID para investigar métricas e alegações.
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

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                URL do Vídeo, @usuário ou ID do TikTok
              </label>
              <button
                type="button"
                onClick={() => setShowTranscriptInput(!showTranscriptInput)}
                className="text-[11px] font-medium text-blue-400 hover:underline cursor-pointer"
              >
                {showTranscriptInput ? 'Ocultar transcrição' : '+ Inserir transcrição / áudio'}
              </button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Ex: tiktok.com/@usuario/video/... ou @usuario"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Fallback de Transcrição / Legenda Manual */}
          {showTranscriptInput && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-medium text-slate-300 block">
                Transcrição do áudio, narração ou texto sobreposto:
              </span>
              <textarea
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder="Cole aqui a transcrição ou o que é dito no vídeo para verificação factual direta com IA..."
                rows={3}
                className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-[11px] text-slate-400 leading-relaxed">
            <strong>Critério Metodológico:</strong> Devido a diretrizes oficiais de privacidade e limitações de APIs públicas de terceiros, vídeos sem autorização direta são investigados através de metadados fornecidos e checagem factual cruzada.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-semibold text-white shadow-md transition-colors"
            >
              <span>Iniciar Análise</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Casos Rápidos de Demonstração */}
        <div className="border-t border-slate-800 bg-slate-950/60 p-5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Ou selecione um caso de demonstração no TikTok:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                onSelectDemoScenario('saude_vital');
                onClose();
              }}
              className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-colors"
            >
              <span className="font-semibold text-slate-200 block truncate">Saúde Vital</span>
              <span className="text-[10px] text-slate-400 block truncate">Cura em 48h sem remédios</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectDemoScenario('tech_investimentos');
                onClose();
              }}
              className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-colors"
            >
              <span className="font-semibold text-slate-200 block truncate">Tech Investimentos</span>
              <span className="text-[10px] text-slate-400 block truncate">Robô de Pix diário</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectDemoScenario('dra_mariana');
                onClose();
              }}
              className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-colors"
            >
              <span className="font-semibold text-slate-200 block truncate">Dra. Mariana</span>
              <span className="text-[10px] text-slate-400 block truncate">Nutrição científica / USP</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectDemoScenario('noticias_urgente');
                onClose();
              }}
              className="p-2.5 text-left rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 transition-colors"
            >
              <span className="font-semibold text-slate-200 block truncate">Plantão Brasil</span>
              <span className="text-[10px] text-slate-400 block truncate">Cortes sensacionalistas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
