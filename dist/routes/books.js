"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const { getAllBooks, getBookById, getBooksByPrice, addNewBook, getBooksByPhrase, getAverageBooksCost, } = require("../controllers/books");
router.get("/books", (req, res) => {
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
