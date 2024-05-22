import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        requires: true
    },

    username: {
        type: String,
        requires: true,
        unique: true
    },

    password: {
        type: String,
        requires: true,
        minLength: 6
    },

    gender: {
        type: String,
        requires: true,
        enum: ["male", "female"]
    },

    profilePic: {
        type: String,
        default: ""
    },

}, {timestamps : true})

const User = mongoose.model("User", userSchema);

export default User;
