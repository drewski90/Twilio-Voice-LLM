require('dotenv').config();
const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const streamManager = require('./streamManager');

streamManager(wss); // setup websocket server

app.post("/voice", (req, res) => {
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Connect>
        <Stream url="wss://${req.headers.host}/"/>
      </Connect>
      <Say>Hello, how can i assist you?</Say>
      <Pause length="60" />
    </Response>
  `);
});

console.log("Listening on Port 3000");
server.listen(3000);
