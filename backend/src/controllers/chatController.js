// controllers/chatController.js
import { chatService } from '../services/chatService.js';

/**
 * Handles a new chat WebSocket connection.
 *
 * Note:
 * - In a production app, if a user goes offline, you may want to persist their chat state
 *   (e.g. saving messages to a database) so that they can reconnect and continue the conversation.
 * - You could also implement an auto-reconnect mechanism on the client side.
 * - Here we also set an inactivity timeout to auto-close connections after 5 minutes.
 */
export const handleChatConnection = (ws, username) => {
  // Register the user (from the static list) and their connection.
  chatService.addClient(username, ws);
  console.log(`Chat Controller: User ${username} connected`);

  // In a production scenario, before closing the connection due to inactivity,
  // you might want to persist the chat state (e.g., save unsent messages or user status) to a database.
  let inactivityTimer = setTimeout(() => {
    console.log(`Chat Controller: Inactivity timeout for ${username}`);
    // Auto-close the connection after inactivity.
    // In addition, save any necessary state to your DB here.
    // Example: db.saveUserState(username, { lastSeen: new Date(), unsentMessages: [...] });
    ws.close();
  }, 300000); // 5 minutes

  ws.on('message', (data) => {
    console.log(`Chat Controller: Received message from ${username}: ${data}`);
    try {
      const { to, text } = JSON.parse(data);

      // If the target user is offline, you might save the message to a database,
      // then deliver it when they reconnect.
      const sent = chatService.sendMessage(to, username, text);
      if (!sent) {
        // For demo purposes, we send an error.
        // In a production app, consider saving the message for later delivery.
        ws.send(JSON.stringify({ error: 'User not found or offline. Message saved for later delivery.' }));
        // Example: db.saveMessage({ from: username, to, text, timestamp: new Date() });
      }
    } catch (error) {
      console.error('Chat Controller: Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // On close, remove the client from the active connections.
    // Optionally, update the user’s status in your database.
    // Example: db.updateUserStatus(username, 'offline');
    chatService.removeClient(username);
    console.log(`Chat Controller: User ${username} disconnected`);
  });

  ws.on('ping', () => {
    // Clear the inactivity timer if a ping is received.
    clearTimeout(inactivityTimer);
    // Optionally, you could reset the timer here to keep the connection alive.
    // inactivityTimer = setTimeout(() => { ... }, 300000);
  });
};
