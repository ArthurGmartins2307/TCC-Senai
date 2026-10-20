/**
 * Fato ou Farsa - Modal de Configuração e Status de APIs & Integrações
 * Documentação passo a passo em pt-BR sobre Meta Graph API, Gemini e Search Grounding
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Server,
  Key,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  BookOpen,
} from 'lucide-react';
import { fetchSystemStatus, testMetaToken } from '../../services/geminiService';
import { SystemStatus } from '../../types';

interface ApiIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiIntegrationsModal({ isOpen, onClose }: ApiIntegrationsModalProps) {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingToken, setIsTestingToken] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'tutorial' | 'meta_rules'>('status');

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchSystemStatus();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTestToken = async () => {
    setIsTestingToken(true);
    setTestResult(null);
    try {
      const res = await testMetaToken(testTokenInput.trim() || undefined);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Falha na comunicação ao testar token.',
      });
    } finally {
      setIsTestingToken(false);
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `GEMINI_API_KEY="seu_token_gemini"
INSTAGRAM_ACCESS_TOKEN="seu_token_meta_graph_api"
INSTAGRAM_APP_ID="seu_app_id"
INSTAGRAM_APP_SECRET="seu_app_secret"
PORT=3000`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 id="api-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Integrações & APIs de Dados
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fontes legítimas de dados do Instagram, IA Gemini e Checagem Baseada em Evidências
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar modal de APIs"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-2 bg-slate-100/50 dark:bg-slate-800/20">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Status dos Serviços
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'tutorial'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Guia de Configuração Meta & Gemini
          </button>
          <button
            onClick={() => setActiveTab('meta_rules')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'meta_rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Limites da Meta API & Content Library
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Cards de status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Meta Instagram API */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Meta Instagram</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        status?.instagram?.configured
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                      }`}
                    >
                      {status?.instagram?.configured ? 'Conectado (Live)' : 'Modo Sandbox'}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Instagram Graph API v19.0</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {status?.instagram?.configured
                      ? 'Token da Meta configurado no ambiente.'
                      : 'Utilizando conjuntos auditáveis para teste e checagem direta.'}
                  </p>
                </div>

                {/* Gemini AI */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Google AI Studio</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                      gemini-3.8-flash
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Motor Forense com IA</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Extração de alegações factuais e inferência forense severa.
                  </p>
                </div>

                {/* Search Grounding */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Checagem de Fatos</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400">
                      Fontes Oficiais
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Base Forense Nacional</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    ANVISA, CFM, SBD, CVM, Agência Lupa e Aos Fatos ativas.
                  </p>
                </div>
              </div>

              {/* Testador de Token ao vivo */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Testar Token da Meta Graph API
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Insira um User Access Token ou deixe em branco para testar o token atualmente definido em{' '}
                  <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[11px]">.env</code>:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={testTokenInput}
                    onChange={(e) => setTestTokenInput(e.target.value)}
                    placeholder="EAA... (Token da Meta Graph API)"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={handleTestToken}
                    disabled={isTestingToken}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                  >
                    {isTestingToken ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    Testar Conexão
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 ${
                      testResult.success
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{testResult.success ? 'Conexão Bem-Sucedida' : 'Falha na Autenticação'}</p>
                      <p className="mt-0.5">{testResult.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tutorial' && (
            <div className="space-y-6 text-xs leading-relaxed">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Passo a Passo: Como Obter e Configurar as Credenciais Oficiais
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  Siga estas etapas para conectar sua conta profissional do Instagram ou acessar dados de auditoria através da Meta Graph API.
                </p>
              </div>

              {/* Etapa 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-[10px]">
                  Passo 1
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Criar um Aplicativo no Meta for Developers
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Acesse o portal oficial: <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">developers.facebook.com</a>.</li>
                  <li>Clique em <strong>Meus Aplicativos &gt; Criar Aplicativo</strong>.</li>
                  <li>Selecione o tipo <strong>"Outro"</strong> e escolha a finalidade <strong>"Empresa"</strong>.</li>
                  <li>No painel do app, adicione o produto <strong>Instagram Graph API</strong>.</li>
                </ol>
              </div>

              {/* Etapa 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-[10px]">
                  Passo 2
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Vincular a Conta Profissional do Instagram
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  A Meta exige que o perfil a ser consultado seja do tipo <strong>Criador de Conteúdo</strong> ou <strong>Comercial</strong> e esteja conectado a uma Página do Facebook.
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Permissões necessárias solicitadas no login: <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">instagram_basic</code>, <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">instagram_manage_insights</code> e <code className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">pages_show_list</code>.
                </p>
              </div>

              {/* Etapa 3 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-[10px]">
                  Passo 3
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Gerar Token de Longa Duração (60 Dias)
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  No <strong>Graph API Explorer</strong> da Meta, gere um User Token com as permissões acima. Em seguida, troque-o pelo Long-Lived Token através do endpoint de oauth da Meta.
                </p>
              </div>

              {/* Etapa 4 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded font-bold text-[10px]">
                    Passo 4
                  </span>
                  <button
                    onClick={copyEnvSnippet}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedEnv ? 'Copiado!' : 'Copiar Variáveis'}
                  </button>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Configurar o Arquivo .env no Servidor
                </h4>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto">
{`GEMINI_API_KEY="AIzaSy..."
INSTAGRAM_ACCESS_TOKEN="EAA..."
INSTAGRAM_APP_ID="123456789"
INSTAGRAM_APP_SECRET="abcdef..."
PORT=3000`}
                </pre>
                <p className="text-[11px] text-slate-500">
                  Segurança: Estas chaves nunca são enviadas ao navegador do usuário. Todas as chamadas para a Meta e Gemini acontecem exclusivamente no servidor backend.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'meta_rules' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Entendendo os Limites da Meta e a Meta Content Library
              </h3>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  Por que a Meta não permite raspar qualquer perfil público por @username?
                </h4>
                <p>
                  Desde as atualizações pós-Cambridge Analytica e a implementação da LGPD/GDPR, a Meta proíbe expressamente o web scraping não autorizado e bloqueia o acesso via API a perfis de terceiros que não tenham autorizado expressamente a aplicação.
                </p>
                <p>
                  Por essa razão, plataformas legítimas de auditoria utilizam:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Contas Conectadas via OAuth:</strong> perfis que autorizaram o acesso para auditoria de suas métricas e audiência.</li>
                  <li><strong>Meta Content Library API:</strong> acesso exclusivo concedido a pesquisadores acadêmicos credenciados via ICPSR.</li>
                  <li><strong>Checagem Direta de Conteúdo:</strong> análise semântica e fact-checking de publicações, capturas e transcrições coladas diretamente pelo auditor.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                  Meta Content Library &amp; API (Para Pesquisadores)
                </h4>
                <p>
                  A Meta disponibiliza uma biblioteca abrangente de conteúdos públicos para pesquisa de interesse público e combate à desinformação:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Elegibilidade:</strong> pesquisadores vinculados a instituições acadêmicas qualificadas.</li>
                  <li><strong>Inscrição:</strong> realizada através do consórcio ICPSR da Universidade de Michigan.</li>
                  <li><strong>Documentação:</strong> <a href="https://transparency.fb.com/research/content-library/" target="_blank" rel="noreferrer" className="text-blue-600 underline">transparency.fb.com/research/content-library</a></li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors"
          >
            Entendido e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
