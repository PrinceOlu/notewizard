import { RequestHandler } from "express";
import NoteModel from "../models/notes";
import createHttpError from "http-errors";

// Handler to fetch all notes
export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Define a type for route parameters
interface NoteParams {
  noteId: string;
}
// Handler to fetch a single note
export const getSingleNotes: RequestHandler<NoteParams> = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, `Note with ID ${noteId} not found.`);
    }

    res.status(200).json(note);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

// Define a type for the request body
interface CreateNoteBody {
  title: string;
  text: string;
}
// Handler to create a new note
export const createNotes: RequestHandler<unknown, unknown, CreateNoteBody> = async (req, res, next) => {
  const { title, text } = req.body;

  if (!title || !text) {
    next(createHttpError(400, "Both title and text are required!"));
    return;
  }

  try {
    const newNote = await NoteModel.create({ title, text });
    res.status(201).json(newNote);
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};
