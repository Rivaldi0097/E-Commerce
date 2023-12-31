import { RequestHandler } from "express";
import ReviewModel from "../models/reviews";
import mongoose from "mongoose";
import createHttpError from "http-errors";
import user from "../models/user";

export const getReviews: RequestHandler = async (req, res, next) => {

    try {
        const reviews = await ReviewModel.find().exec();
        res.status(200).json(reviews);
    } catch (error) {
        next(error)
    }
}

export const getReviewsByProduct: RequestHandler = async (req, res, next) => {

    const productId = req.params.productId;
     
    try {

        if(!productId){
            throw createHttpError(400, "Review must have a product id");
        }

        const reviews = await ReviewModel.find({productId: productId}).exec();

        res.status(200).json(reviews)

    } catch (error) {
        next(error)
    }
}

interface CreateReviewBody {
    username: String,
    productId?: string,
    description?: string,
    rating?: number
}

export const createReview: RequestHandler<unknown, unknown, CreateReviewBody, unknown> = async (req,res, next) => {
    
    const username = req.body.username;
    const productId = req.body.productId;
    const description = req.body.description;
    const rating = req.body.rating;

    try {
        
        if(!productId){
            throw createHttpError(400, "Review must have a product id");
        }

        if(!rating){
            throw createHttpError(400, "Review must have a rating");
        }

        const newReview = await ReviewModel.create({
            username: username,
            productId: productId,
            description: description,
            rating: rating
        })

        res.status(201).json(newReview);

    } catch (error) {
        next(error)
    }
}


export const deleteReview: RequestHandler = async (req, res, next) => {
    const reviewId = req.params.reviewId;

    try {
        
        if(!mongoose.isValidObjectId(reviewId)){
            throw createHttpError(400, "Invalid Review Id")
        }

        const review = await ReviewModel.findById(reviewId).exec();

        if(!review){
            throw createHttpError(404, "Review not found")
        }

        await review.deleteOne();

        res.status(200).json('Review successfully deleted');

    } catch (error) {
        next(error)
    }

}