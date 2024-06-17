import "reflect-metadata";

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { authMiddleware } from "./middlewares/auth";

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();

  // Middleware

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const userRouter = require("./routes/user");
  const booksRouter = require("./routes/books");

  // Authentication middleware
  app.use(authMiddleware);

  // Rutas
  app.use("/auth", userRouter);
  app.use("/", booksRouter);

  // Middleware to handle not found routes
  app.use((_req: Request, res: Response) => {
    res.status(404).send({ error: "Resource not found", status: 404 });
  });

  // Middleware to handle errors
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ error: "There was a server error.", status: 500 });
  });

  // Endpoint that responds with 'Hello, world!"
  app.get("/hello", (req, res) => {
    res.status(200).type("text/plain").send("Hello, world!");
  });

  // Start the server.
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => console.error("Error starting the server:", err));
