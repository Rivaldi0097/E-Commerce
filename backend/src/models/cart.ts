import { InferSchemaType, Schema, model } from "mongoose";

// Define Schema
const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  products: [
    new Schema(
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        // productTitle: {type: Schema.Types.username, ref:"Product"}
        // productPrice: {type: Schema.Types.username, ref:"Product"}
        quantity: { type: Number },
      },
      { _id: false }
    ),
  ],
});

type Cart = InferSchemaType<typeof cartSchema>;

export default model<Cart>("Cart", cartSchema);
