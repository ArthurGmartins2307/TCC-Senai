/**
 * Fato ou Farsa - Página de Política de Privacidade (/privacy)
 * Em estrita conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018),
 * Marco Civil da Internet (Lei nº 12.965/2014) e Diretrizes para Desenvolvedores do TikTok (TikTok for Developers).
 */

import React from 'react';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Server,
  Trash2,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  FileKey,
  Cpu,
} from 'lucide-react';

interface PrivacyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Botão de retorno e Navegação */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a página inicial</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Última atualização: 10 de novembro de 2026
        </span>
      </div>

      {/* Cabeçalho da Página */}
      <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Privacidade &amp; Proteção de Dados (LGPD)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Política de Privacidade
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          A sua privacidade e a transparência no tratamento de dados digitais são pilares fundamentais do <strong>Fato ou Farsa</strong>. Esta Política descreve de forma clara, objetiva e transparente como os dados públicos do TikTok e os conteúdos fornecidos por você são coletados, tratados, protegidos e excluídos.
        </p>
      </div>

      {/* Resumo de Compromissos Fundamentais */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Compromissos Fundamentais de Privacidade</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Zero Venda de Dados:</strong> Jamais comercializamos, alugamos ou compartilhamos dados pessoais com corretores de dados (*data brokers*) ou redes de publicidade.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Apenas Métricas Públicas:</strong> Não temos acesso a mensagens diretas, senhas, dados de pagamento ou informações privadas de contas do TikTok.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Histórico no Seu Dispositivo:</strong> O histórico de pesquisas fica armazenado exclusivamente no seu navegador (`localStorage`), sob seu controle total.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Desconexão a Qualquer Momento:</strong> O usuário pode revogar permissões de acesso do TikTok a qualquer instante através do aplicativo oficial.</span>
          </div>
        </div>
      </div>

      {/* Seções Detalhadas */}
      <div className="space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {/* Seção 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">1</span>
            Quais Dados Coletamos e Tratamos
          </h2>
          <p>
            O Fato ou Farsa opera sob o <strong>Princípio da Minimização de Dados (Art. 6º, III da LGPD)</strong>, tratando exclusivamente o que for estritamente necessário para cumprir sua finalidade de verificação de credibilidade:
          </p>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">A. Dados e Métricas Públicas do TikTok</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Quando uma URL de vídeo ou nome de usuário público é submetido, o sistema consulta via APIs oficiais do TikTok (Display API v2) os dados estritamente públicos autorizados:
              </p>
              <ul className="list-disc pl-5 text-xs text-slate-500 dark:text-slate-400 pt-1 space-y-0.5">
                <li>Nome público de exibição (*display name*) e identificador de usuário (`@username`);</li>
                <li>Foto de perfil pública e biografia disponibilizada pelo criador;</li>
                <li>Contadores agregados de engajamento: visualizações (*plays*), curtidas, comentários e compartilhamentos de vídeos públicos;</li>
                <li>Legendas e transcrições textuais associadas aos vídeos para análise semântica.</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">B. Dados Inseridos Voluntariamente pelo Usuário</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Textos, legendas, áudios transcritos ou alegações factuais que você digita ou cola manualmente nas caixas de verificação. Esses dados são processados pontualmente para retorno do relatório pericial.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">C. Preferências de Interface e Histórico Local</span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Suas preferências de tema (modo claro ou escuro) e o histórico cronológico de relatórios gerados são gravados **localmente no navegador do seu dispositivo** utilizando a tecnologia de `localStorage`. Nenhum identificador biométrico, cookie invasivo ou fingerprint de rastreamento é criado em nossos servidores.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">2</span>
            O Que NÃO Coletamos
          </h2>
          <p>Para assegurar a máxima tranquilidade aos usuários e criadores, declaramos categoricamente que o Fato ou Farsa <strong>NÃO</strong> coleta nem armazena:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Sem Dados Financeiros</span>
              <span className="text-slate-500 dark:text-slate-400">Não solicitamos dados bancários, cartões de crédito ou chaves Pix.</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Sem Conteúdo Privado</span>
              <span className="text-slate-500 dark:text-slate-400">Não lemos mensagens diretas (DMs), vídeos em modo privado ou rascunhos.</span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
              <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">Sem Senhas</span>
              <span className="text-slate-500 dark:text-slate-400">As autorizações utilizam o padrão OAuth oficial do TikTok. Nunca temos acesso à sua senha.</span>
            </div>
          </div>
        </section>

        {/* Seção 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">3</span>
            Serviços de Terceiros e Integrações Tecnológicas
          </h2>
          <p>Para realizar as checagens com rigor técnico, o Fato ou Farsa integra-se aos seguintes serviços especializados:</p>

          <div className="space-y-3 pt-1 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  TikTok Open API (TikTok for Developers)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                  API Oficial v2
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Utilizado para recuperar dados de perfis e vídeos autenticados sob permissão expressa do usuário (escopos `user.info.basic`, `user.info.profile`, `video.list`). O tratamento rege-se pelos <a href="https://www.tiktok.com/legal/privacy-policy-row" target="_blank" rel="noopener noreferrer" className="text-[#003876] dark:text-blue-400 underline">Termos e Política de Privacidade do TikTok</a>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                  Google Gemini AI (Google Cloud Platform)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
                  SDK @google/genai
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                As alegações textuais são submetidas de forma segura através do nosso backend para análise semântica e busca de evidências pelo modelo Gemini 3.8 Flash com pesquisa de fontes (Google Search Grounding). O tráfego corporativo de API não é utilizado para treinar modelos fundacionais públicos do Google, conforme os termos de serviço corporativo da Google Cloud.
              </p>
            </div>
          </div>
        </section>

        {/* Seção 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">4</span>
            Base Legal para o Tratamento (LGPD)
          </h2>
          <p>O tratamento de dados realizado pelo Fato ou Farsa apoia-se nas seguintes bases legais do Art. 7º da Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
          <ul className="list-disc pl-5 text-xs space-y-1.5">
            <li><strong>Art. 7º, I (Consentimento):</strong> Quando você autoriza explicitamente a conexão via conta TikTok ou insere textos para verificação;</li>
            <li><strong>Art. 7º, IV (Realização de Estudos por Órgão de Pesquisa / Pesquisa Científica):</strong> Finalidade primordial de pesquisa acadêmica, Trabalho de Conclusão de Curso (TCC) e desenvolvimento metodológico pericial;</li>
            <li><strong>Art. 7º, IX (Legítimo Interesse):</strong> Para combate à desinformação pública, promoção do debate democrático transparente e preservação probatória em ambientes digitais abertos;</li>
            <li><strong>Art. 7º, § 4º (Dados Manifestamente Públicos):</strong> Tratamento de informações disponibilizadas publicamente pelo titular no TikTok, resguardada a boa-fé e o interesse coletivo.</li>
          </ul>
        </section>

        {/* Seção 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">5</span>
            Seus Direitos como Titular de Dados
          </h2>
          <p>Em conformidade com o Art. 18 da LGPD, você tem direito a solicitar a qualquer momento:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
              <strong>• Confirmação e Acesso:</strong> Saber se tratamos dados relativos ao seu perfil público;
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
              <strong>• Correção e Atualização:</strong> Solicitar retificação de dados incorretos ou desatualizados;
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
              <strong>• Anonimização e Eliminação:</strong> Exigir a exclusão de relatórios associados ao seu identificador;
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
              <strong>• Revogação do Consentimento:</strong> Desconectar o aplicativo da sua conta a qualquer momento.
            </div>
          </div>
        </section>

        {/* Seção 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">6</span>
            Como Excluir Seus Dados e Desconectar o TikTok
          </h2>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              Você possui total autonomia para revogar o acesso do Fato ou Farsa através de duas vias simples:
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#003876] dark:text-blue-400">1. Pelo TikTok:</span>
                <span>Abra o app do TikTok &rarr; Perfil &rarr; Menu (3 barras) &rarr; Configurações e privacidade &rarr; Segurança e permissões &rarr; Apps e serviços autorizados &rarr; Selecione <strong>Fato ou Farsa</strong> &rarr; Toque em <strong>Remover acesso</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-[#003876] dark:text-blue-400">2. Nesta Aplicação:</span>
                <span>Acesse as configurações ou a gaveta de Histórico e clique em <strong>"Limpar Histórico"</strong> para purgar instantaneamente todo o histórico local gravado no seu navegador.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Seção 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#003876] text-white text-xs font-bold">7</span>
            Segurança da Informação e Criptografia
          </h2>
          <p>
            Adotamos medidas técnicas e administrativas aptas a proteger os dados contra acessos não autorizados ou destruição ilícita:
          </p>
          <ul className="list-disc pl-5 text-xs space-y-1">
            <li>Toda a comunicação transita obrigatoriamente por protocolo seguro com <strong>criptografia HTTPS (TLS 1.3)</strong>;</li>
            <li>Chaves de API e credenciais de servidor são mantidas sob segredo estrito em variáveis de ambiente protegidas em servidor seguro;</li>
            <li>Nenhuma credencial de API é exposta em código de front-end.</li>
          </ul>
        </section>

        {/* Seção 8: Contato e DPO */}
        <section className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-2">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <FileKey className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Encarregado pelo Tratamento de Dados (DPO / LGPD)</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Para exercer seus direitos de titular, solicitar esclarecimentos ou enviar requisições formais de privacidade, entre em contato diretamente com o responsável pela pesquisa:
          </p>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
            E-mail de Privacidade &amp; DPO: <span className="font-bold text-[#003876] dark:text-blue-400">privacidade@fatooufarsa.com.br</span>
            <br />
            Assunto obrigatório: [LGPD - Requisição de Titular de Dados]
          </div>
        </section>
      </div>

      {/* Rodapé Interno da Página Legal */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <button
          onClick={onNavigateHome}
          className="font-semibold text-[#003876] dark:text-blue-400 hover:underline cursor-pointer"
        >
          &larr; Retornar para a verificação de conteúdos
        </button>
        <div className="flex items-center gap-4">
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, '', '/terms');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:underline text-slate-700 dark:text-slate-300 font-medium"
          >
            Termos de Uso do Serviço
          </a>
        </div>
      </div>
    </div>
  );
};
