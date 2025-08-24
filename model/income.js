import mongoose from "mongoose";
const incomeSchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Income", incomeSchema);
