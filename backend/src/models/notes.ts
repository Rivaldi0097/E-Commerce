import { InferSchemaType, Schema, model } from "mongoose";

//create schema for the mongodb
const noteSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String },
}, {timestamps: true});

//create this for the typescript
type Note = InferSchemaType<typeof noteSchema>;

export default model<Note>("Note", noteSchema);