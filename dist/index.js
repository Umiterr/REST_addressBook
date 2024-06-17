"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = require("./middlewares/auth");
const PORT = process.env.PORT || 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        // Middleware
        app.use(body_parser_1.default.json());
        app.use(body_parser_1.default.urlencoded({ extended: true }));
        const userRouter = require("./routes/user");
        const booksRouter = require("./routes/books");
        // Authentication middleware
        app.use(auth_1.authMiddleware);
        // Rutas
        app.use("/auth", userRouter);
        app.use("/", booksRouter);
        // Middleware to handle not found routes
        app.use((_req, res) => {
            res.status(404).send({ error: "Resource not found", status: 404 });
        });
        // Middleware to handle errors
        app.use((err, _req, res, _next) => {
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
    });
}
startServer().catch((err) => console.error("Error starting the server:", err));
