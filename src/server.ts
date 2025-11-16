import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { connectDB } from "./config/db";
import figurasRoutes from "./routes/figuras";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/figuras", figurasRoutes);

const PORT = Number(process.env.PORT) || 3000;
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

