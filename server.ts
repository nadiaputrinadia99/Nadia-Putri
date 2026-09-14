import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' }));

  // In-memory cache & fallback storage for portfolio
  let portfolioDataCache: any = null;

  // PRD 9.1: Keep-alive cron endpoint for Supabase / Vercel Cron
  app.get('/api/cron/keepalive', async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    // If CRON_SECRET is configured, validate Authorization header
    if (cronSecret && cronSecret.trim() !== '') {
      const token = authHeader?.replace(/^Bearer\s+/i, '');
      if (token !== cronSecret) {
        return res.status(401).json({
          ok: false,
          error: 'Unauthorized: Invalid CRON_SECRET',
        });
      }
    }

    // Keepalive activity: simulate or ping Supabase if credentials are present
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    let supabaseStatus = 'not_configured';

    if (supabaseUrl) {
      try {
        const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
        // Lightweight SELECT query as described in PRD 9.1
        const response = await fetch(`${supabaseUrl}/rest/v1/projects?select=id&limit=1`, {
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
          },
        });
        supabaseStatus = response.ok ? 'connected' : `status_${response.status}`;
      } catch (err: any) {
        supabaseStatus = `error: ${err?.message || 'unknown'}`;
      }
    }

    return res.status(200).json({
      ok: true,
      timestamp: new Date().toISOString(),
      supabase: supabaseStatus,
      message: 'Keepalive heartbeat successful',
    });
  });

  // Server-side portfolio data sync endpoints
  app.get('/api/portfolio', (req, res) => {
    res.json({
      ok: true,
      data: portfolioDataCache,
    });
  });

  app.post('/api/portfolio', (req, res) => {
    const { data } = req.body;
    if (data) {
      portfolioDataCache = data;
      return res.json({ ok: true, message: 'Portfolio saved on server' });
    }
    return res.status(400).json({ ok: false, error: 'Data is required' });
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // SPA fallback: render index.html for all non-API GET routes (e.g. /admin, /admin/login)
    app.use('*', async (req, res, next) => {
      // Don't intercept API routes
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }

      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
