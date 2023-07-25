import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    brand: { type: String, },
    color: { type: String },
    size: { type: Array, default: [] },
    quantity: { type: Number,  default: 0},
    description: { type: String, required: true },
    price: { type: Number, required: true}
});

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);