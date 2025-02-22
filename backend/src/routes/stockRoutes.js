// routes/stockRoutes.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('HTTP endpoint for stocks. Please connect via WebSocket at ws://localhost:3000/api/stocks');
});

export default router;
