const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const WebSocket = require("ws");
let WSServer = WebSocket.Server;
let server = require("http").createServer();
let wss = new WSServer({
  server: server,
  perMessageDeflate: false,
});

server.on("request", app);
const port = process.env.PORT || 3001;

const DataAccessObject = require("./dataAccessObject");
const Comment = require("./comment");

const dataAccessObject = new DataAccessObject("./database.sqlite3");
const comment = new Comment(dataAccessObject);

wss.on("connection", function connection(socket) {
  console.log("New client connected");
  socket.send("Welcome New Client");
  socket.on("message", function incoming(message) {
    console.log(message);
    socket.send("Received message: ", message);
  });
});

comment.createTable().catch((error) => {
  console.log(`Error: ${JSON.stringify(error)}`);
});

app.post("/createComment", function (request, response) {
  const { body } = request;
  comment.createComment(body).then((result) => {
    response.send(result);
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

app.use(express.static("public"));

app.get("/", function (request, response) {
  const rootDir = __dirname.replace("/server", "");
  response.sendFile(`${rootDir}/src/index.html`);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
