import mongoose, { model, Schema } from "mongoose";

await mongoose.connect("mongodb+srv://calmnrd:calmnrd@secondbrain.ihidhdn.mongodb.net/secondbrain?retryWrites=true&w=majority&appName=secondbrain")
    .then(() => console.log("database connected"))
    .catch(() => console.log("failed to connect to database"));

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String
})

export const UserModel = model("User", UserSchema);


const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    description: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    // author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
})
const LinkSchema = new Schema({
    hash: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})


export const LinkModel = model("Link", LinkSchema);
export const ContentModel = model("Content", ContentSchema);