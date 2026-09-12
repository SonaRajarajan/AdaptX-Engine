import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { CampaignStore } from './services/CampaignStore';
import { LayoutEngineService } from './services/LayoutEngineService';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const campaignStore = new CampaignStore();
const activeUsers = new Map<string, any>();

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    engine: 'ADAPT-X Adaptive Layout Engine v2.0',
    uptime: process.uptime(),
    activeConnections: io.sockets.sockets.size,
    campaignsLoaded: campaignStore.getAllCampaigns().length,
  });
});

// Campaign Endpoints
app.get('/api/campaigns', (req, res) => {
  res.json({ campaigns: campaignStore.getAllCampaigns() });
});

app.get('/api/campaigns/:id', (req, res) => {
  const campaign = campaignStore.getCampaign(req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  res.json({ campaign });
});

app.post('/api/campaigns', (req, res) => {
  const campaign = req.body;
  if (!campaign || !campaign.id) {
    return res.status(400).json({ error: 'Invalid campaign payload' });
  }
  const saved = campaignStore.saveCampaign(campaign);
  io.emit('campaign_updated', saved);
  res.json({ campaign: saved });
});

// Text Compression Endpoint
app.post('/api/layout/compress-text', (req, res) => {
  const { headline, description } = req.body;
  if (!headline || !description) {
    return res.status(400).json({ error: 'headline and description are required' });
  }
  const compressed = LayoutEngineService.compressText(headline, description);
  res.json({ result: compressed });
});

// Layout Versions Endpoints
app.get('/api/layout/versions', (req, res) => {
  const campaignId = req.query.campaignId as string;
  const versions = campaignStore.getVersions(campaignId);
  res.json({ versions });
});

app.post('/api/layout/versions', (req, res) => {
  const version = req.body;
  if (!version || !version.versionId) {
    return res.status(400).json({ error: 'Invalid version payload' });
  }
  const saved = campaignStore.saveVersion(version);
  io.emit('version_created', saved);
  res.json({ version: saved });
});

// Real-Time Socket.IO Collaboration
io.on('connection', (socket: Socket) => {
  console.log(`[ADAPT-X Socket] Client connected: ${socket.id}`);

  socket.emit('initial_data', {
    campaigns: campaignStore.getAllCampaigns(),
    versions: campaignStore.getVersions(),
  });

  socket.on('layout_change', (data: any) => {
    socket.broadcast.emit('layout_change', data);
  });

  socket.on('surface_update', (surface: any) => {
    socket.broadcast.emit('surface_update', surface);
  });

  socket.on('presence', (presence: any) => {
    if (!presence || !presence.id) return;
    activeUsers.set(presence.id, { ...presence, socketId: socket.id });
    socket.broadcast.emit('presence', Array.from(activeUsers.values()));
  });

  socket.on('disconnect', () => {
    console.log(`[ADAPT-X Socket] Client disconnected: ${socket.id}`);
    for (const [userId, user] of activeUsers.entries()) {
      if (user.socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('presence', Array.from(activeUsers.values()));
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`🚀 ADAPT-X Server running on http://localhost:${PORT}`);
});
