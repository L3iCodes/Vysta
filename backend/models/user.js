import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    watch_list: [],
    watched_list: []
}, { timestamps: true })

const User = mongoose.model(`users`, userSchema)

export default User;