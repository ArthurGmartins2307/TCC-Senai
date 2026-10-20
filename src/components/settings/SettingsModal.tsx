/**
 * Fato ou Farsa - Modal de Configurações Funcionais
 * Conforme Seção 10: Apenas opções genuinamente úteis (Tema, Movimento reduzido, Privacidade e Limpeza)
 */

import React from 'react';
import { X, Sun, Moon, Monitor, Trash2, Shield, RotateCcw } from 'lucide-react';
import { ThemeConfig } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onThemeConfigChange: (config: ThemeConfig) => void;
  onClearHistory: () => void;
  historyCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onThemeConfigChange,
  onClearHistory,
  historyCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 px-5 py-4">
          <h3 className="text-sm font-bold font-sans">Configurações da aplicação</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 space-y-5 text-xs">
          {/* 1. Tema da Interface */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              Tema visual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'light', label: 'Claro', icon: Sun },
                { id: 'dark', label: 'Escuro', icon: Moon },
                { id: 'auto', label: 'Sistema', icon: Monitor },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = themeConfig.mode === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() =>
                      onThemeConfigChange({
                        ...themeConfig,
                        mode: t.id as any,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 font-medium transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#003876] dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-[#003876] dark:text-blue-300 font-semibold'
                        : 'border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Acessibilidade / Movimento Reduzido */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Reduzir animações
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Respeita preferências de sensibilidade a movimento
              </span>
            </div>
            <input
              type="checkbox"
              checked={themeConfig.reducedMotion}
              onChange={(e) =>
                onThemeConfigChange({
                  ...themeConfig,
                  reducedMotion: e.target.checked,
                })
              }
              className="h-4 w-4 accent-[#003876] dark:accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* 3. Privacidade e Histórico Local */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Histórico local de análises
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {historyCount} registro(s) armazenado(s) neste navegador
                </span>
              </div>
              {historyCount > 0 && (
                <button
                  onClick={() => {
                    onClearHistory();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          {/* 4. Conformidade Legal */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-150 dark:border-slate-800 pt-3">
            O <strong>Fato ou Farsa</strong> opera exclusivamente com dados públicos sob o Art. 7º
            da Lei Geral de Proteção de Dados (LGPD). Nenhuma credencial ou dado privado é coletado.
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#003876] dark:bg-blue-600 hover:bg-[#002D62] text-white px-4 py-1.5 text-xs font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
