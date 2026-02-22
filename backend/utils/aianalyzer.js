import fetch from "node-fetch";

export const analyzeResumeWithAI = async (resumeText, jobRole) => {

  if (!process.env.AI_API_KEY) {
    console.log("⚠️ No AI API key found. Returning mock data.");
    return {
      overall_score: 75,
      ats_score: 70,
      skills_score: 80,
      experience_score: 65,
      education_score: 85,
      strengths: ["Good technical foundation"],
      weaknesses: ["Needs more measurable achievements"],
      suggestions: [
        "Add quantified results",
        "Improve formatting consistency",
        "Include more relevant keywords"
      ],
      skills_found: ["React", "Node.js"],
      missing_skills: ["Docker", "CI/CD"]
    };
  }

const currentYear = new Date().getFullYear();

const prompt = `
You are an expert ATS resume analyzer for fresher-level candidates.

Assume the current year is ${currentYear}.
Do NOT treat dates up to ${currentYear} as future dates.
If a date represents expected graduation or ongoing education, do not flag it as an error.
Only flag years beyond ${currentYear} as future dates.

Resume Text:
${resumeText}

Return ONLY valid JSON in this format:

{
  "overall_score": number,
  "ats_score": number,
  "skills_score": number,
  "experience_score": number,
  "education_score": number,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "skills_found": [],
  "missing_skills": []
}
`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.AI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.3
        }
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini Error:", data);
    throw new Error("Gemini API Error");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("Invalid Gemini response:", data);
    throw new Error("Invalid Gemini response");
  }

  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.error("JSON Parse Error:", clean);
    throw new Error("AI returned invalid JSON format");
  }
};