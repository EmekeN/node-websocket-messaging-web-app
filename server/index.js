const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DataAccessObject = require("./dataAccessObject");
const dataAccessObject = new DataAccessObject("./database.sqlite3");
const Comment = require("./comment");
const comment = new Comment(dataAccessObject);

const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const port = process.env.PORT || 3001;
const WebSocket = require("ws");
const server = require("http").createServer(app);
const webSocketServer = new WebSocket.WebSocketServer({
  server,
  clientTracking: true,
});

webSocketServer.on("connection", function connection(socket, request, client) {
  socket.send(JSON.stringify("Welcome New Client"));
  socket.on("message", function incoming(message) {
    console.log("Message From Client: ", message.toString());
  });
});

comment.createTable().catch((error) => {
  console.log(`Error: ${JSON.stringify(error)}`);
});

server.listen(port, () => console.log(`Listening on port ${port}`));

app.post("/createComment", async function (request, response) {
  const { body } = request;
  comment.createComment(body).then((result) => {
    response.send(result);
    webSocketServer.clients.forEach((client) => {
      client.send(JSON.stringify({ type: "newComment", id: result?.id }));
    });
  });
});

app.get("/getComment", function (request, response) {
  const { body } = request;
  const { id } = body;
  comment.getComment(id).then((result) => {
    response.send(result);
  });
});

app.get("/getComments", function (request, response) {
  comment.getComments().then((result) => {
    response.send(result);
  });
});

app.delete("/deleteComments", function (request, response) {
  comment.deleteComments().then((result) => {
    response.send(result);
  });
});

app.use(express.static("dist"));

app.get("/", function (request, response) {
  const rootDir = __dirname.replace("/server", "");
  console.log("ROOT DIR: ", rootDir);
  response.sendFile(`${rootDir}/index.html`);
});
