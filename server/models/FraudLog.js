import mongoose from "mongoose";

const FraudLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reason: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("FraudLog", FraudLogSchema);
