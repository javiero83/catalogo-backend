import { Router } from "express";
import Figura from "../models/Figura";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // Leer la API Key enviada desde la app
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    // Log para depuración
    console.log("API Key recibida:", apiKey);
    console.log("API_KEY en backend:", process.env.API_KEY);

    // Validar API Key
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const figuras = await Figura.find();
    res.json(figuras);

  } catch (error) {
    console.error("Error al obtener figuras:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { nombre, descripcion, precio, imagen, adquirida } = req.body;

    const nuevaFigura = await Figura.create({
      nombre,
      descripcion,
      precio,
      imagen,
      adquirida: adquirida ?? false
    });

    res.json(nuevaFigura);

  } catch (error) {
    console.error("Error al crear figura:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// DELETE /api/figuras/:id
router.delete("/:id", async (req, res) => {
  try {
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const figuraEliminada = await Figura.findByIdAndDelete(id);

    if (!figuraEliminada) {
      return res.status(404).json({ error: "Figura no encontrada" });
    }

    res.json({ message: "Figura eliminada", id: figuraEliminada._id });

  } catch (error) {
    console.error("Error al eliminar figura:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar figura
router.patch("/:id", async (req, res) => {
  try {
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKey = Array.isArray(apiKeyHeader) ? apiKeyHeader[0] : apiKeyHeader;

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const updates = req.body; // { nombre?, descripcion?, precio?, imagen?, adquirida? }

    const figuraActualizada = await Figura.findByIdAndUpdate(id, updates, { new: true });

    if (!figuraActualizada) {
      return res.status(404).json({ error: "Figura no encontrada" });
    }

    res.json(figuraActualizada);

  } catch (error) {
    console.error("Error al actualizar figura:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



export default router;
