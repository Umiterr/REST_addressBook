import * as fs from "fs";
import path from "path";
import Book from "../models/books";
import { Request, Response } from "express";

// Retrieve all books from the database.
export const getAllBooks = (req: Request, res: Response): void => {
  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");

  try {
    const rawData = fs.readFileSync(filePath);
    const books: Book[] = JSON.parse(rawData.toString());

    if (books.length === 0) {
      res
        .status(404)
        .setHeader("Content-Type", "application/json")
        .send({ error: "No books were found." });
      return;
    }

    res.status(200).send({ data: books });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error reading the file:", error.message);
    } else {
      console.error("Error reading the file:", error);
    }
    res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send({ error: "Internal server error" });
  }
};

// Search for the book by the provided ID.
export const getBookById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");

  try {
    const rawData = fs.readFileSync(filePath);
    const books: Book[] = JSON.parse(rawData.toString());

    const book = books.find((book) => book.id === id);

    if (!book) {
      res
        .status(400)
        .setHeader("Content-Type", "application/json")
        .send({ error: `No book found with the ID ${id}` });
      return;
    }

    res.status(200).send({ data: book });
  } catch (error) {
    console.error("Error reading the file:", error);
    res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send({ error: "Internal server error" });
  }
};

// Get books from param price
export const getBooksByPrice = (req: Request, res: Response) => {
  const priceStr = req.query.price as string;
  const price = parseFloat(priceStr);
  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");
  const rawData = fs.readFileSync(filePath);
  const books: Book[] = JSON.parse(rawData.toString());

  if (!price || isNaN(price)) {
    return res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .json({ message: "Price must be a number" });
  }

  const filteredBooks = books.filter((book) => book.price > price);

  if (filteredBooks.length === 0) {
    return res
      .status(404)
      .setHeader("Content-Type", "application/json")
      .json({ message: "No books found" });
  }

  return res
    .status(200)
    .setHeader("Content-Type", "application/json")
    .json(filteredBooks);
};

// Add new book
export const addNewBook = (req: Request, res: Response): void => {
  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");
  const {
    title,
    author,
    price,
    publishedDate,
    availability,
    num_reviews,
    stars,
    description,
  } = req.body;

  if (
    !title ||
    !author ||
    !price ||
    !publishedDate ||
    !availability ||
    !num_reviews ||
    !stars ||
    !description
  ) {
    res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .send({ error: "All fields are mandatory." });
    return;
  }

  try {
    const rawData = fs.readFileSync(filePath);
    const books: Book[] = JSON.parse(rawData.toString());

    const newBook: Book = {
      id: (books.length + 1).toString(),
      title,
      author,
      price: parseFloat(price),
      availability,
      num_reviews,
      stars,
      description,
    };

    books.push(newBook);

    fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .send({ data: newBook });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error reading or writing the file:", error.message);
    } else {
      console.error("Error reading or writing the file:", error);
    }
    res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send({ error: "Internal server error" });
  }
};

// Find book by phrase
export const getBooksByPhrase = (req: Request, res: Response): void => {
  const phrase = req.query.phrase as string;

  if (!/^[a-zA-Z]+$/.test(phrase)) {
    res
      .status(400)
      .setHeader("Content-Type", "application/json")
      .send({ error: "The phrase must contain only alphabet letters." });
    return;
  }

  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");

  try {
    const rawData = fs.readFileSync(filePath);
    const books: Book[] = JSON.parse(rawData.toString());

    const filteredBooks = books.filter((book) => {
      const phraseRegex = new RegExp(
        phrase.toLowerCase().split("").join(".*"),
        "i"
      );
      return phraseRegex.test(book.author.toLowerCase());
    });

    if (filteredBooks.length === 0) {
      res
        .status(404)
        .setHeader("Content-Type", "application/json")
        .send({ error: "No books found with the given phrase." });
      return;
    }

    res
      .status(200)
      .setHeader("Content-Type", "application/json")
      .send({ data: filteredBooks });
  } catch (error) {
    console.error("Error reading the file:", error);
    res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send({ error: "Internal server error." });
  }
};
// Get average price of books

export const getAverageBooksCost = (req: Request, res: Response): void => {
  const filePath = path.resolve(__dirname, "../MOCK_DATA.json");

  try {
    const rawData = fs.readFileSync(filePath);
    const books: Book[] = JSON.parse(rawData.toString());

    if (books.length === 0) {
      res
        .status(404)
        .setHeader("Content-Type", "application/json")
        .send({ error: "No books found." });
      return;
    }

    const totalBooks = books.length;
    const totalCost = books.reduce((acc, book) => acc + book.price, 0);
    const averageCost = totalCost / totalBooks;

    const averageCostFormatted = parseFloat(averageCost.toFixed(2));

    res.status(200).json({ averageCost: averageCostFormatted });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error reading the file:", error.message);
    } else {
      console.error("Error reading the file:", error);
    }
    res
      .status(500)
      .setHeader("Content-Type", "application/json")
      .send({ error: "Internal server error" });
  }
};
