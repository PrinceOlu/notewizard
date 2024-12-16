import app from "../src/app";
import mongoose from "mongoose";
const port = process.env.PORT || 5000;
import cors from "cors";



// Apply CORS middleware before route definitions
app.use(cors());

// Ensure MONGO_URI is defined
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Database connected...");

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit the process if DB connection fails
  });

