"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { JWT_SECRET } = process.env;
const unprotectedRoutes = ["/auth"];
const authMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        if (unprotectedRoutes.includes(req.path)) {
            return next();
        }
        return res.status(400).send({ message: "Authorization required." });
    }
    const token = authorization.replace("Bearer ", "");
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("Token verified successfully. Payload content:", payload);
    }
    catch (err) {
        console.error("Error verifying the token:", err);
        return res.status(401).send({ message: "Authorization is required" });
    }
    req.user = payload;
    next();
};
exports.authMiddleware = authMiddleware;
