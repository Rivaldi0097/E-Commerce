import { InferSchemaType, Schema, model } from "mongoose";

// Define schema
const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, select: false },
  phoneNum: { type: Number, required: true, select: false },
  address: {
    street: { type: String, required: true, select: false },
    city: { type: String, required: true, select: false },
    state: { type: String, required: true, select: false },
    zip: { type: Number, required: true, select: false },
  },
});

type User = InferSchemaType<typeof userSchema>;

// Compile model from schema
export default model<User>("User", userSchema);
