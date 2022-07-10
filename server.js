const http = require("http");

const path = require("path");
const { serveStatic } = require("./lib/utils");

const chatServer = require("./lib/chat_server")

const cache = {};

const server = http.createServer((req, res) => {
  let filePath = false;
  if (req.url === "/") {
    filePath = "public/index.html";
  } else {
    filePath = "public" + req.url;
  }

  const absPath = "./" + filePath;
  serveStatic(res, cache, absPath);
});

chatServer(server)

const PORT = 3000;

server.listen(PORT, () => {
  console.log("Server listening on port http://localhost:" + PORT);
});
