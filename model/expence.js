import mongoose from "mongoose";
const expenceSchema = new mongoose.Schema({
  name: { type: String },
  amount: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Expences", expenceSchema);
