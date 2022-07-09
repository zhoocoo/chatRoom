const { fstat } = require("fs");
const mime = require("mime");
const fs = require("fs");
const path = require("path");

const send404 = (response) => {
  response.writeHead(404, { "Content-type": "text/plain" });
  response.write("404");
  response.end();
};

const sendFile = (response, filePath, fileContents) => {
  response.writeHead(200, {
    "Content-type": mime.getType(path.basename(filePath)),
  });
  response.end(fileContents);
};

const serveStatic = (response, cache, absPath) => {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    const isExists = fs.existsSync(absPath);
    if (isExists) {
      fs.readFile(absPath, (err, data) => {
        if (err) {
          send404(response);
        } else {
        //   cache[absPath] = data;
          sendFile(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  }
};

module.exports = {
  send404,
  sendFile,
  serveStatic,
};
