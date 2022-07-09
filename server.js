const http = require("http");

const path = require("path");
const { serveStatic, send404, sendFile } = require("./lib/utils");
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

const PORT = 3000;

server.listen(PORT, () => {
  console.log("Server listening on port http://localhost:" + PORT);
});
