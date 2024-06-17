"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAverageBooksCost = exports.getBooksByPhrase = exports.addNewBook = exports.getBooksByPrice = exports.getBookById = exports.getAllBooks = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// Retrieve all books from the database.
const getAllBooks = (req, res) => {
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    try {
        const rawData = fs.readFileSync(filePath);
        const books = JSON.parse(rawData.toString());
        if (books.length === 0) {
            res
                .status(404)
                .setHeader("Content-Type", "application/json")
                .send({ error: "No books were found." });
            return;
        }
        res.status(200).send({ data: books });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error reading the file:", error.message);
        }
        else {
            console.error("Error reading the file:", error);
        }
        res
            .status(500)
            .setHeader("Content-Type", "application/json")
            .send({ error: "Internal server error" });
    }
};
exports.getAllBooks = getAllBooks;
// Search for the book by the provided ID.
const getBookById = (req, res) => {
    const { id } = req.params;
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    try {
        const rawData = fs.readFileSync(filePath);
        const books = JSON.parse(rawData.toString());
        const book = books.find((book) => book.id === id);
        if (!book) {
            res
                .status(400)
                .setHeader("Content-Type", "application/json")
                .send({ error: `No book found with the ID ${id}` });
            return;
        }
        res.status(200).send({ data: book });
    }
    catch (error) {
        console.error("Error reading the file:", error);
        res
            .status(500)
            .setHeader("Content-Type", "application/json")
            .send({ error: "Internal server error" });
    }
};
exports.getBookById = getBookById;
// Get books from param price
const getBooksByPrice = (req, res) => {
    const priceStr = req.query.price;
    const price = parseFloat(priceStr);
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    const rawData = fs.readFileSync(filePath);
    const books = JSON.parse(rawData.toString());
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
exports.getBooksByPrice = getBooksByPrice;
// Add new book
const addNewBook = (req, res) => {
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    const { title, author, price, publishedDate, availability, num_reviews, stars, description, } = req.body;
    if (!title ||
        !author ||
        !price ||
        !publishedDate ||
        !availability ||
        !num_reviews ||
        !stars ||
        !description) {
        res
            .status(400)
            .setHeader("Content-Type", "application/json")
            .send({ error: "All fields are mandatory." });
        return;
    }
    try {
        const rawData = fs.readFileSync(filePath);
        const books = JSON.parse(rawData.toString());
        const newBook = {
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error reading or writing the file:", error.message);
        }
        else {
            console.error("Error reading or writing the file:", error);
        }
        res
            .status(500)
            .setHeader("Content-Type", "application/json")
            .send({ error: "Internal server error" });
    }
};
exports.addNewBook = addNewBook;
// Find book by phrase
const getBooksByPhrase = (req, res) => {
    const phrase = req.query.phrase;
    if (!/^[a-zA-Z]+$/.test(phrase)) {
        res
            .status(400)
            .setHeader("Content-Type", "application/json")
            .send({ error: "The phrase must contain only alphabet letters." });
        return;
    }
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    try {
        const rawData = fs.readFileSync(filePath);
        const books = JSON.parse(rawData.toString());
        const filteredBooks = books.filter((book) => {
            const phraseRegex = new RegExp(phrase.toLowerCase().split("").join(".*"), "i");
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
    }
    catch (error) {
        console.error("Error reading the file:", error);
        res
            .status(500)
            .setHeader("Content-Type", "application/json")
            .send({ error: "Internal server error." });
    }
};
exports.getBooksByPhrase = getBooksByPhrase;
// Get average price of books
const getAverageBooksCost = (req, res) => {
    const filePath = path_1.default.resolve(__dirname, "../MOCK_DATA.json");
    try {
        const rawData = fs.readFileSync(filePath);
        const books = JSON.parse(rawData.toString());
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
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error reading the file:", error.message);
        }
        else {
            console.error("Error reading the file:", error);
        }
        res
            .status(500)
            .setHeader("Content-Type", "application/json")
            .send({ error: "Internal server error" });
    }
};
exports.getAverageBooksCost = getAverageBooksCost;
