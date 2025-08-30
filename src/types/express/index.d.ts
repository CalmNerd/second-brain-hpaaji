import { User } from "../custom";

export { }

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            userId?:  number;
            id?: number;
        }
    }
}