// const express = require('express');
// const dotenv = require("dotenv")
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';
import cors from "cors"
// import { fileURLToPath } from 'url';


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";


import connectToMongoDB from "./db/connectToMongoDB.js";
import { fileURLToPath } from "url";
import { app, server } from "./socket/socket.js";


// const app = express();
const PORT = process.env.PORt || 5000

dotenv.config()

const __dirname = path.resolve()

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000",
}));
// To Parse the incomming requests with JSON Payload from the body
app.use(express.json());
app.use(cookieParser()); 
// app.get("/", (req,res) =>{
//     res.send("Hello World!")
// });

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)


app.use(express.static(path.join(__dirname,"chatApp-frontend/dist")));

app.get("*",(req, res) => {
    res.sendFile(path.join(__dirname, "chatApp-frontend", "dist", "index.html"))
})

server.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running on port ${5000}`)
})