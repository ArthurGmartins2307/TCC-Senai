/**
 * Fato ou Farsa - Modal de Verificação Direta de Conteúdo / Legenda / Vídeo do TikTok
 * Permite colar qualquer link, legenda, transcrição de vídeo ou afirmação para checagem imediata
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
  Video,
} from 'lucide-react';
import { FactCheckModal } from './FactCheckModal';

interface DirectFactCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DirectFactCheckModal({ isOpen, onClose }: DirectFactCheckModalProps) {
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState<'Saúde' | 'Finanças' | 'Notícias' | 'Ciência' | 'Geral'>('Saúde');
  const [showResultModal, setShowResultModal] = useState(false);

  const sampleCases = [
    {
      title: 'Diabetes em 48h (Saúde no TikTok)',
      text: 'Erva da Amazônia destrói a glicose alta no sangue em 48 horas e cura o diabetes tipo 2. A indústria farmacêutica quer censurar esse vídeo do TikTok. Comente eu quero!',
      cat: 'Saúde' as const,
    },
    {
      title: 'Robô do Pix / Lucro Diário (Finanças)',
      text: 'Novo algoritmo de inteligência artificial gera de R$ 500 a R$ 2.000 por dia no piloto automático. Saque imediato pelo celular no link da bio.',
      cat: 'Finanças' as const,
    },
    {
      title: 'Chá para Artérias (Saúde)',
      text: 'Chá caseiro da vovó limpa 90% das artérias entupidas em uma semana e dispensa cateterismo ou cirurgia cardíaca. Salve este vídeo!',
      cat: 'Saúde' as const,
    },
    {
      title: 'Boato de Confinamento (Notícias)',
      text: 'Governo decreta confinamento nacional a partir de amanhã e bloqueio de contas poupança. Veja o pronunciamento urgente antes que apaguem!',
      cat: 'Notícias' as const,
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
                  Checar Alegação de Vídeo do TikTok
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cole uma legenda de vídeo do TikTok, transcrição de áudio ou afirmação para checagem imediata
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
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Saúde'
                      ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  Saúde & Remédios
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Finanças')}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Finanças'
                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-amber-500" />
                  Finanças & Cripto
                </button>
                <button
                  type="button"
                  onClick={() => setTopic('Notícias')}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    topic === 'Notícias'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <Globe className="w-4 h-4 text-blue-500" />
                  Notícias & Política
                </button>
              </div>
            </div>

            {/* Input de texto */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Texto da Legenda ou Transcrição do TikTok
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Exemplo: 'Médicos alemães confirmam que essa erva cura o diabetes em 48 horas...' ou cole a legenda completa do vídeo."
                rows={4}
                className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
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
          isOpen={showResultModal}
          onClose={() => {
            setShowResultModal(false);
            onClose();
          }}
          postText={inputText}
          topic={topic}
        />
      )}
    </>
  );
}
