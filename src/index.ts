import express from "express";
import { ContentModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());


app.post("/api/v1/signup", async (req, res) => {
    // todo: zod validation and password hashing
    const username = req.body.username;
    const password = req.body.password;

    await UserModel.create({
        username: username,
        password: password
    })

    //handle status code and messages for other cases like if user exists, or username or password not found
    res.json({
        message: "User Created!"
    })

})
app.post("/api/v1/signin", async (req, res) => {

    // todo: zod validation and password hashing
    const username = req.body.username;
    const password = req.body.password;

    const exitingUser = await UserModel.findOne({
        username: username,
        password: password
    })

    if (exitingUser) {
        const token = jwt.sign({
            id: exitingUser._id
        }, JWT_PASSWORD)
        res.json({
            token
        })
    } else {
        res.status(411).json({
            message: "failed to sign in"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    const description = req.body.description;

    await ContentModel.create({
        link,
        title,
        description,
        type,
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "content added!"
    })

})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId;

    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username") //populate is used to add complete data of reference foreign key and we can also select what to choose from the collection

    res.json({
        content
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    await ContentModel.deleteMany({
        contentId: req.body.contentId,
        userId: req.userId
    })

    res.json({
        message: "content deleted"
    })
})


const port = 3001
app.listen(port);
console.log("listening to port: ", port);
