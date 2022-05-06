import pkg from "mongoose";
import m2s from "mongoose-to-swagger";
const { Schema, mongoose } = pkg;
const issueHistorySchema = new Schema({
  IssueId: {
    type: Number,
    allownull: false,
    required: true,
  },
  Updates: [
    {
      FieldName: {
        type: String,
        allownull: false,
        required: true,
      },
      PrevValue: {
        type: String,
        allownull: false,
        required: true,
      },
      NewValue: {
        type: String,
        allownull: false,
        required: true,
      },
      UpdatedBy: {
        type: String,
        allownull: false,
        required: true,
      },
      UpdateAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

export const issueHistoryModel = mongoose.model(
  "issuehistories",
  issueHistorySchema
);
export const swaggerIssueHisotrySchema = {
  IssueHistory: m2s(issueHistoryModel),
};
