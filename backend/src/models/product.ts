import { InferSchemaType, Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true},
    description: { type: String},
    category: { type: String, },
    image: { type: String },
    rating: {
        rate: {type: Number},
        count: {type: Number}
    }
});

type Product = InferSchemaType<typeof productSchema>;

export default model<Product>("Product", productSchema);