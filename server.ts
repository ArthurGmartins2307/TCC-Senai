import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { dispatchApiRoute } from './server/apiRouter';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Roteador de APIs Fato ou Farsa
app.all('/api/*', async (req, res) => {
  try {
    const query = req.query as Record<string, string>;
    const response = await dispatchApiRoute(req.path, req.method, req.body, query);
    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Erro na API:', err);
    res.status(500).json({ error: err.message || 'Erro interno no servidor de auditoria.' });
  }
});

// Arquivos estáticos da build do Vite
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor Fato ou Farsa operando na porta ${port}`);
});
