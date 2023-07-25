import { RequestHandler } from "express";
import ProductModel from "../models/product";
import createHttpError from "http-errors";

export const getProducts: RequestHandler = async (req, res, next) => {
    try {
        const products = await ProductModel.find().exec();
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

interface CreateProductBody {
    name?: string,
    brand?: string,
    color?: string,
    size?: string,
    quantity?: number,
    description?: string,
    price?: number
}

export const createProduct: RequestHandler<unknown, unknown, CreateProductBody, unknown> = async(req, res, next) => {
    const name = req.body.name;
    const brand = req.body.brand;
    const color = req.body.color;
    const size = req.body.size;
    const quantity = req.body.quantity;
    const description = req.body.description;
    const price = req.body.price;

    try {
        
        if(!name){
            throw createHttpError(400, "Product must have a name")
        }

        if(!description){
            throw createHttpError(400, "Product must have a description")
        }

        if(!price){
            throw createHttpError("Product must have a price")
        }

        const newProduct = await ProductModel.create({
            name: name,
            brand: brand,
            color: color,
            size: size,
            quantity: quantity,
            description: description,
            price: price
        })

        res.status(200).json(newProduct)

    } catch (error) {
        next(error)
    }
}