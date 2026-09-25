import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { LiveServerMessage, Modality } from '@google/genai';
import { getAI } from './server/services/gemini';
import authRoutes from './server/routes/auth';
import requestsRoutes from './server/routes/requests';
import volunteersRoutes from './server/routes/volunteers';
import aiRoutes from './server/routes/ai';
import statsRoutes from './server/routes/stats';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', statsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CareConnect Full-Stack API',
    features: ['firebase-auth', 'gemini-3.8-live', 'maps-grounding', 'multi-turn-chat'],
    timestamp: new Date().toISOString()
  });
});

async function startServer() {
  const server = http.createServer(app);

  // Set up WebSocket server for Gemini Live API (gemini-3.8-live)
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = request.url ? new URL(request.url, `http://${request.headers.host}`).pathname : '';
    if (pathname === '/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Live API] Client connected to voice session');
    const ai = getAI();
    if (!ai) {
      clientWs.send(JSON.stringify({ error: 'Gemini API key is not configured on this server.' }));
      clientWs.close();
      return;
    }

    try {
      const session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are the CareConnect voice companion. Speak in a warm, calm, compassionate, and reassuring tone. Help the user with non-emergency healthcare navigation, hospital companion requests, appointment rides, and volunteer coordination. Gently remind them that you cannot diagnose diseases or provide emergency paramedic assistance.'
        },
        callbacks: {
          onmessage: (msg: LiveServerMessage) => {
            const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (msg.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.close();
            }
          }
        }
      });

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' }
            });
          } else if (parsed.text) {
            session.sendRealtimeInput({
              text: parsed.text
            });
          }
        } catch (e) {
          console.error('[Live API] Error parsing client message:', e);
        }
      });

      clientWs.on('close', () => {
        console.log('[Live API] Client disconnected from voice session');
        try {
          session.close();
        } catch (err) {}
      });
    } catch (err) {
      console.error('[Live API] Failed to connect to Gemini Live session:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ error: 'Failed to establish Live voice session.' }));
        clientWs.close();
      }
    }
  });

  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`CareConnect server running on http://localhost:${PORT}`);
    console.log(`WebSocket Live voice endpoint mounted at ws://localhost:${PORT}/live`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
