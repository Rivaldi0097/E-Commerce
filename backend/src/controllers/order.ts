import { RequestHandler } from "express";
import OrderModel from "../models/order";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getOrders: RequestHandler = async (req, res, next) => {

    try {
        const orders = await OrderModel.find().exec();
        res.status(200).json(orders);

    } catch (error) {
        next(error)
    }
}

interface CreateOrderBody{
    userId: string,
    productId: string,
    quantity: number,
    address: string,
    unitNumber: string,
    postalCode: string,
    paymentAmount: number
}

export const createOrder: RequestHandler<unknown, unknown, CreateOrderBody, unknown> = async (req, res, next) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const address = req.body.address;
    const unitNumber = req.body.unitNumber;
    const postalCode = req.body.postalCode;
    const paymentAmount = req.body.paymentAmount;

    if(!userId || !productId || !quantity || !address || !unitNumber || !postalCode || !paymentAmount){
        throw createHttpError(400, "Something is missing, please check again")
    }

    try {
        
        const newOrder = await OrderModel.create({
            userId: userId,
            productId: productId,
            quantity: quantity,
            address: address,
            unitNumber: unitNumber,
            postalCode: postalCode,
            paymentAmount: paymentAmount
        })
    
        res.status(200).json(newOrder);

    } catch (error) {
        next(error)
    }
}