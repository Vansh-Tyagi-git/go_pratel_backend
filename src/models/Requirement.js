import mongoose from "mongoose";

const RequirementSchema = new mongoose.Schema(
  {
    event: {
      name: { type: String, required: true },
      type: { type: String, required: true },
      dateType: { type: String, enum: ["single", "range"], required: true },
      date: { type: String },
      startDate: { type: String },
      endDate: { type: String },
      location: { type: String, required: true },
      venue: { type: String }
    },
    hireType: { type: String, enum: ["planner", "performer", "crew"], required: true },
    details: { type: Object, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Requirement", RequirementSchema);
