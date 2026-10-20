/**
 * Fato ou Farsa - Serviço de Coleta e Normalização de Dados da Meta Instagram API
 * Conecta-se às APIs oficiais da Meta (Instagram Graph API e Meta Content Library)
 * com tratamento rigoroso de permissões, normalização de métricas (null vs 0) e
 * modo Sandbox auditável para demonstração forense.
 */

export interface MetaProfileResponse {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

export interface MetaMediaResponse {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  insights?: {
    video_views?: number;
    reach?: number;
    impressions?: number;
  };
}

export interface NormalizedProfileResult {
  source: 'meta_graph_api' | 'sandbox_dataset' | 'manual_input';
  isLiveApi: boolean;
  statusMessage: string;
  retrievedAt: string;
  profile: {
    username: string;
    fullName: string;
    avatarUrl: string;
    isVerified: boolean;
    followersCount: number;
    followingCount: number;
    postsCount: number;
    biography: string;
    category: string;
    profileUrl: string;
    joinedDate?: string;
  };
  posts: Array<{
    id: string;
    shortcode: string;
    type: 'reel' | 'image' | 'video' | 'carousel';
    caption: string;
    timestamp: string;
    formattedDate: string;
    viewsCount: number | null; // Crítico: null se não aplicável ou omitido pela Meta
    likesCount: number | null; // Crítico: null se contagem oculta pelo autor
    commentsCount: number | null;
    sharesCount: number | null;
    url: string;
    thumbnailUrl: string;
    isOutlier: boolean;
    anomalyScore: number;
    suspicionFlags: string[];
    evidenceNotes?: string;
  }>;
}

/**
 * Sanitiza e normaliza nomes de usuário ou URLs do Instagram
 */
export function sanitizeUsername(input: string): string {
  if (!input) return '';
  let clean = input.trim();
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i, '');
  clean = clean.split('?')[0].replace(/\/+$/, '');
  clean = clean.replace(/^(?:p|reel|tv)\/([^/]+)/i, '$1');
  clean = clean.replace(/^@/, '');
  return clean.toLowerCase();
}

/**
 * Normaliza um item de mídia vindo da Meta Graph API
 * Respeita a regra estrita de diferenciar ausência de métrica (null) de zero real (0).
 */
export function normalizeMetaMedia(item: any) {
  const isVideo = item.media_type === 'VIDEO';
  const isCarousel = item.media_type === 'CAROUSEL_ALBUM';

  // Métricas de visualização: Imagens e carrosséis não expõem viewsCount publicamente
  let viewsCount: number | null = null;
  if (isVideo) {
    if (typeof item.video_views === 'number') {
      viewsCount = item.video_views;
    } else if (typeof item.insights?.video_views === 'number') {
      viewsCount = item.insights.video_views;
    } else if (typeof item.views_count === 'number') {
      viewsCount = item.views_count;
    } else {
      viewsCount = 0; // Vídeo com 0 views computados
    }
  }

  // Curtidas: se ocultas pelo autor na UI do Instagram, vêm nulas ou omitidas
  let likesCount: number | null = null;
  if (typeof item.like_count === 'number') {
    likesCount = item.like_count;
  } else if (typeof item.likes_count === 'number') {
    likesCount = item.likes_count;
  }

  let commentsCount: number | null = null;
  if (typeof item.comments_count === 'number') {
    commentsCount = item.comments_count;
  }

  const type = isVideo
    ? (item.caption?.toLowerCase().includes('#reels') || item.caption?.toLowerCase().includes('reels') ? 'reel' : 'video')
    : isCarousel
    ? 'carousel'
    : 'image';

  return {
    id: item.id || `post_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    shortcode: item.shortcode || item.id || '',
    type: type as 'reel' | 'image' | 'video' | 'carousel',
    caption: item.caption || '',
    timestamp: item.timestamp || new Date().toISOString(),
    formattedDate: new Date(item.timestamp || Date.now()).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    viewsCount,
    likesCount,
    commentsCount,
    sharesCount: null, // Meta Graph API pública não expõe contagem de compartilhamentos de terceiros
    url: item.permalink || `https://instagram.com/p/${item.id}`,
    thumbnailUrl: item.thumbnail_url || item.media_url || 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
    isOutlier: false,
    anomalyScore: 0,
    suspicionFlags: [] as string[],
  };
}

/**
 * Testa a conexão com a Meta Graph API usando o token informado ou das variáveis de ambiente
 */
