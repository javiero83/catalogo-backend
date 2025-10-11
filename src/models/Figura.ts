import mongoose, {Schema, Document} from "mongoose";

export interface IFigura extends Document{
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    adquirida: boolean;
}

const FiguraSchema = new Schema<IFigura>({
    nombre: {type: String, required: true},
    descripcion: String,
    precio: Number,
    imagen: String,
    adquirida: {type:Boolean, default: false},
});

export default mongoose.model<IFigura>("Figura", FiguraSchema);