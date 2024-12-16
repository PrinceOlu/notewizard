import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import noteRoutes from "./routes/notesRoutes";
import morgan from "morgan";
import createHttpError from "http-errors";
import cors from "cors";
const app = express();


// Middleware
app.use(cors());



// Add morgan middleware to log requests
app.use(morgan("dev"));

// Middleware to parse JSON requests
app.use(express.json());

// Define API routes
app.use("/api/notes", noteRoutes);

// Handle undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404, "Route not found")); // Use `createHttpError` correctly
});

// Global error-handling middleware
app.use(
  (error: unknown, req: Request, res: Response) => {
    console.error("Unhandled error:", error);

    // Determine the HTTP status code
    const status = error instanceof createHttpError.HttpError ? error.status : 500;

    // Determine the error message
    const message =
      error instanceof createHttpError.HttpError ? error.message : "An unexpected error occurred";

    // Respond with the error message and status
    res.status(status).json({ error: message });
  }
);

export default app;
