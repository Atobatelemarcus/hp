import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // Basic post info
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    content: { type: String, required: true },
    author: { type: String, required: true },

    // ✅ Reaction counts (numeric, synced with in-memory user reactions)
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },

    // ✅ Comments linked to post
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
