/**
 * Fato ou Farsa - Modal de Diretrizes Oficiais de Denúncia
 * Seção 15: "Como denunciar este conteúdo"
 * Encaminha para canais oficiais da Meta/Instagram sem automatização ou assédio.
 */

import React from 'react';
import { X, ShieldAlert, ExternalLink, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

interface ReportingGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const ReportingGuidanceModal: React.FC<ReportingGuidanceModalProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-rose-500/30 bg-slate-900 shadow-2xl shadow-rose-950/40 overflow-hidden text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-950/50 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans">
                Como denunciar este conteúdo
              </h2>
              <p className="text-xs text-slate-400">
                Diretrizes oficiais e canais legítimos do Instagram / Meta
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

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alerta de Conduta Ética Inegociável */}
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4 space-y-2 text-xs text-rose-200">
            <div className="flex items-center gap-2 font-semibold">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>Aviso Ético & Legal Importante</span>
            </div>
            <p className="leading-relaxed text-[11px] text-rose-300/90">
              O <strong>Fato ou Farsa nunca submete denúncias automaticamente</strong> nem estimula
              campanhas de denúncias coordenadas ou assédio moral. Toda denúncia deve refletir o
              julgamento individual e consciente do cidadão através dos canais homologados.
            </p>
          </div>

          {/* Passo a Passo no Aplicativo do Instagram */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
              Passo a Passo Oficial no Aplicativo do Instagram
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">1.</span>
                <span>
                  No aplicativo móvel, acesse a publicação suspeita ou o perfil{' '}
                  <strong className="text-slate-100">@{username}</strong>.
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">2.</span>
                <span>
                  Toque no ícone de três pontos (<strong className="text-slate-100">•••</strong>)
                  no canto superior direito do post ou perfil.
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">3.</span>
                <span>
                  Selecione a opção <strong className="text-rose-400">"Denunciar"</strong>.
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/60">
                <span className="font-mono text-cyan-400 font-bold shrink-0">4.</span>
                <span>
                  Escolha a categoria mais condizente com a infração identificada:
                  <ul className="mt-1.5 space-y-1 text-[11px] text-slate-400 pl-4 list-disc">
                    <li>
                      <strong className="text-slate-200">"Informações falsas"</strong> → Selecione
                      Saúde, Política ou Finanças.
                    </li>
                    <li>
                      <strong className="text-slate-200">"Golpe ou fraude"</strong> → Para promessas
                      de retorno financeiro indevido ou robôs ilegais de Pix.
                    </li>
                    <li>
                      <strong className="text-slate-200">"Venda de produtos ilegais ou regulamentados"</strong>{' '}
                      → Para substâncias sem registro sanitário na ANVISA.
                    </li>
                  </ul>
                </span>
              </div>
            </div>
          </div>

          {/* Links para Recursos Oficiais Verificados da Meta */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 font-mono uppercase tracking-wider">
              Recursos e Formulários Oficiais Auditados
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href="https://help.instagram.com/contact/383679321740945"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-semibold block text-slate-200">
                    Central de Denúncias e Suporte da Meta
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Formulário direto de contato para violações de termos de serviço
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-cyan-400" />
              </a>

              <a
                href="https://help.instagram.com/519522125107875"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors"
              >
                <div>
                  <span className="font-semibold block text-slate-200">
                    Diretrizes da Comunidade do Instagram
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Normas detalhadas sobre spam, desinformação e segurança pública
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end border-t border-slate-800 bg-slate-950/80 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
