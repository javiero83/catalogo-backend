import { Router } from "express";
import Figura from "../models/Figura";

const router = Router();

router.get("/", async(_req, res)=>{
    const figuras = await Figura.find();
    res.json(figuras);
});

router.post("/", async(req, res)=>{
    try{
        const nuevaFigura = new Figura(req.body);
        await nuevaFigura.save();
        res.status(201).json(nuevaFigura);
    } catch (error){
        res.status(400).json({error: "No se pudo crear la figura"})
    }
});

router.delete("/:id", async(req,res)=>{
    await Figura.findByIdAndDelete(req.params.id);
    res.json({mensaje: "Figura eliminada"});
});

export default router;