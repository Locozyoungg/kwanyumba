import mongoose from "mongoose";

const BlacklistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Blacklist", BlacklistSchema);
