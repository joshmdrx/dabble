// server.js
const createCards = require("./utils.js");

const WebSocket = require("ws");
const PORT = 8123;

const wss = new WebSocket.Server({ port: PORT });
const clients = {}; // Object to hold connected clients
let playing = false;
let cards;

const getPlayers = () => {
  const players = [];
  Object.keys(clients).forEach((ws) => {
    players.push({ name: clients[ws].name, score: clients[ws].score });
  });
  return players;
};

wss.on("connection", function connection(ws) {
  console.log("A new client connected!");

  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === "connect") {
      const name = data.name;
      console.log("Client connected with name:", name);
      // Check if the name already exists in the clients object
      const names = Object.keys(clients).map((ws) => clients[ws].name);

      if (names.includes(name) && name !== clients[ws].name) {
        // Name already exists, refuse the connection
        ws.send(
          JSON.stringify({ type: "error", message: "Name already exists" })
        );
      } else {
        // Accept the connection
        clients[ws] = { name: name, score: 0, ready: false };
        ws.send(JSON.stringify({ type: "connected", players: getPlayers() }));
      }
    }
    if (data.type === "updateReady") {
      if (playing) {
        return;
      }
      clients[ws].ready = data.ready;
      const allReady = Object.keys(clients).every(
        (client) => clients[client].ready
      );
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "allReady", allReady }));
        }
      });
    }
    if (data.type === "beginGame") {
      if (playing) {
        return;
      }
      playing = true;
      cards = createCards();
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "gameStarted" }));
        }
      });
    }
  });

  ws.on("close", () => {
    // Remove client from the clients object on disconnect
    console.log("Client disconnected:", clients[ws].name);
    delete clients[ws];
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
