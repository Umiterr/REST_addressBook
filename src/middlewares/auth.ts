import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

const unprotectedRoutes = ["/auth"];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    if (unprotectedRoutes.includes(req.path)) {
      return next();
    }
    return res.status(400).send({ message: "Authorization required." });
  }

  const token = authorization.replace("Bearer ", "");
  let payload: string;

  try {
    payload = jwt.verify(token, JWT_SECRET as string) as string;
    console.log("Token verified successfully. Payload content:", payload);
  } catch (err) {
    console.error("Error verifying the token:", err);
    return res.status(401).send({ message: "Authorization is required" });
  }

  req.user = payload;

  next();
};
