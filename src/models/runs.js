import mongoose from "mongoose";

const runSchema = new mongoose.Schema({
  distance: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export const Run = mongoose.model("Run", runSchema);
