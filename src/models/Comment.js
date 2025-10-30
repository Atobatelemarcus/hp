import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String },
    text: { type: String, required: true },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    author: { type: String },
    text: { type: String, required: true },
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },
    reactedUsers: {
      type: Map,
      of: String, // { userId: "like" }
      default: () => new Map(), // ✅ correct Map default
    },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);
