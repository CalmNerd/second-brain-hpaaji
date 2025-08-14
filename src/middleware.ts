import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, JWT_PASSWORD)

    if (decoded){
        //figure out how to override the type of express request object, for now ignoring
        //@ts-ignore
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "please login first!"
        })
    }
}