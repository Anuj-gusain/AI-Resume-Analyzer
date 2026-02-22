import { CheckCircle, XCircle, Lightbulb, Code, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  analysis: {
    overall_score: number;
    ats_score: number;
    skills_score: number;
    experience_score: number;
    education_score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    skills_found: string[];
    missing_skills: string[];
    summary?: string;
  };
}

function ScoreRing({ score, label, size = 100 }: { score: number; label: string; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = score >= 75 ? "hsl(145 60% 45%)" : score >= 50 ? "hsl(38 100% 55%)" : "hsl(0 80% 60%)";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s ease-in-out" }}
        />
      </svg>
      <div className="text-center -mt-16 mb-8">
        <span className="text-2xl font-bold text-foreground">{score}</span>
        <span className="text-muted-foreground text-xs block">{label}</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? "hsl(145 60% 45%)" : score >= 50 ? "hsl(38 100% 55%)" : "hsl(0 80% 60%)";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">{label}</span>
        <span className="text-muted-foreground">{score}/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function AnalysisResult({ analysis }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary */}
      {analysis.summary && (
        <Card className="glass border-border/50">
          <CardContent className="pt-6">
            <p className="text-foreground leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Score rings */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { score: analysis.overall_score, label: "Overall" },
              { score: analysis.ats_score, label: "ATS" },
              { score: analysis.skills_score, label: "Skills" },
              { score: analysis.experience_score, label: "Experience" },
              { score: analysis.education_score, label: "Education" },
            ].map(({ score, label }) => (
              <ScoreRing key={label} score={score} label={label} size={100} />
            ))}
          </div>

          <div className="space-y-3 mt-4">
            {[
              { label: "ATS Score", score: analysis.ats_score },
              { label: "Skills", score: analysis.skills_score },
              { label: "Experience", score: analysis.experience_score },
              { label: "Education", score: analysis.education_score },
            ].map(s => <ScoreBar key={s.label} {...s} />)}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-accent" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.strengths.map((s, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{s}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weaknesses */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" style={{ color: "hsl(var(--warning))" }} /> Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.weaknesses.map((w, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "hsl(var(--warning))" }} />
                <span className="text-foreground">{w}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Found */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" /> Skills Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.skills_found.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" /> Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium border border-destructive/40 text-destructive">
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0" style={{ background: "var(--gradient-primary)" }}>
                {i + 1}
              </span>
              <span className="text-foreground text-sm">{s}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
