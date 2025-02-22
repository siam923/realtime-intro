// server.js
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const allowedUsers = ['john', 'mary', 'alice', 'bob'];

import chatRouter from './routes/chatRoutes.js';
import stockRouter from './routes/stockRoutes.js';

const app = express();
app.use(express.json());

// Optional HTTP endpoints for testing:
app.use('/api/chat', chatRouter);
app.use('/api/stocks', stockRouter);

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Create a WebSocketServer with noServer: true
const wss = new WebSocketServer({ noServer: true });

// Listen for upgrade events
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, 'http://localhost');
  console.log('Upgrade event received:', url.pathname);
  console.log('Request headers:', request.headers);

  if (url.pathname === '/api/chat' || url.pathname === '/api/stocks') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Handle new WebSocket connections
wss.on('connection', (ws, request) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/chat') {
    const username = url.searchParams.get('username');
    if (!username || !allowedUsers.includes(username)) {
      ws.send(JSON.stringify({ error: 'Invalid or missing username' }));
      ws.close();
      return;
    }
    // Dynamically import chat controller and pass the username
    import('./controllers/chatController.js').then(({ handleChatConnection }) => {
      handleChatConnection(ws, username);
    });
  } else if (url.pathname === '/api/stocks') {
    import('./controllers/stockController.js').then(({ handleStockConnection }) => {
      handleStockConnection(ws);
    });
  } else {
    ws.close();
  }
});

// Start the HTTP server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
