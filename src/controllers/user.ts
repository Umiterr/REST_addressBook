import { Request, Response } from "express";
import UserCredentials from "../models/user";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import path from "path";

// Finds User by username and password
async function findUserByCredentials(
  user: string,
  password: string
): Promise<UserCredentials> {
  const filePath = path.resolve(__dirname, "../USERS.json");

  const rawData = fs.readFileSync(filePath);
  const userData: UserCredentials[] = JSON.parse(rawData.toString());

  const foundUser = userData.find(
    (u) => u.user === user && u.password === password
  );

  if (foundUser) {
    return foundUser;
  } else {
    throw new Error("Invalid credentials");
  }
}

// Login user
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { user, password } = req.body as { user: string; password: string };

  try {
    if (!user || !password) {
      res.status(400).send({ message: "Username and password are required." });
      return;
    }

    const foundUser = await findUserByCredentials(user, password);

    const token = jwt.sign(
      { _id: foundUser.user },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "1h",
      }
    );

    res.send({ token });
  } catch (err) {
    const foundUser = await findUserByCredentials(user, password);
    res.status(401).send("Unauthorized access.");
  }
};
