// routes/chatRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('HTTP endpoint for chat. Please connect via WebSocket at ws://localhost:3000/api/chat');
});

export default router;
