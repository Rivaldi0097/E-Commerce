import { RequestHandler } from "express";
import NoteModel from "../models/notes";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler =  async (req, res, next) => {

    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes);
    } catch (error) {
        //this will forward to the error app.use()
        next(error);
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    //params is from the url directly
    const noteId = req.params.noteId;
    
    try {
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id");
        }

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404, "Note not found");
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

interface CreateNoteBody {
    title?: string,
    text?: string,
}

//RequestHandler<param, res, req, query>
//Createbody is in the third one cause its req
export const createNotes: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async(req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {

        if(!title){
            throw createHttpError(400, "Note must have a title");
        }

        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });

        res.status(201).json(newNote);
    } catch (error) {
        next(error)
    }
}