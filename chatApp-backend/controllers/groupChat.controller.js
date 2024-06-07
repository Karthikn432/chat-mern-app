import GroupChat from '../models/groupChat.model.js';
import User from '../models/user.model.js';
import { getReceiverSocketId } from '../socket/socket.js';
import Message from "../models/message.model.js";



export const createGroupChat = async (req, res) => {
    try {
        const { groupName, participants } = req.body;
        const adminId = req.user.id;

        if (!groupName) {
            return res.status(400).json({ error: "Group name is required" });
        }

        if (!participants || participants.length === 0) {
            return res.status(400).json({ error: "At least one participant is required" });
        }

        const isAlreadyGroupExist = await GroupChat.findOne({ name: groupName });

        if (isAlreadyGroupExist) {
            return res.status(400).json({
                success: false, errors: [
                    { name: "groupName", message: "Group name already exists" }
                ]
            });
        }

        // Check if admin user exists
        const admin = await User.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: "Admin user not found" });
        }

        // Extract ids from participants array
        const participantIds = participants.map(participant => participant.id);

        // Create new group
        const newGroup = new GroupChat({
            name: groupName,
            admin: adminId,
            participants: [adminId, ...participantIds]
        });

        await newGroup.save();

        // Emit event to all participants
        const participantsWithAdmin = [adminId, ...participantIds];
        participantsWithAdmin.forEach(participantId => {
            const receiverSocketId = getReceiverSocketId(participantId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newGroupChat", newGroup);
            }
        });


        res.status(201).json({
            _id: newGroup._id,
            name: newGroup.name,
            admin: newGroup.admin,
            participants: newGroup.participants
        });
    } catch (error) {
        console.error("Error creating group:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getGroupChatsForParticipants = async (req, res) => {
    const userId = req.user._id;

    try {
        const groupChats = await GroupChat.find({ participants: userId })
            .populate('admin', 'fullName profilePic')
            .populate('participants', 'fullName profilePic');

        res.status(200).json(groupChats);
    } catch (error) {
        console.log("Error in getGroupChatsForParticipants controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getUsersAndGroupChats = async (req, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 20;
    const searchTerm = req.query.search || '';

    try {
        const userQuery = { _id: { $ne: userId } };
        if (searchTerm) {
            userQuery.fullName = { $regex: new RegExp(searchTerm, 'i') };
        };

        const totalCount = await User.countDocuments(userQuery);
        const pageCount = Math.ceil(totalCount / perPage);
        const users = await User.find(userQuery)
            .select('-password')
            .skip((page - 1) * perPage)
            .limit(perPage);

        const userWithUnviewedCount = await Promise.all(
            users.map(async (user) => {
                const unviewedCount = await Message.countDocuments({
                    receiverId: userId,
                    senderId: user._id,
                    viewed: false,
                });
                return {
                    ...user.toObject(),
                    unviewedCount,
                };
            })
        );

        // Fetch group chats the logged-in user is part of
        const userGroups = await GroupChat.find({ participants: userId })
            .populate('admin', 'fullName profilePic')
            .populate('participants', 'fullName profilePic');

        const response = {
            page,
            per_page: perPage,
            total_pages: pageCount,
            total_records: totalCount,
            filteredUsers: userWithUnviewedCount,
            // userWithUnviewedCount,
            userGroups
        };

        res.status(200).json(response);
    } catch (error) {
        console.log("Error in getUsersAndGroupChats controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
