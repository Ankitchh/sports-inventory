require("dotenv").config(); // Load .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => console.log("User disconnected"));
});

server.listen(5000, () => console.log(`Server running on port 5000`));

module.exports = { io };
