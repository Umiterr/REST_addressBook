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
exports.userLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
// Finds User by username and password
function findUserByCredentials(user, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path_1.default.resolve(__dirname, "../USERS.json");
        const rawData = fs.readFileSync(filePath);
        const userData = JSON.parse(rawData.toString());
        const foundUser = userData.find((u) => u.user === user && u.password === password);
        if (foundUser) {
            return foundUser;
        }
        else {
            throw new Error("Invalid credentials");
        }
    });
}
// Login user
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, password } = req.body;
    try {
        if (!user || !password) {
            res.status(400).send({ message: "Username and password are required." });
            return;
        }
        const foundUser = yield findUserByCredentials(user, password);
        const token = jsonwebtoken_1.default.sign({ _id: foundUser.user }, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });
        res.send({ token });
    }
    catch (err) {
        const foundUser = yield findUserByCredentials(user, password);
        res.status(401).send("Unauthorized access.");
    }
});
exports.userLogin = userLogin;
