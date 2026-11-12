import express from 'express';
import path from 'path';
import http from 'http';
import dotenv from 'dotenv';
import { spawn, spawnSync } from 'child_process';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const PYTHON_PORT = process.env.PYTHON_BACKEND_PORT || 5001;

// Inicia o backend Python Django se não estiver rodando e se Django estiver instalado
let pythonProc: any = null;
const startPythonBackend = () => {
  const req = http.get(`http://127.0.0.1:${PYTHON_PORT}/healthz`, (res) => {
    console.log(`[Full-Stack] Backend Python Django detectado e ativo na porta ${PYTHON_PORT} (HTTP ${res.statusCode}).`);
  });
  req.on('error', () => {
    try {
      const check = spawnSync('python3', ['-c', 'import django'], { timeout: 2000 });
      if (check.status !== 0) {
        console.log('[Full-Stack] Django não instalado no ambiente (Web/Node). Gateway Node.js ativo atendendo /api/* com 100% de paridade.');
        return;
      }
    } catch {
      return;
    }

    console.log(`[Full-Stack] Iniciando backend Python Django na porta ${PYTHON_PORT}...`);
    pythonProc = spawn('python3', ['manage.py', 'runserver', `127.0.0.1:${PYTHON_PORT}`, '--noreload'], {
      stdio: 'pipe',
      env: { ...process.env, PYTHON_BACKEND_PORT: String(PYTHON_PORT) },
    });
    pythonProc.on('error', (err: any) => {
      console.log('[Full-Stack] Nota: Python Django indisponível, gateway Node ativo:', err.message);
    });
  });
};

startPythonBackend();

import { dispatchApiRoute } from './server/apiRouter.ts';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Encaminhamento de /api/* para o backend Python Django com fallback resiliente para dispatchApiRoute
app.all('/api/*', (req, res) => {
  const urlObj = new URL(req.originalUrl, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const query: Record<string, string> = {};
  urlObj.searchParams.forEach((v, k) => {
    query[k] = v;
  });

  const handleInternal = async () => {
    try {
      const result = await dispatchApiRoute(pathname, req.method, req.body, query);
      res.status(result.status).json(result.data);
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Erro no gateway' });
    }
  };

  const bodyData = req.body ? JSON.stringify(req.body) : '';

  const options: http.RequestOptions = {
    hostname: '127.0.0.1',
    port: PYTHON_PORT,
    path: req.originalUrl,
    method: req.method,
    headers: {
      ...req.headers,
      host: `127.0.0.1:${PYTHON_PORT}`,
      'content-length': String(Buffer.byteLength(bodyData)),
    },
    timeout: 4000,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    if (proxyRes.statusCode === 404) {
      handleInternal();
      return;
    }
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    handleInternal();
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    handleInternal();
  });

  if (bodyData) {
    proxyReq.write(bodyData);
  }
  proxyReq.end();
});

// Servir arquivos estáticos da pasta public e da build do Vite
const distPath = path.resolve(process.cwd(), 'dist');
const publicPath = path.resolve(process.cwd(), 'public');

// Endpoints explícitos de verificação do TikTok for Developers (URL Prefix / Site Verification)
const TIKTOK_TERMS_VERIFICATION_CONTENT = 'tiktok-developers-site-verification=lvFvYxrZ5bGEB7EajcbCN2zJ4L4a82D7';
const TIKTOK_PRIVACY_VERIFICATION_CONTENT = 'tiktok-developers-site-verification=ZfEi1aZfdFYmDRv9B6lTL27s84k5onH4';

// Middleware prioritário: atende qualquer requisição para os arquivos de verificação do TikTok
app.use((req, res, next) => {
  // 1. Verificação aprovada de Termos de Uso (Terms of Service)
  if (req.path.includes('tiktoklvFvYxrZ5bGEB7EajcbCN2zJ4L4a82D7')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(TIKTOK_TERMS_VERIFICATION_CONTENT);
  }

  // 2. Nova verificação de Política de Privacidade (Privacy Policy)
  if (req.path.includes('tiktokZfEi1aZfdFYmDRv9B6lTL27s84k5onH4')) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(200).send(TIKTOK_PRIVACY_VERIFICATION_CONTENT);
  }

  next();
});

app.use(express.static(distPath));
app.use(express.static(publicPath));

// SPA fallback - preserva rotas como /terms, /terms/, /privacy, /privacy/
app.get('*', (req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      // Fallback para desenvolvimento caso dist ainda não exista
      res.sendFile(path.resolve(process.cwd(), 'index.html'));
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor Fato ou Farsa operando na porta ${port} (Proxy -> Flask :${PYTHON_PORT})`);
});
