import { RequestHandler } from "express";
import ProductModel from "../models/product";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getProducts: RequestHandler = async (req, res, next) => {
    try {
        const products = await ProductModel.find().exec();
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

export const getProductCategories: RequestHandler = async (req, res, next) => {
    try {
        const productCategories = await ProductModel.find().distinct("category")
        res.status(200).json(productCategories)
    } catch (error) {
        next (error)
    }
}

interface CreateProductBody {
    title: string,
    price: number,
    description?: string,
    category?: string,
    image?: string,
    rating: {
        rate?: number,
        count?: number
    }
}

export const createProduct: RequestHandler<unknown, unknown, CreateProductBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
    const rating = req.body.rating;

    try {
        
        if(!title){
            throw createHttpError(400, "Product must have a name")
        }

        if(!price){
            throw createHttpError("Product must have a price")
        }

        const newProduct = await ProductModel.create({
            title: title,
            price: price,
            description: description,
            category: category,
            image: image,
            rating: rating
        })

        res.status(201).json(newProduct)

    } catch (error) {
        next(error)
    }
}

interface CreateMultipleProductBody {
    [index: number] : {
        title: string,
        price: number,
        description?: string,
        category?: string,
        image?: string,
        rating: {
            rate?: number,
            count?: number
        }
    }
}

export const createMultipleProduct: RequestHandler<unknown, unknown, CreateMultipleProductBody, unknown> = async(req, res, next) => {

    try {
        const newMultipleProduct = await ProductModel.insertMany(req.body)

        res.status(200).json(newMultipleProduct)

    } catch (error) {
        next(error)
    }

}

interface UpdateProductParams {
    productId: string
}

interface UpdateProductBody {
    title: string,
    price: number,
    description?: string,
    category?: string,
    image?: string,
    rating: {
        rate?: number,
        count?: number
    }
}

export const updateProduct: RequestHandler<UpdateProductParams, unknown, UpdateProductBody, unknown> = async (req, res, next) => {
    const productId = req.params.productId;
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const category = req.body.category;
    const image = req.body.image;
    const rating = req.body.rating;

    try {
        if(!mongoose.isValidObjectId(productId)){
            throw createHttpError(400, "Invalid Product Id")
        }
    
        if(!title){
            throw createHttpError(400, "Product must have a title")
        }
    
        if(!price){
            throw createHttpError(400, "Product must have a price")
        }
    
        const product = await ProductModel.findById(productId).exec();
    
        if(!product){
            throw createHttpError(404,"Product not found");
        }
    
        product.title = title;
        product.price = price;
        product.description = description;
        product.category = category;
        product.image = image;
        product.rating = rating;
    
        const updateProduct = await product.save();
    
        res.status(200).json(updateProduct)

    } catch (error) {
        next(error)
    }
}

export const deleteProduct: RequestHandler = async (req, res, next) => {
    const productId = req.params.productId;

    try {

        if(!mongoose.isValidObjectId(productId)){
            throw createHttpError(400, "Invalid Product Id")
        }
        
        const product = await ProductModel.findById(productId).exec();

        if(!product){
            throw createHttpError(404, "Product not found")
        }

        await product.deleteOne();

        res.status(200).json("Product successfully deleted");

    } catch (error) {
        next(error)
    }
}


