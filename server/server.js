// server.js
const createCards = require("./utils.js");

const WebSocket = require("ws");
const PORT = 8123;

const wss = new WebSocket.Server({ port: PORT });
const clients = {}; // Object to hold connected clients
let playing = false;
let cards;
let gameScores = {};
let gameData = "";
let newCard;
let gameCard;

const getPlayers = () => {
  const players = [];
  Object.keys(clients).forEach((name) => {
    players.push({ name: name, score: clients[name].score });
  });
  return players;
};

const beginGame = () => {
  playing = true;
  gameScores = {};
  Object.keys(clients).forEach((name) => {
    gameScores[name] = { score: 0 };
  });
  cards = createCards();
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "gameStarted" }));
    }
  });
  setTimeout(() => {
    sendCards();
  }, 1000);
};
const updatePlayers = () => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({ type: "updatePlayers", players: getPlayers() })
      );
    }
  });
};
const updateAllReady = () => {
  const allReady = Object.keys(clients).every(
    (client) => clients[client].ready
  );
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "allReady", allReady }));
    }
  });
};
const handleGameEnd = () => {
  playing = false;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "gameOver" }));
    }
  });
  setTimeout(() => {
    sendResults();
  }, 2000);
};
const setAllNotReady = () => {
  Object.keys(clients).forEach((name) => {
    clients[name].ready = false;
  });
  updateAllReady();
};
const sendResults = () => {
  // Determine the highest score
  const highestScore = Math.max(
    ...Object.values(gameScores).map((score) => score.score)
  );

  // Identify all players with the highest score
  const winners = Object.keys(gameScores).filter(
    (name) => gameScores[name].score === highestScore
  );

  // Update the message based on the number of winners
  let message;
  if (winners.length === 1) {
    message = `${winners[0]} won!`;
    // The sole winner gets 1 point added
    clients[winners[0]].score += 1;
  } else {
    message = `${winners.join(", ")} drew!`;
    // Each player in a draw gets 0.5 added to their score
    winners.forEach((winner) => {
      clients[winner].score += 0.5;
    });
  }

  console.log("message", message);

  const scores = Object.keys(gameScores).map((name) => {
    return { name, score: gameScores[name].score };
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "results", scores, message }));
    }
  });
  setAllNotReady();
  updatePlayers();
};
const sendCards = (winner) => {
  console.log("Sending cards");
  if (cards.length <= 0) {
    console.log("No more cards");
    if (winner) {
      gameScores[winner].score += 1;
    }
    handleGameEnd();
    return;
  }
  if (winner) {
    gameScores[winner].score += 1;
    console.log(gameScores);
    gameData = `${winner} got that one!`;
    newCard = cards.pop();
    clients[winner].ws.send(
      JSON.stringify({
        type: "cards",
        card: gameCard,
        groupCard: newCard,
        gameData: gameData,
      })
    );
    wss.clients.forEach((client) => {
      if (client !== winner && client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "cards",
            groupCard: newCard,
            gameData: gameData,
          })
        );
      }
    });
    gameCard = newCard;
  } else {
    gameData = "BEGIN!";
    gameCard = cards.pop();
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        let card = cards.pop();
        client.send(
          JSON.stringify({
            type: "cards",
            card: card,
            groupCard: gameCard,
            gameData: gameData,
          })
        );
      }
    });
  }
};

wss.on("connection", function connection(ws) {
  console.log("A new client connected!");

  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    if (data.type === "connect") {
      const name = data.name;
      console.log("Client connected with name:", name);

      if (clients[name]) {
        // Name already exists, refuse the connection
        ws.send(
          JSON.stringify({ type: "error", message: "Name already exists" })
        );
      } else {
        // Broadcast the updated players list to all connected clients
        clients[name] = { ws, name, score: 0, ready: false };
        ws.send(JSON.stringify({ type: "connected", players: getPlayers() }));
        updatePlayers();
        updateAllReady();
      }
    }
    if (data.type === "updateReady") {
      if (playing) {
        return;
      }
      // clients[ws].ready = data.ready;
      const key = Object.keys(clients).find((key) => clients[key].ws === ws);
      clients[key].ready = data.ready;
      updateAllReady();
    }
    if (data.type === "beginGame") {
      if (playing) {
        return;
      }
      beginGame();
    }
    if (data.type === "match") {
      winner = Object.keys(clients).find((key) => clients[key].ws === ws);
      sendCards(winner);
    }
  });

  ws.on("close", () => {
    // Find the key (client name or unique ID) associated with the disconnecting WebSocket
    const keyToDelete = Object.keys(clients).find(
      (key) => clients[key].ws === ws
    );

    if (keyToDelete) {
      // Remove the client from the clients object using the found key
      delete clients[keyToDelete];
      console.log(`Client ${keyToDelete} disconnected`);

      updatePlayers();
    }

    if (Object.keys(clients).length === 0) {
      playing = false;
    }
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
