import pkg from "mongoose";
import m2s from "mongoose-to-swagger";
import msequence from "mongoose-sequence";
const { Schema, mongoose } = pkg;
const AutoIncrement = msequence(mongoose);
const issueSchema = new Schema({
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
  Description: {
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

issueSchema.plugin(AutoIncrement, { inc_field: "IssueId" });
export const issueModel = mongoose.model("issues", issueSchema);
export const swaggerIssueSchema = {
  Issue: m2s(issueModel),
};
