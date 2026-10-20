/**
 * Fato ou Farsa - Modal de Verificação Direta de Conteúdo / Legenda / Post
 * Permite colar qualquer link, texto, transcrição de Reel ou afirmação para checagem imediata
 */

import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  FileText,
  TrendingUp,
  HeartPulse,
  DollarSign,
  Globe,
} from 'lucide-react';
import { FactCheckModal } from './FactCheckModal';

interface DirectFactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectFactCheckModal({ isOpen, onClose }: DirectFactCheckModalProps) {
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState<'Saúde' | 'Finanças' | 'Notícias' | 'Ciência' | 'Geral'>('Saúde');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const sampleCases = [
    {
      title: 'Diabetes em 48h (Saúde)',
      text: 'Erva da Amazônia destrói a glicose alta no sangue em 48 horas e cura o diabetes tipo 2. A indústria farmacêutica quer censurar esse vídeo.',
      cat: 'Saúde' as const,
    },
    {
      title: 'Robô com Lucro 100% (Finanças)',
      text: 'Novo algoritmo de inteligência artificial gera lucro garantido de 100% ao dia sem risco. Vagas limitadas no link da bio.',
      cat: 'Finanças' as const,
    },
    {
      title: 'Chá para Artérias (Saúde)',
      text: 'Chá caseiro da vovó limpa 90% das artérias do coração e dispensa cirurgia cardíaca ou remédios químicos.',
      cat: 'Saúde' as const,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setShowResultModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="direct-factcheck-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      >
        <div className="relative w-full max-w-xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h2 id="direct-factcheck-title" className="text-xl font-bold text-slate-900 dark:text-white">
                  Verificar Conteúdo ou Alegação
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cole uma legenda de Reel, transcrição de vídeo ou alegação para checagem imediata
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Categoria */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Área Temática
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTopic('Saúde')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Saúde'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Saúde / Remédios
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Finanças')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Finanças'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-800 dark:text-amber-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Finanças / PIX
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Notícias')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Notícias'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-800 dark:text-blue-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Notícias / Geral
                </button>
              </div>
            </div>

            {/* Texto */}
            <div>
              <label htmlFor="caption-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Texto da Publicação ou Afirmação
              </label>
              <textarea
                id="caption-input"
                rows={4}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Exemplo: '🚨 URGENTE: Erva da Amazônia que cura o diabetes tipo 2 em 48 horas sem remédios...'"
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>

            {/* Exemplos rápidos */}
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Exemplos de Conteúdos para Teste:
              </p>
              <div className="space-y-1.5">
                {sampleCases.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputText(s.text);
                      setTopic(s.cat);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span className="font-medium truncate">{s.title}: "{s.text.slice(0, 50)}..."</span>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold shrink-0 ml-2">Usar</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de envio */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Investigar Evidências com IA
              </button>
            </div>
          </form>
        </div>
      </div>

      {showResultModal && (
        <FactCheckModal
          post={null}
          customText={inputText}
          topic={topic}
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
