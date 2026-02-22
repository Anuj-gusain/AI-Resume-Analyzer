import ResumeAnalysis from "../models/Resumeanalysis.js";
import { analyzeResumeWithAI } from "../utils/aianalyzer.js";

export const analyzeResume = async (
  resumeText,
  jobRole,
  userId,
  fileName
) => {
  const analysis = await analyzeResumeWithAI(resumeText, jobRole);

  const saved = await ResumeAnalysis.create({
    user_id: userId,
    file_name: fileName,
    job_role: jobRole,
    resume_text: resumeText,
    ...analysis,
  });

  return saved;
};