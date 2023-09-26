import { RequestHandler } from "express";
import OrderModel from "../models/order";
// import mongoose from "mongoose";
import createHttpError from "http-errors";

interface getOrderParams {
  userId: string;
}

export const getOrders: RequestHandler<
  getOrderParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.params.userId })
      .populate({ path: "user", select: "username" })
      .populate({
        path: "products.product",
        select: ["title", "price", "image"],
      })
      .exec();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

type productType = {
  product: string;
  quantity: number;
};

interface CreateOrderBody {
  user: string;
  products: productType[];
  totalAmount: number;
}

export const createOrder: RequestHandler<
  unknown,
  unknown,
  CreateOrderBody,
  unknown
> = async (req, res, next) => {
  const user = req.body.user;
  const products = req.body.products;
  const totalAmount = req.body.totalAmount;

  try {
    if (!products || products.length === 0) {
      throw createHttpError(400, "Products must not be empty");
    }

    if (!totalAmount || totalAmount === 0) {
      throw createHttpError(400, "Total amount must not be empty or zero");
    }

    if (!user) {
      throw createHttpError(400, "Order must have a user associated");
    }

    const newOrder = await OrderModel.create({
      user: user,
      products: products,
      totalAmount: totalAmount,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};
