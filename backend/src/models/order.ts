import { InferSchemaType, Schema, model } from "mongoose";

// const orderSchema = new Schema({
//     userId: {type: String, required: true},
//     productId: {type: String, required: true},
//     quantity: {type: Number, required: true},
//     address: {type: String, required: true},
//     unitNumber: {type: String, required: true},
//     postalCode: {type: String, required: true},
//     paymentAmount: {type: Number, required: true}
// })

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      new Schema(
        {
          product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: { type: Number, required: true },
        },
        { _id: false }
      ),
    ],
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

type Order = InferSchemaType<typeof orderSchema>;

export default model<Order>("Order", orderSchema);
