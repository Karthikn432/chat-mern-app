import path from "path";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Group from "../models/groupChat.model.js";

import { getReceiverSocketId, io } from "../socket/socket.js";
import fs from 'fs'
import { upload } from "../middlewares/multerUpload.js";
const __dirname = path.resolve()

export const sendMessage = async (req, res) => {
    try {
        const { message, fileUrls, repliedTo } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation;

        // Check if the receiverId is a group ID
        const isGroupChat = await Group.findById(receiverId);
        console.log({isGroupChat})
        if (isGroupChat) {
            // For group chat, find or create the conversation based on the group ID
            conversation = await Conversation.findOne({ group: receiverId });

            if (!conversation) {
                conversation = await Conversation.create({
                    group: receiverId,
                    isGroupConversation: true,
                });
            }
        } else {
            // For one-to-one chat, find or create the conversation based on the participants
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId],
                });
            }
        }

        const newMessageData = {
            senderId,
            receiverId,
            message,
            filepath: [],
        };

        if (fileUrls && fileUrls.length > 0) {
            newMessageData.filepath = fileUrls.map(file => ({
                path: file.path,
                type: file.type,
                name: file.name,
                size: file.size,
            }));
        }

        if (repliedTo) {
            newMessageData.repliedTo = repliedTo;
        }

        const newMessage = new Message(newMessageData);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        // Send socket events
        if (isGroupChat) {
            for (const participantId of isGroupChat.participants) {
                const participantSocketId = getReceiverSocketId(participantId);
                if (participantSocketId) {
                    io.to(participantSocketId).emit("newMessage", newMessage,isGroupChat, participantId);
                }
            }
        } else {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        let conversation;

        // Check if the userToChatId is a group ID
        const isGroupChat = await Group.findById(userToChatId);

        if (isGroupChat) {
            // For group chat, find the conversation based on the group ID
            conversation = await Conversation.findOne({ group: userToChatId });
        } else {
            // For one-to-one chat, find the conversation based on the participants
            conversation = await Conversation.findOne({
                participants: { $all: [senderId, userToChatId] }
            });
        }

        if (!conversation) {
            return res.status(200).json([]);
        }

        // Populate messages with details
        await conversation.populate({
            path: "messages",
            populate: {
                path: "repliedTo",
                model: "Message"
            }
        });

        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const editMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        const { message, fileUrls } = req.body;  // Adjusted to accept multiple files
        const senderId = req.user._id;

        const messageToEdit = await Message.findOne({ _id: messageId, senderId });
        console.log({messageToEdit})
        if (!messageToEdit) {
            return res.status(404).json({ error: "Message not found or you're not authorized to edit this message" });
        }

        if (message) {
            messageToEdit.message = message;
        }

        if (fileUrls && fileUrls.length > 0) {
            // Replace the existing files with the new files
            messageToEdit.filepath = fileUrls.map(file => ({
                path: file.path,
                type: file.type,
                name: file.name,
                size: file.size,
            }));
        }

        messageToEdit.editedAt = new Date();

        await messageToEdit.save();

        // SOCKET IO Functionality to notify about the edited message
        // const receiverSocketId = getReceiverSocketId(messageToEdit.receiverId);
        // if (receiverSocketId) {
        //     io.to(receiverSocketId).emit("editedMessage", messageToEdit);
        // }

        const isGroupChat = await Group.findById(messageToEdit.receiverId);
        console.log({isGroupChat})
        if (isGroupChat) {
            for (const participantId of isGroupChat.participants) {
                const participantSocketId = getReceiverSocketId(participantId);
                if (participantSocketId) {
                    console.log({participantSocketId})
                    io.to(participantSocketId).emit("editedMessage", messageToEdit);
                }
            }
        } else {
            const receiverSocketId = getReceiverSocketId(messageToEdit.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("editedMessage", messageToEdit);
            }
        }

        res.status(200).json(messageToEdit);

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const deleteMessage = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        console.log({ messageId })
        const senderId = req.user._id;

        const messageToDelete = await Message.findOneAndDelete({ _id: messageId, senderId });

        if (!messageToDelete) {
            return res.status(404).json({ error: "Message not found or you're not authorized to delete this message" });
        }

        // Remove message reference from the conversation
        await Conversation.updateOne(
            { participants: { $all: [senderId, messageToDelete.receiverId] } },
            { $pull: { messages: messageId } }
        );

        // SOCKET IO Functionality to notify about the deleted message
        const receiverSocketId = getReceiverSocketId(messageToDelete.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("deletedMessage", messageId);
        }

        res.status(200).json({ message: "Message deleted successfully" });

    } catch (error) {
        console.log("Error in message controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
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
        const { id } = req.params;
        if (!id) {
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
        console.log({ file })
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
            size: file.size,
            fileName: file.originalname,
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


export const getUnreadMessagesCount = async (req, res) => {
    try {
        const { id } = req.params;
        const unreadCount = await Message.countDocuments({
            senderId : id,
            viewed: false
        });
        console.log({id, unreadCount})


        res.status(200).json({ unreadCount });
    } catch (error) {
        console.error("Error in getUnreadMessagesCount controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const markMessagesAsViewed = async (req, res) => {
    const { messageIds } = req.body; // Expecting an array of message IDs
    try {
        console.log({messageIds})
        await Message.updateMany(
            { _id: { $in: messageIds } },
            { $set: { viewed: true } }
        );
        res.status(200).send({ success: true, message: 'Messages marked as viewed.' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error marking messages as viewed.', error });
    }
};
// export const deleteMessage = async (req, res) => {
//     try {
//         const { id: messageId } = req.params;
//         const senderId = req.user._id;

//         const messageToDelete = await Message.findOne({ _id: messageId, senderId });

//         if (!messageToDelete) {
//             return res.status(404).json({ error: "Message not found or you're not authorized to delete this message" });
//         }

//         // Delete the message
//         await messageToDelete.remove();

//         const receiverSocketId = getReceiverSocketId(messageToDelete.receiverId);
//         if (receiverSocketId) {
//             io.to(receiverSocketId).emit("deletedMessage", messageId);
//         }

//         res.status(200).json({ message: "Message deleted successfully" });

//     } catch (error) {
//         console.log("Error in message controller", error.message);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// }