import pkg from "mongoose";
import m2s from "mongoose-to-swagger";
const { Schema, mongoose } = pkg;
const issueSchema = new Schema({
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

export const issueModel = mongoose.model("issues", issueSchema);

export const swaggerIssueSchema = {
  Issue: m2s(issueModel),
};
