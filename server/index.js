const { WebSocket, WebSocketServer } = require("ws");
const http = require("http");
const { getMaxListeners } = require("events");
const uuidv4 = require("uuid").v4;

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const port = process.env.PORT || 8000;
const wsServer = new WebSocketServer({ server });

server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
});

// I'm maintaining all active connections in this object
const clients = {};
// I'm maintaining all active users in this object
const users = {};
// The current editor content is maintained here.
let editorContent = null;
// User activity history.
let userActivity = [];

let messages = [];

// Event types
const typesDef = {
    USER_EVENT: "userevent",
    CONTENT_CHANGE: "contentchange",
};

function broadcastMessage(json) {
    // We are sending the current data to all connected clients
    console.log(json);
    const data = JSON.stringify(json);
    for (let userId in clients) {
        let client = clients[userId];
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

function handleMessage(message, userId) {
    console.log(message);
    const dataFromClient = JSON.parse(message.toString());
    console.log(dataFromClient);
    const json = { type: dataFromClient.type };
    console.log(json);
    console.log(JSON.parse(message));
    console.log("reach");
    if (dataFromClient.type === typesDef.USER_EVENT) {
        users[userId] = dataFromClient;
        userActivity.push(
            `${dataFromClient.username} joined to edit the document`
        );
        json.data = { users, userActivity };
    } else if (dataFromClient.type === typesDef.CONTENT_CHANGE) {
        editorContent = dataFromClient.content;
        json.data = { editorContent, userActivity };
    }

    let buffer = Buffer.from(JSON.stringify(dataFromClient));

    let data = { type: "update", data: dataFromClient };
    broadcastData(data);
}

function handleAction(message) {
    const dataFromClient = JSON.parse(message.toString());
    messages.push(message);

    broadcastData(dataFromClient);

    return dataFromClient;
}

function broadcastData(json) {
    // We are sending the current data to all connected clients
    const data = JSON.stringify(json);
    for (let userId in clients) {
        let client = clients[userId];
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    }
}

function handleDisconnect(userId) {
    console.log(`${userId} disconnected.`);
    const json = { type: typesDef.USER_EVENT };
    const username = users[userId]?.username || userId;
    userActivity.push(`${username} left the document`);
    json.data = { users, userActivity };
    delete clients[userId];
    delete users[userId];
    broadcastMessage(json);
}

// A new client connection request received
wsServer.on("connection", function (connection) {
    // Generate a unique code for every user
    const userId = uuidv4();
    console.log("Recieved a new connection");

    // Store the new connection and handle messages
    clients[userId] = connection;
    console.log(`${userId} connected.`);
    // broadcastMessage({ messages: messages });

    connection.on("message", (message) => handleMessage(message, userId));
    // User disconnected
    connection.on("close", () => handleDisconnect(userId));
});
