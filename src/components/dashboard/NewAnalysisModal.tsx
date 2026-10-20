/**
 * Fato ou Farsa - Modal de Entrada para Nova Análise de Perfil
 * Seção 10: Profile Input
 * Validação rigorosa e normalização de URLs e @usuários do Instagram.
 */

import React, { useState } from 'react';
import { X, Search, Instagram, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnalysis: (username: string) => void;
  onSelectDemoScenario: (demoId: string) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnalysis,
  onSelectDemoScenario,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmed = inputValue.trim();
    if (!trimmed) {
      setErrorMessage('Por favor, informe um nome de usuário ou link do Instagram.');
      return;
    }

    // Normalização: extrair usuário caso seja URL completa do Instagram
    let username = trimmed;
    try {
      if (trimmed.includes('instagram.com/')) {
        const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
        const parts = url.pathname.split('/').filter(Boolean);
        if (parts.length > 0 && parts[0] !== 'p' && parts[0] !== 'reel') {
          username = parts[0];
        } else {
          setErrorMessage('Informe o link do perfil principal, não de uma publicação isolada.');
          return;
        }
      }
    } catch {
      // Se não for URL válida, tenta tratar como username
    }

    // Remover arroba inicial se presente
    username = username.replace(/^@+/, '').replace(/\/$/, '').trim();

    // Validação de formato de usuário do Instagram (letras, números, pontos e underlines, até 30 chars)
    const validUsernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    if (!validUsernameRegex.test(username)) {
      setErrorMessage(
        'Nome de usuário inválido. Usuários do Instagram contêm apenas letras, números, pontos ou sublinhados (máximo de 30 caracteres).'
      );
      return;
    }

    onSubmitAnalysis(username);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl border border-cyan-800/40 bg-slate-900 shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100">
        {/* Cabeçalho Oficial Obrigatório */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/50 text-cyan-400">
              <Instagram className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 font-sans">
                Analisar perfil do Instagram
              </h2>
              <p className="text-xs text-slate-400">
                Informe um perfil para analisar as métricas disponíveis e investigar possíveis
                sinais de irregularidade.
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

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Usuário ou link do Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="@exemplo ou https://www.instagram.com/exemplo/"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                autoFocus
              />
            </div>
            {errorMessage && (
              <div className="flex items-center gap-2 text-xs text-rose-400 pt-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3.5 text-[11px] text-slate-400 leading-relaxed">
            <strong>Privacidade & Acesso:</strong> A plataforma consulta exclusivamente informações
            públicas legitimamente disponibilizadas. Um perfil inacessível ou privado{' '}
            <strong className="text-slate-200">nunca será rotulado como suspeito</strong>.
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-cyan-950 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4" />
            <span>Analisar perfil</span>
          </button>

          {/* Casos Fictícios Rápidos */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">
              Ou escolha um caso de demonstração preparado:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onSelectDemoScenario('saude_vital');
                  onClose();
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-left text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                <span className="font-semibold block truncate">Saúde Vital</span>
                <span className="text-[10px] text-slate-500">Alegações milagrosas</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectDemoScenario('tech_investimentos');
                  onClose();
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-left text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                <span className="font-semibold block truncate">Tech Invest</span>
                <span className="text-[10px] text-slate-500">Robô de Pix garantido</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectDemoScenario('dra_mariana');
                  onClose();
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-left text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                <span className="font-semibold block truncate">Dra. Mariana</span>
                <span className="text-[10px] text-slate-500">Perfil autêntico/USP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectDemoScenario('noticias_urgente');
                  onClose();
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-2 text-left text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
              >
                <span className="font-semibold block truncate">Giro Notícias</span>
                <span className="text-[10px] text-slate-500">Vídeos antigos reciclados</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
