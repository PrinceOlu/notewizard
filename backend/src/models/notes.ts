import { Schema, model, InferSchemaType } from "mongoose";

// Define the schema
const noteSchema = new Schema(
  {
    title: { type: String, required: true }, // Title is required
    text: { type: String, default: "" }, // Text is optional, defaults to empty string
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

// Infer the TypeScript type from the schema
type NoteType = InferSchemaType<typeof noteSchema>;

// Create the model
const Note = model<NoteType>("Note", noteSchema);

export default Note;
