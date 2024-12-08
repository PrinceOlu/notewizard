import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import NoteModel from "./models/notes";

const app = express();

app.get("/", async (req: Request, res: Response) => {
  try {
    // Fetch data from the database
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    console.error("An error occurred:", error);

    // Respond with an appropriate message and status code
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

// Middleware to handle undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error-handling middleware
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", error);

  // Set a generic error message
  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred";

  // Respond with a 500 status code and error message
  res.status(500).json({ error: errorMessage });
});

export default app;
