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
// Define a type for the request body
interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  newTitle: string;
  newText: string;
}

// Handler to update a note
export const updateNotes: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
  const { noteId } = req.params;
  const { newTitle, newText } = req.body;

  if (!newTitle?.trim() || !newText?.trim()) {
    next(createHttpError(400, "Both title and text are required and cannot be empty!"));
    return;
  }

  try {
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      next(createHttpError(404, "Note not found!"));
      return;
    }

    note.title = newTitle.trim();
    note.text = newText.trim();

    const updatedNote = await note.save();
    res.status(200).json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

import mongoose from "mongoose";

// Handler to delete a note
export const deleteNotes: RequestHandler = async (req, res, next) => {
  const { noteId } = req.params;

  // Validate noteId
  if (!noteId || !mongoose.isValidObjectId(noteId)) {
    next(createHttpError(400, "Invalid or missing note ID!"));
    return;
  }

  try {
    const note = await NoteModel.findByIdAndDelete(noteId).exec();
    if (!note) {
      next(createHttpError(404, "Note not found!"));
      return;
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(`Error deleting note with ID ${noteId}:`);
    next(error); // Pass the error to the error-handling middleware
  }
};
