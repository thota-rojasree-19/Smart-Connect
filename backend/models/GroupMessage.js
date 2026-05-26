import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    fileUrl: { type: String, default: null },
    fileType: { type: String, enum: ["image", "pdf", "audio", "text"], default: "text" },
    fileName: { type: String, default: null },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("GroupMessage", groupMessageSchema);
