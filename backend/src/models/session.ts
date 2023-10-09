import { InferSchemaType, Schema, model } from "mongoose";

const sessionSchema = new Schema({
    _id: {type: String, required: true},
    expires: {type: Date, required: true},
    session: {type: String, required: true}
})

type Session = InferSchemaType<typeof sessionSchema>;

export default model<Session>("Session", sessionSchema);