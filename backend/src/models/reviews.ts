import { InferSchemaType, Schema, model } from "mongoose";

const reviewSchema = new Schema({
    username: {type: String, require: true},
    productId: { type: String, required: true},
    description: { type: String },
    rating: { type: Number, required: true},
});

type Review = InferSchemaType<typeof reviewSchema>;

export default model<Review>("Review", reviewSchema);