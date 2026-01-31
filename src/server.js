import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import requirementsRouter from "./routes/requirements.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.json({ ok: true, port: process.env.PORT || 5000 }));

app.use("/api/requirements", requirementsRouter);

const PORT = Number(process.env.PORT) || 5000;

// 🔥 Listen FIRST so health always works even if Mongo fails
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("LISTENING ON:", server.address());
});

// Mongo connect AFTER
connectDB(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (after listen)"))
  .catch((e) => console.error("Mongo connect error:", e));
