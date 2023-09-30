// importing packages
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors"
import morgan from "morgan";
//
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
// importing routes
import userRoutes from "./routes/userRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import fileRoutes from "./routes/fileRoutes.js"

dotenv.config();
connectDB();

// express configs
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))


// frontend
app.use("/", express.static("frontend/build"))

// routings
app.use("/api/users", userRoutes)
app.use("/api/contacts", contactRoutes)
app.use("/file", fileRoutes);


// static files
app.use("/images", express.static("uploads"))
app.use("/qrcodes", express.static("qrcodes"))



// Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`.yellow.underline);
});