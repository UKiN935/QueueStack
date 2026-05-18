require("dotenv").config(); 
const http = require("http")
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io")

const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app)
const io = new Server(server,{
  cors: { origin: "http://localhost:5173" }
});
const PORT = 3001;

io.on("connection", (socket) =>{
  console.log("User connected: ", socket.id)

  socket.on("disconnect", () =>{
    console.log("User disconnected: ",  socket.id)
  });
});

app.set("io",io)
// ─── Middleware 
app.use(cors());
app.use(express.json());

// ─── Logger Middleware 
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ─── MongoDB Connection 
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error:", err));

// ─── Rout-es 
const { router: questionRoutes } = require("./routes/questions");
const answerRoutes = require("./routes/answers");

app.use("/questions", questionRoutes);
app.use("/questions", answerRoutes);

const authRoutes = require("./routes/auth")
app.use("/auth", authRoutes)



// ─── Error Handler 
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

// ─── Start Server 
server.listen(PORT, () => {
  console.log(`✅ QueStack backend running at http://localhost:${PORT}`);
});