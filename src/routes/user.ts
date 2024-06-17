import express from "express";

const router = express.Router();

const { userLogin } = require("../controllers/user");

router.post("/", userLogin);

module.exports = router;
