// services/chatService.js
class ChatService {
    constructor() {
      this.clients = {}; // Maps username to active WebSocket connection
    }
  
    addClient(username, ws) {
      this.clients[username] = ws;
      // In a production app, you might update the user's status in your DB:
      // e.g., db.updateUserStatus(username, 'online');
    }
  
    removeClient(username) {
      delete this.clients[username];
      // In production, mark the user as offline in your DB.
      // e.g., db.updateUserStatus(username, 'offline');
    }
  
    sendMessage(to, from, text) {
      if (this.clients[to]) {
        // The target user is online; send the message immediately.
        this.clients[to].send(JSON.stringify({ from, text }));
        return true;
      }
      // If the user is offline, you might want to store the message in a DB for later delivery.
      return false;
    }
  }
  
  export const chatService = new ChatService();
  