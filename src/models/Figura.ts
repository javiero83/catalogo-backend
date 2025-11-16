import mongoose, { Schema, Document } from "mongoose";

export interface IFigura extends Document {
  nombre: string;
  descripcion?: string;
  precio?: number;
  categoria: string;
  imagen?: string;
  adquirida: boolean;
}

const FiguraSchema = new Schema<IFigura>({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: Number,
  categoria: { type: String, required: true },
  imagen: String,
  adquirida: { type: Boolean, default: false },
});

export default mongoose.model<IFigura>("Figura", FiguraSchema);
