import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload | undefined;
    }
  }
}

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

export default verifyJWT;
