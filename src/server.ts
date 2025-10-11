import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import figurasRoutes from "./routes/figuras";

dotenv.config();
const app = express();

app.use(cors({
  origin: ["http://localhost:19006", "exp://127.0.0.1:19000"], // opcional: tu app Expo
}));
app.use(express.json());

// Ruta con API Key
app.use("/api/figuras", figurasRoutes);

const PORT = Number(process.env.PORT) || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
