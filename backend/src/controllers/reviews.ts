import { RequestHandler } from "express";
import ReviewModel from "../models/reviews";
import mongoose from "mongoose";
import createHttpError from "http-errors";

export const getReviews: RequestHandler = async (req, res, next) => {

    const productId = req.body.productId;

    try {

        if(!mongoose.isValidObjectId(productId)){
            throw createHttpError(400, "Invalid product id");
        }

        const reviews = await ReviewModel.find({productId: productId}).exec();

        res.status(200).json(reviews)

    } catch (error) {
        next(error)
    }
}

interface CreateReviewBody {
    productId?: string,
    description?: string,
    rating?: number
}

export const createReview: RequestHandler<unknown, unknown, CreateReviewBody, unknown> = async (req,res, next) => {
    
    const proudctId = req.body.productId;
    const description = req.body.description;
    const rating = req.body.rating;

    try {
        
        if(!proudctId){
            throw createHttpError(400, "Review must have a product id");
        }

        if(!rating){
            throw createHttpError(400, "Review must have a rating");
        }

        const newReview = await ReviewModel.create({
            productId: proudctId,
            description: description,
            rating: rating
        })

        res.status(200).json(newReview);

    } catch (error) {
        next(error)
    }
}