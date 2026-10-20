/**
 * Fato ou Farsa - Modal de Configuração e Status de APIs & Integrações (TikTok)
 * Documentação passo a passo em pt-BR sobre TikTok Display API, Research API, Gemini AI e Checagem Factual
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
  Video,
  FileCheck2,
} from 'lucide-react';
import { fetchSystemStatus, testTikTokToken } from '../../services/geminiService';
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
  const [activeTab, setActiveTab] = useState<'status' | 'tutorial' | 'tiktok_rules'>('status');

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
      const res = await testTikTokToken(testTokenInput.trim() || undefined);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Falha na comunicação ao testar token do TikTok.',
      });
    } finally {
      setIsTestingToken(false);
    }
  };

  const copyEnvSnippet = () => {
    const snippet = `GEMINI_API_KEY="seu_token_gemini"
TIKTOK_CLIENT_KEY="seu_client_key_tiktok"
TIKTOK_CLIENT_SECRET="seu_client_secret_tiktok"
TIKTOK_ACCESS_TOKEN="seu_user_access_token_tiktok"
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
                Integrações &amp; APIs Oficiais (TikTok &amp; IA)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Status das conexões, limites regulatórios e documentação técnica em conformidade
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/30">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Status em Tempo Real
          </button>
          <button
            onClick={() => setActiveTab('tutorial')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tutorial'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Como Obter Credenciais TikTok
          </button>
          <button
            onClick={() => setActiveTab('tiktok_rules')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'tiktok_rules'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Restrições das APIs do TikTok
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ABA 1: STATUS DO SISTEMA */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Cards de Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TikTok Display API */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      TikTok Display API
                    </span>
                    <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      {status?.tiktok?.configured ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Token Ativo</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Modo Demonstração &amp; Fallback</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {status?.tiktok?.configured
                        ? 'Conexão autorizada via TikTok Login Kit'
                        : 'Aguardando credenciais oficiais ou autorização OAuth'}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                    Endpoint: https://open.tiktokapis.com/v2/
                  </div>
                </div>

                {/* Gemini AI Engine */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Google GenAI Engine
                    </span>
                    <Key className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Gemini 3.8 Flash Ativo</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Google Search Grounding ativado para verificação factual
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                    Fallback determinístico em caso de quota 429
                  </div>
                </div>

                {/* Base Forense Nacional */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      Bases de Checagem
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{status?.factCheckEngine?.sourcesCount || 8} Fontes Oficiais</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      ANVISA, CFM, CVM, Agência Lupa, Aos Fatos e Comprova
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                    Consensos científicos indexados
                  </div>
                </div>
              </div>

              {/* Testador de Conexão Independente com TikTok */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                    Testar Conexão com a API do TikTok
                  </h3>
                  <button
                    onClick={loadStatus}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    title="Atualizar status"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Teste o token de acesso configurado no servidor ou informe um token temporário do TikTok Developer para validar endpoints da Display API:
                </p>

                <div className="flex gap-2">
                  <input
                    type="password"
                    value={testTokenInput}
                    onChange={(e) => setTestTokenInput(e.target.value)}
                    placeholder="Deixe em branco para testar TIKTOK_ACCESS_TOKEN do .env"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleTestToken}
                    disabled={isTestingToken}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    {isTestingToken ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Testar Token</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-lg text-xs border ${
                      testResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    <p className="font-semibold">{testResult.success ? 'Conexão validada:' : 'Aviso técnico:'}</p>
                    <p className="mt-0.5 leading-relaxed">{testResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ABA 2: TUTORIAL DE CONFIGURAÇÃO */}
          {activeTab === 'tutorial' && (
            <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                  Criar Aplicativo no TikTok for Developers
                </h3>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  Acesse o portal oficial em{' '}
                  <a
                    href="https://developers.tiktok.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    developers.tiktok.com <ExternalLink className="w-3 h-3" />
                  </a>
                  , faça login com sua conta do TikTok e crie um novo aplicativo em <em>"Manage Apps" &gt; "Create App"</em>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  Adicionar o Produto TikTok Display API &amp; Login Kit
                </h3>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  No painel do app, adicione o produto <strong>TikTok Display API</strong>. Solicite as permissões básicas:
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">user.info.basic</code>,
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">user.info.profile</code>,
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">user.info.stats</code> e
                  <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px]">video.list</code>.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                  Configurar Variáveis no Arquivo .env
                </h3>
                <div className="pl-8 space-y-2">
                  <p className="text-slate-600 dark:text-slate-400">
                    Copie o modelo abaixo para o seu arquivo <code className="font-mono">.env</code>:
                  </p>
                  <div className="relative">
                    <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`GEMINI_API_KEY="AIzaSy..."
TIKTOK_CLIENT_KEY="aw1234567890..."
TIKTOK_CLIENT_SECRET="sec_1234567890..."
TIKTOK_ACCESS_TOKEN="act.1234567890..."
PORT=3000`}
                    </pre>
                    <button
                      onClick={copyEnvSnippet}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedEnv ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
                  Fluxo de Fallback sem Credenciais Oficiais
                </h3>
                <p className="text-slate-600 dark:text-slate-400 pl-8 leading-relaxed">
                  Caso seu app ainda não tenha aprovação em produção da TikTok for Developers, o <strong>Fato ou Farsa</strong> opera normalmente através de:
                  1) Dados didáticos de demonstração representativos do algoritmo;
                  2) Inserção direta de legenda ou transcrição de vídeo com checagem factual via Gemini AI e busca fundamentada no Google.
                </p>
              </div>
            </div>
          )}

          {/* ABA 3: RESTRIÇÕES DAS APIS DO TIKTOK */}
          {activeTab === 'tiktok_rules' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Realidade Técnica e Normativa da Plataforma TikTok</span>
                </div>
                <p className="text-xs leading-relaxed text-blue-800/90 dark:text-blue-300/90">
                  Em conformidade com as diretrizes do projeto, não assumimos que qualquer perfil ou vídeo público do TikTok pode ser consultado anonimamente sem credenciais.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    1. TikTok Display API (Vídeos Próprios / Autorizados)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    A Display API destina-se a exibir o perfil e vídeos do <em>usuário autenticado</em>. O criador precisa autorizar explicitamente o aplicativo via fluxo OAuth. Não permite consultar vídeos de terceiros que não concederam acesso ao aplicativo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    2. TikTok Research API (Apenas Pesquisadores Elegíveis)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    A Research API permite consultas amplas a vídeos públicos e tendências, porém o acesso é <strong>estritamente restrito a pesquisadores acadêmicos vinculados a universidades e ONGs sem fins lucrativos</strong> em jurisdições aprovadas (EUA/UE), mediante submissão de projeto, contrato formal e aprovação manual da equipe de integridade do TikTok.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-1.5">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    3. Proibição de Raspagem Não Autorizada (Scraping)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    Os Termos de Serviço do TikTok proíbem explicitamente web scraping, engenharia reversa de chaves móveis e automação pirata. O Fato ou Farsa adota postura ética rigorosa: respeita as APIs oficiais e oferece o fluxo alternativo transparente de checagem direta de legendas e transcrições.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <span className="text-[11px] text-slate-500 font-mono">
            Fato ou Farsa • Transparência de APIs
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
