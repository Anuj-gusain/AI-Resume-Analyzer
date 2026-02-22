import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Zap, Shield, BarChart3, ArrowRight, CheckCircle, Star } from "lucide-react";

const features = [
  { icon: Brain, title: "AI-Powered Analysis", desc: "Gemini AI reads your resume and gives deep insights instantly." },
  { icon: Zap, title: "ATS Score", desc: "Know how well your resume passes Applicant Tracking Systems." },
  { icon: Shield, title: "Skills Gap Analysis", desc: "Find missing skills for your target job role." },
  { icon: BarChart3, title: "Detailed Scoring", desc: "Get scores for skills, experience, education, and more." },
];

const perks = [
  "Overall resume score out of 100",
  "ATS compatibility check",
  "Skills found & missing",
  "Strengths & weaknesses",
  "Actionable improvement tips",
  "History of all analyses",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "hsl(var(--primary))" }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: "hsl(var(--accent))" }} />

      {/* Navbar */}
      <nav className="relative z-10 glass border-b border-border/30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="font-semibold text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-6">
          <Star className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">AI-Powered Resume Analyzer for Freshers</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-foreground">Land Your </span>
          <span className="gradient-text">Dream Job</span>
          <br />
          <span className="text-foreground">With a Smarter Resume</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Upload your resume and get instant AI feedback — ATS score, skill gaps, strengths, and step-by-step tips to stand out as a fresher.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="gap-2 font-bold text-primary-foreground text-base px-8" style={{ background: "var(--gradient-primary)" }}>
              Analyze My Resume <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="gap-2 font-semibold border-border text-foreground hover:bg-muted">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">
          Everything You Need to <span className="gradient-text">Get Hired</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass rounded-xl p-6 border border-border/50 hover:border-primary/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:glow-primary transition-all" style={{ background: "var(--gradient-primary)" }}>
                <Icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-8">What You Get in Every Analysis</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {perks.map(perk => (
            <div key={perk} className="flex items-center gap-3 glass rounded-lg p-4 border border-border/50">
              <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
              <span className="text-foreground font-medium">{perk}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-2xl p-10 border border-primary/20 glow-primary">
          <h2 className="text-4xl font-extrabold text-foreground mb-4">Ready to Level Up?</h2>
          <p className="text-muted-foreground text-lg mb-8">Create your free account and get your first resume analyzed in seconds.</p>
          <Link to="/signup">
            <Button size="lg" className="gap-2 font-bold text-primary-foreground text-base px-10" style={{ background: "var(--gradient-primary)" }}>
              Start for Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-6 text-center text-muted-foreground text-sm">
        © 2026 ResumeAI — Built for Freshers 🚀
      </footer>
    </div>
  );
}