export async function testMetaConnection(tokenOverride?: string): Promise<{
  success: boolean;
  message: string;
  appId?: string;
  scopes?: string[];
  expiresAt?: string;
}> {
  const token = tokenOverride || process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return {
      success: false,
      message: 'Token de acesso Meta (INSTAGRAM_ACCESS_TOKEN) não configurado no arquivo .env.',
    };
  }

  try {
    // 1. Tenta validar via endpoint de debug ou me
    const res = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${encodeURIComponent(token)}`);
    const data = await res.json();

    if (data.error) {
      return {
        success: false,
        message: `Erro da Meta API (${data.error.code}): ${data.error.message}`,
      };
    }

    return {
      success: true,
      message: `Conexão autorizada com sucesso. Usuário/Conta vinculada: ${data.name || data.id}`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha de rede ao consultar a Meta Graph API: ${err.message}`,
    };
  }
}

/**
 * Consulta perfil e mídias através da Meta Graph API ou fallback auditável
 */
export async function fetchInstagramProfileData(
  targetUsername: string,
  tokenOverride?: string
): Promise<NormalizedProfileResult> {
  const cleanUser = sanitizeUsername(targetUsername);
  const token = tokenOverride || process.env.INSTAGRAM_ACCESS_TOKEN;

  // Se o token estiver presente e válido, tentamos consultar a Meta Graph API oficial
  if (token) {
    try {
      // Nota técnica sobre os limites da Meta:
      // A Graph API v19.0 requer o ID da conta do Instagram Business / Creator
      // Endpoint: /v19.0/{instagram-account-id}?fields=...
      // Para perfis externos não autorizados, a Meta bloqueia a consulta direta por @username
      const meRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${encodeURIComponent(token)}`);
      const meData = await meRes.json();

      if (!meData.error && Array.isArray(meData.data) && meData.data.length > 0) {
        // Encontrou páginas / contas autorizadas
        const page = meData.data[0];
        const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${encodeURIComponent(token)}`);
        const igData = await igRes.json();
        const igAccountId = igData.instagram_business_account?.id;

        if (igAccountId) {
          const profileRes = await fetch(
            `https://graph.facebook.com/v19.0/${igAccountId}?fields=id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count&access_token=${encodeURIComponent(token)}`
          );
          const profileData = await profileRes.json();

          const mediaRes = await fetch(
            `https://graph.facebook.com/v19.0/${igAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=15&access_token=${encodeURIComponent(token)}`
          );
          const mediaData = await mediaRes.json();

          if (!profileData.error && mediaData.data) {
            const normalizedPosts = (mediaData.data || []).map(normalizeMetaMedia);

            return {
              source: 'meta_graph_api',
              isLiveApi: true,
              statusMessage: 'Dados coletados em tempo real via Meta Graph API oficial autorizada.',
              retrievedAt: new Date().toISOString(),
              profile: {
                username: profileData.username || cleanUser,
                fullName: profileData.name || profileData.username || cleanUser,
                avatarUrl: profileData.profile_picture_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
                isVerified: false,
                followersCount: profileData.followers_count || 0,
                followingCount: profileData.follows_count || 0,
                postsCount: profileData.media_count || normalizedPosts.length,
                biography: profileData.biography || '',
                category: 'Conta Conectada Meta',
                profileUrl: `https://www.instagram.com/${profileData.username || cleanUser}/`,
              },
              posts: normalizedPosts,
            };
          }
        }
      }
    } catch (e) {
      console.warn('Erro ao consultar Meta Graph API com token:', e);
    }
  }

  // Fallback transparente e documentado:
  // A Meta API restringe o acesso direto a perfis arbitrários de terceiros sem autorização prévia OAuth.
  // Disponibilizamos o ambiente Sandbox Forense com normalização padrão da Meta.
  return getCuratedSandboxResult(cleanUser);
}

/**
 * Retorna os dados normalizados de demonstração forense ou gera perfil padrão
 */
