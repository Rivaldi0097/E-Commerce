import { InferSchemaType, Schema, model } from "mongoose";

const orderSchema = new Schema({
    userId: {type: String, required: true},
    productId: {type: String, required: true},
    quantity: {type: Number, required: true},
    address: {type: String, required: true},
    unitNumber: {type: String, required: true},
    postalCode: {type: String, required: true},
    paymentAmount: {type: Number, required: true}
})

type Order = InferSchemaType<typeof orderSchema>;

export default model<Order>("Order", orderSchema);