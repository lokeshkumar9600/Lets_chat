const express = require("express"); 
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const app = express();
// const PORT = 5000||process.env.PORT;
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/lets_chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const bodyParser = require("body-parser");
const server = http.createServer(app);
const io = socketio(server);
const botName = "Cyber Bot";
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");
io.on("connection", (socket) => {
  console.log("new WS connected");

  socket.on("joinChatRoom", ({ username, room }) => {
    // welcome current user
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit("message", formatMessage(botName, "welcome to chatcord"));
    //broad cast when a user connects ("this will be visible to everyone except the connected user")
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, ` ${user.username} has joined the chat`)
      );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //when a user disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );

      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// database schema import
var users = require("./db/user");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/signin", (req, res) => {
  res.sendFile(__dirname + "/public/sign-in.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/sign-up.html");
});

app.post("/signup", (req, res) => {
  if (req.body.signupPassword == req.body.signupConfirmPassword) {
    console.log("check confirm");
    users.create(
      {
        email: req.body.signupEmail,
        password: req.body.signupPassword,
      },
      (err, save) => {
        if (err) {
          console.log(err);
        } else {
          console.log(save);
          res.redirect("/");
        }
      }
    );
  } else {
  }
});

app.post("/signin", (req, res) => {
  users.findOne({ email: req.body.signinEmail }, (err, userfound) => {
    if (err) {
      console.error(err);
    } else {
      if (userfound) {
        if (userfound.password === req.body.signinPassword) {
          app.get("/rooms", (req, res) => {
            res.sendFile(__dirname + "/public/rooms.html");
          });
          res.redirect("/rooms");
        }
      }
    }
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