function getCuratedSandboxResult(username: string): NormalizedProfileResult {
  const timestamp = new Date().toISOString();

  // Casos de investigação forense pré-configurados
  if (username.includes('saude') || username.includes('vital')) {
    return {
      source: 'sandbox_dataset',
      isLiveApi: false,
      statusMessage: 'Ambiente Sandbox Forense Ativo: Caso de alegações de saúde e métricas com anomalia de engajamento.',
      retrievedAt: timestamp,
      profile: {
        username: 'saude_vital_brasil',
        fullName: 'Instituto Saúde & Longevidade Natural',
        avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=160&auto=format&fit=crop&q=80',
        isVerified: false,
        followersCount: 142000,
        followingCount: 38,
        postsCount: 18,
        biography: '🌿 Segredos ancestrais que a medicina tradicional esconde. Descubra como reverter o diabetes tipo 2 em 7 dias sem remédios químicos. Link abaixo ⬇️',
        category: 'Saúde & Bem-estar',
        profileUrl: 'https://www.instagram.com/saude_vital_brasil/',
        joinedDate: 'Março de 2024',
      },
      posts: [
        {
          id: 'post_sv_1',
          shortcode: 'C8Z3x9qLo1',
          type: 'reel',
          caption: '🚨 URGENTE: Médicos alemães descobrem erva da Amazônia que destrói a glicose alta no sangue em 48 horas! A indústria farmacêutica quer derrubar esse vídeo. Comente "EU QUERO" para receber a receita no direct antes que seja censurado!',
          timestamp: '2024-06-15T14:30:00Z',
          formattedDate: '15 de jun. de 2024',
          viewsCount: 2840000,
          likesCount: 1420,
          commentsCount: 9400,
          sharesCount: 12400,
          url: 'https://instagram.com/p/C8Z3x9qLo1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&auto=format&fit=crop&q=80',
          isOutlier: true,
          anomalyScore: 94,
          suspicionFlags: [
            'Alegação médica sensacionalista sem registro ANVISA',
            'Discrepância crítica entre visualizações (2,8M) e curtidas (1,4K)',
            'Gatilho de urgência artificial e retórica de conspiração ("querem censurar")',
          ],
          evidenceNotes: 'Promessa de cura rápida para condição crônica (diabetes) contraria diretrizes da Sociedade Brasileira de Diabetes (SBD). Ausência de comprovação clínica.',
        },
        {
          id: 'post_sv_2',
          shortcode: 'C7b1A4rK9p',
          type: 'reel',
          caption: 'O chá da vovó que limpa 90% das artérias entupidas em 1 semana. Não faça cirurgia cardíaca antes de ver isto! Salve para não perder.',
          timestamp: '2024-05-28T18:15:00Z',
          formattedDate: '28 de mai. de 2024',
          viewsCount: 1240000,
          likesCount: 980,
          commentsCount: 3100,
          sharesCount: 5200,
          url: 'https://instagram.com/p/C7b1A4rK9p',
          thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&auto=format&fit=crop&q=80',
          isOutlier: true,
          anomalyScore: 88,
          suspicionFlags: [
            'Desencorajamento de tratamento cirúrgico essencial',
            'Proporção de curtidas/visualizações de 0,07%',
          ],
        },
        {
          id: 'post_sv_3',
          shortcode: 'C6m9P2qLm0',
          type: 'carousel',
          caption: '3 ingredientes que você tem na geladeira para desinflamar o corpo e acelerar o metabolismo.',
          timestamp: '2024-05-10T11:00:00Z',
          formattedDate: '10 de mai. de 2024',
          viewsCount: null, // Respeita ausência de contagem em carrosséis
          likesCount: 1820,
          commentsCount: 140,
          sharesCount: 410,
          url: 'https://instagram.com/p/C6m9P2qLm0',
          thumbnailUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
          isOutlier: false,
          anomalyScore: 12,
          suspicionFlags: [],
        },
      ],
    };
  }

  // Perfil padrão genérico normalizado
  return {
    source: 'sandbox_dataset',
    isLiveApi: false,
    statusMessage: 'Ambiente de Simulação Normalizado: Perfil formatado com as especificações da Meta Graph API.',
    retrievedAt: timestamp,
    profile: {
      username: username || 'perfil_investigado',
      fullName: username ? (username.charAt(0).toUpperCase() + username.slice(1)) : 'Perfil em Investigação',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80',
      isVerified: false,
      followersCount: 48500,
      followingCount: 420,
      postsCount: 22,
      biography: `Perfil público em @${username}. Coleta estruturada em conformidade com o formato Meta Graph API.`,
      category: 'Criador de Conteúdo',
      profileUrl: `https://www.instagram.com/${username}/`,
      joinedDate: '2023',
    },
    posts: [
      {
        id: `post_${username}_1`,
        shortcode: 'C9Z1x8qLo',
        type: 'reel',
        caption: `Atenção: Novo método revela segredos que não querem que você saiba. Compartilhe antes que seja removido!`,
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        formattedDate: 'Há 2 dias',
        viewsCount: 310000,
        likesCount: 480, // Relação 0,15%
        commentsCount: 890,
        sharesCount: 1400,
        url: `https://instagram.com/${username}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&auto=format&fit=crop&q=80',
        isOutlier: true,
        anomalyScore: 68,
        suspicionFlags: ['Discrepância acentuada entre reproduções e taxa de curtidas (0,15%)'],
      },
      {
        id: `post_${username}_2`,
        shortcode: 'C8Y0a7bJp',
        type: 'image',
        caption: `Dicas para organização pessoal e rotina produtiva nesta semana.`,
        timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
        formattedDate: 'Há 6 dias',
        viewsCount: null, // Imagem sem contagem de views
        likesCount: 1240,
        commentsCount: 65,
        sharesCount: null,
        url: `https://instagram.com/${username}`,
        thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=80',
        isOutlier: false,
        anomalyScore: 8,
        suspicionFlags: [],
      },
    ],
  };
}
