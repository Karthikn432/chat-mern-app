import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    path: {
        type: String,
    },
    type: {
        type: String,
    },
    name: {
        type: String,
    },
    size: {
        type: String,
    }
});

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

    filepath: [fileSchema],  // Modified to accept an array of files

    repliedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: null
    },

    editedAt: {
        type: Date,
        default: null
    },

    viewed: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    });

// Custom validator to ensure either 'message' or 'filepath' is provided
messageSchema.path('message').validate(function (value) {
    return value || (this.filepath && this.filepath.length > 0 && this.filepath.some(file => file.path));
}, 'Either message or filepath must be provided.');

const Message = mongoose.model("Message", messageSchema);

export default Message;
