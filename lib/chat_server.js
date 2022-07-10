const socketio = require("socket.io");

let io;
let guestNumber = 1;
let nickNames = {};
let namesUsed = [];
let currentRoom = {};

const assignGuestName = (socket, guestNumber, nickNames, namesUsed) => {
  let name = "Guest" + guestNumber;
  nickNames[socket.io] = name;
  socket.emit("nameResult", {
    success: true,
    name: name,
  });
  namesUsed.push(name);
  return guestNumber + 1;
};

const joinRoom = (socket, room) => {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit("joinResult", { room });
  socket.broadcast.to(room).emit("message", {
    text: nickNames[socket.id] + " 加入了" + room + ".",
  });

  const usersInRoom = io.sockets.clients(room);
  if (usersInRoom.length > 1) {
    const usersInRoomSummary = "用户当前在" + room + ": ";
    if (userSocketId != socket.id) {
      if (index > 0) {
        usersInRoomSummary += ", ";
      }
      usersInRoomSummary += nickNames[userSocketId];
    }
  }
  usersInRoomSummary += ".";
  socket.emit("message", { text: usersInRoomSummary });
};

const handleNameChangeAttempts = (socket, nickNames, namesUsed) => {
  socket.on("nameAttempt", (name) => {
    if (name.startWith("Guest")) {
      socket.emit("nameResult", {
        success: false,
        message: "不能已'Guest'开头",
      });
    } else {
      if (namesUsed.indexOf(name) === -1) {
        const previousName = nickNames[socket.id];
        const previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex];
        socket.emit("nameResult", {
          success: true,
          name: name,
        });
        socket.broadcast.to(currentRoom[socket.id]).emit("message", {
          text: previousName + "改名为" + name + "。",
        });
      } else {
        socket.emit("nameResult", {
          success: false,
          message: "当前名称已被占用",
        });
      }
    }
  });
};
