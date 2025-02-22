// controllers/stockController.js
import { stockService } from '../services/stockService.js';

export const handleStockConnection = (ws) => {
  console.log('Stock Controller: New connection');
  stockService.addClient(ws);

  // Send an initial stock price
  const initialPrice = stockService.generateStockPrice();
  ws.send(JSON.stringify(initialPrice));
  console.log('Stock Controller: Sent initial price', initialPrice);

  // Periodic updates every 5 seconds
  const interval = setInterval(() => {
    try {
      const priceUpdate = stockService.generateStockPrice();
      ws.send(JSON.stringify(priceUpdate));
      console.log('Stock Controller: Sent update', priceUpdate);
    } catch (err) {
      console.error('Stock Controller: Error sending update', err);
    }
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    stockService.removeClient(ws);
    console.log('Stock Controller: Connection closed by client');
  });
};
