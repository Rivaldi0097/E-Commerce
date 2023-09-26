import { InferSchemaType, Schema, model } from "mongoose";

const tokenSchema = new Schema({
    userId: {type: String, required: true},
    email: {type: String, required: true},
    token: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, index:{expires: '600s'}}
})

type Token = InferSchemaType<typeof tokenSchema>;

export default model<Token>("Token", tokenSchema);