import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD) as CustomJwtPayload;

    if (decoded){
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "please login first!"
        })
    }
}