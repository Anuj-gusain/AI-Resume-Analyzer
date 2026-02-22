import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    file_name: String,
    job_role: String,
    resume_text: { type: String, required: true },

    overall_score: Number,
    ats_score: Number,
    skills_score: Number,
    experience_score: Number,
    education_score: Number,

    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    skills_found: [String],
    missing_skills: [String],

    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

export default mongoose.model("ResumeAnalysis", resumeSchema);