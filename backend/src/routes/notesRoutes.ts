import "dotenv/config";
import express from "express";
import * as noteController from "../controllers/noteController";

const router = express.Router();

// Define routes for notes
router.get("/", noteController.getNotes); // Fetch all notes
router.get("/:noteId", noteController.getSingleNotes); // Fetch single notes
router.post("/", noteController.createNotes); // Create a new note

export default router;
