import { Schema, model, InferSchemaType } from "mongoose";

// Define the schema
const noteSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
  },
  { timestamps: true }
);

// Infer the TypeScript type from the schema
type NoteType = InferSchemaType<typeof noteSchema>;

// Create the model
const Note = model<NoteType>("Note", noteSchema);

export default Note;
