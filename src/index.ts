import express from "express";
import { ContentModel, LinkModel, UserModel } from "./db.js";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import { generateRandomString } from "./utils.js";
import cors from "cors";

const app = express();
app.use(express.json());


//fix cors error
app.use(cors({
    origin: "http://localhost:5173", // or "*" for all
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.post("/api/v1/signup", async (req, res) => {
    // todo: zod validation and password hashing
    const username = req.body.username;
    const password = req.body.password;
    const exitingUser = await UserModel.findOne({
        username: username
    })
    if (exitingUser) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

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

app.post("/api/v1/content/delete", userMiddleware, async (req, res) => {
    await ContentModel.deleteOne({
        contentId: req.body.contentId,
        userId: req.userId
    })

    res.json({
        message: "content deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    const hash = generateRandomString(10);
    const exitingLink = await LinkModel.findOne({
        userId: req.userId
    })
    if (share) {
        if (exitingLink) {
            res.json({
                message: "Link already exists:" + exitingLink.hash
            })
            return;
        }
        await LinkModel.create({
            hash: hash,
            userId: req.userId
        })
        res.json({
            message: "Link updated : " + hash
        })
    } else {
        await LinkModel.deleteOne({
            userId: req.userId
        })
        res.json({
            message: "Link revoked"
        })
    }

})


app.get("/api/v1/brain/share/:sharedLink", async (req, res) => {
    const sharedLink = req.params.sharedLink;
    const link = await LinkModel.findOne({
        hash: sharedLink
    })
    if (link) {
        const content = await ContentModel.find({
            userId: link.userId
        })
        const user = await UserModel.findOne({
            _id: link.userId
        })
        if (user) {
            res.json({
                content,
                user: user.username
            })
        } else {
            res.status(404).json({
                message: "User not found"
            })
        }
        return;
    } else {
        return res.status(404).json({
            message: "Link not found"
        })
    }
})


const port = 3001
app.listen(port);
console.log("listening to port: ", port);
