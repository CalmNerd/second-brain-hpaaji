import { User } from "../custom";
import { JwtPayload } from "jsonwebtoken";

export { }

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            userId?:  number;
            id?: number;
        }
    }
    interface CustomJwtPayload extends JwtPayload {
        id: number;
      }
}