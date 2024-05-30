// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";




const app = express();
const __dirname = path.resolve()

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id: uploaderId } = req.params;
        // console.log({uploaderId, file})
        const uploadPath = path.join(__dirname, 'chatApp-backend', 'uploads', uploaderId);
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${path.extname(file.originalname)}`;
        cb(null, uniqueFileName);
    }
});

// Set file size limit to 30MB
export const upload = multer({
    storage: storage,
    limits: { fileSize: 30 * 1024 * 1024 }
}).single('file');

// Upload File Route
// app.post('/upload/:id', (req, res) => {
   
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
