import express from "express";
import { Request, Response } from "express";

const router = express.Router();

const {
  getAllBooks,
  getBookById,
  getBooksByPrice,
  addNewBook,
  getBooksByPhrase,
  getAverageBooksCost,
} = require("../controllers/books");

router.get("/books", (req: Request, res: Response) => {
  if (req.query.price) {
    return getBooksByPrice(req, res);
  }
  if (req.query.phrase) {
    return getBooksByPhrase(req, res);
  }
  return getAllBooks(req, res);
});

router.get("/books/:average", getAverageBooksCost);

router.get("/books/:id", getBookById);

router.post("/books", addNewBook);

module.exports = router;
