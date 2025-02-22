// services/stockService.js
class StockService {
    constructor() {
      this.clients = [];
    }
    addClient(ws) {
      this.clients.push(ws);
    }
    removeClient(ws) {
      this.clients = this.clients.filter(client => client !== ws);
    }
    broadcastPrice(price) {
      this.clients.forEach(client => {
        client.send(JSON.stringify(price));
      });
    }
    generateStockPrice() {
      return { symbol: 'XYZ', price: Math.random() * 100 };
    }
  }
  
  export const stockService = new StockService();
  