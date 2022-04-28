import pkg from "mongoose";
const { Schema } = pkg;
export const issueSchema = new Schema({
  IssueId: {
    type: Number,
    allownull: false,
    required: true, // TODO-AUTO
  },
  IssueType: {
    type: String,
    allownull: false,
    required: true,
    enum: ["Defect", "Story", "Change Request"],
  },
  Title: {
    type: String,
    allownull: false,
    required: true,
  },
  Project: {
    type: String,
    allownull: false,
    required: true,
  },
  AssignedTo: {
    type: String,
    allownull: false,
    required: true,
  },
  CreatedBy: {
    type: String,
    allownull: false,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: new Date(),
  },
  Status: {
    type: String,
    allownull: false,
    required: true,
  },
  isActive: {
    type: Boolean,
    allownull: false,
    required: true,
  },
});
