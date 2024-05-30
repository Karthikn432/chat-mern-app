import path from "path";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import fs from 'fs'
import { upload } from "../middlewares/multerUpload.js";
const __dirname = path.resolve()

export const sendMessage = async (req, res) => {
    try {
        const { message, fileUrl } = req.body;
        console.log({fileUrl})
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessageData = {
            senderId,
            receiverId,
            message: message
        };

        if (fileUrl.path) {
            newMessageData.filepath = {
                path: fileUrl.path,
                type: fileUrl.type
            };
        }

        const newMessage = new Message(newMessageData);

        console.log({ newMessage })
        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        // SOCKET IO Functionality will Go Here

        const receiverSocketId = getReceiverSocketId(receiverId);
        // const senderSocketId = getReceiverSocketId(senderId);
        if (receiverSocketId) {
            // io.to(senderSocketId).emit("newMessage", newMessage)
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages"); //Not Reference But actual Messages

        if (!conversation) {
            return res.status(200).json([])
        }
        const messages = conversation.messages
        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getLastMessageTime = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const lastMessage = await Message.findOne({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

        if (!lastMessage) {
            return res.status(404).json({ message: "No messages found between the users" });
        }

        res.status(200).json({ lastMessageTime: lastMessage.createdAt });
    } catch (error) {
        console.log("Error in getLastMessageTime controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const uploadFiles = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: 'SenderId is Missing'
            });
        }
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({
                            success: false,
                            message: 'File size exceeds the maximum limit of 30MB.'
                        });
                    }
                    return res.status(500).json({
                        success: false,
                        message: 'An error occurred during the file upload process.',
                        error: err.message
                    });
                }
                resolve();
            });
        });

        const { file } = req;
        console.log({file})
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded.'
            });
        }

        return res.status(201).json({
            success: true,
            file_path: `/uploads/${id}/${file.filename}`,
            type: file.mimetype,
            size : file.size,
            fileName : file.originalname,
            message: 'Uploaded successfully',
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({
            success: false,
            message: 'An error occurred during the file upload process.',
            error: error.message
        });
    }
    // if (file) {
    //     const fileExtension = path.extname(fileMetaData.name);

    //     const uniqueFileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${fileExtension}`;

    //     // Define the full path where the file will be stored on the server
    //     const filePath = path.join(__dirname, '..', 'uploads', documentType, senderId, uniqueFileName);

    //     if (!fs.existsSync(path.dirname(filePath))) {
    //         fs.mkdirSync(path.dirname(filePath), { recursive: true });
    //     }

    //     // Decode the base64 content using the appropriate encoding (e.g., 'base64')
    //     const decodedContent = Buffer.from(fileMetaData.fileDataURL, 'base64');

    //     // Write the file to the server
    //     fs.writeFileSync(filePath, decodedContent);

    //     if (documentType == "chatUploadFile") {
    //         return filePath;
    //     }
    //     else {
    //         return res.status(201).json({
    //             success: true,
    //             file_path: `./uploads/chatMediaFile/${senderId}/` + uniqueFileName,
    //             message: "uploaded successfully",
    //         });
    //     }

    // }
};