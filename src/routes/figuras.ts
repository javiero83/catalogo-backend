import { Router } from "express";
import Figura from "../models/Figura";

const router = Router();

// Middleware de validación de API KEY
router.use((req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key || key !== process.env.API_KEY) {
    console.log("API Key recibida:", key);
    console.log("API_KEY backend:", process.env.API_KEY);
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

// ===========================================
// GET /api/figuras → Obtener figuras (todas o por categoría)
// ===========================================
router.get("/", async (req, res) => {
  try {
    const { categoria } = req.query;

    const filtro: any = {};

    if (categoria) {
      filtro.categoria = {
        $regex: new RegExp(`^${categoria}$`, "i"), // match exacto sin importar may/min
      };
    }

    const figuras = await Figura.find(filtro).sort({ nombre: 1 }); // orden alfabético opcional
    res.json(figuras);

  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// GET /api/figuras/stats → Contador por categoría
// ===========================================
router.get("/stats", async (req, res) => {
  try {
    const stats = await Figura.aggregate([
      { $group: { _id: "$categoria", total: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const response: Record<string, number> = {};
    stats.forEach((s) => {
      response[s._id] = s.total;
    });

    res.json(response);

  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// POST /api/figuras → Crear figura nueva
// ===========================================
router.post("/", async (req, res) => {
  try {
    delete req.body._id; // evitar enviar IDs manuales

    const nuevaFigura = new Figura(req.body);
    await nuevaFigura.save();

    res.status(201).json(nuevaFigura);

  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// ===========================================
// PUT /api/figuras/:id → Actualizar figura
// ===========================================
router.put("/:id", async (req, res) => {
  console.log("PUT recibido:", req.body);
  try {
    if (typeof req.body.adquirida === "string") {
  req.body.adquirida = req.body.adquirida === "true";
}
    const updatedFigura = await Figura.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFigura) {
      return res.status(404).json({ error: "Figura no encontrada" });
    }

    res.json(updatedFigura);

  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

// ===========================================
// DELETE /api/figuras/:id → Eliminar figura
// ===========================================
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Figura.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Figura no encontrada" });
    }

    res.json({ message: "Figura eliminada" });

  } catch (err: unknown) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
});

export default router;
