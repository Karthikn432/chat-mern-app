import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    message: {
        type: String,
    },
    
    filepath: {
        path: {
            type: String,
        },
        type: {
            type: String,
        }
    }
},
    { 
        timestamps: true 
    }
);

// Custom validator to ensure either 'message' or 'filepath' is provided
messageSchema.path('message').validate(function(value) {
    return value || (this.filepath && this.filepath.path);
}, 'Either message or filepath must be provided.');

messageSchema.path('filepath.path').validate(function(value) {
    return value || this.message;
}, 'Either message or filepath must be provided.');

const Message = mongoose.model("Message", messageSchema);

export default Message;