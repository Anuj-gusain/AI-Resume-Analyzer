import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Brain,
  LogOut,
  FileText,
  Plus,
  Clock,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import AnalysisResult from "@/components/AnalysisResult";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [view, setView] = useState<"history" | "analyze" | "result">("history");
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const token = localStorage.getItem("token");

  // 🔐 If no token → redirect
  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // 📜 Fetch history from backend
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);

      const response = await fetch(
        "http://localhost:5000/api/resume/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setHistory(data);
    } catch (err: any) {
      toast({
        title: "Failed to load history",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalysisComplete = (analysis: any) => {
    setCurrentAnalysis(analysis);
    setView("result");
    fetchHistory();
  };

  // 📄 Load single analysis
  const loadAnalysis = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/resume/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setCurrentAnalysis(data);
      setView("result");
    } catch (err: any) {
      toast({
        title: "Failed to load",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // 🚪 Logout
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const scoreColor = (s: number) =>
    s >= 75
      ? "hsl(145 60% 45%)"
      : s >= 50
      ? "hsl(38 100% 55%)"
      : "hsl(0 80% 60%)";

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Navbar */}
      <nav className="glass border-b border-border/30 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">ResumeAI</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-destructive gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["history", "analyze", ...(currentAnalysis ? ["result"] : [])].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setView(tab as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  view === tab
                    ? "text-primary-foreground"
                    : "text-muted-foreground bg-muted/50"
                }`}
                style={
                  view === tab
                    ? { background: "var(--gradient-primary)" }
                    : {}
                }
              >
                {tab === "history"
                  ? "My Analyses"
                  : tab === "analyze"
                  ? "New Analysis"
                  : "Last Result"}
              </button>
            )
          )}
        </div>

        {/* Analyze */}
        {view === "analyze" && (
          <Card className="glass border-border/50 max-w-2xl">
            <CardHeader>
              <CardTitle>Analyze Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumeUploader
                onAnalysisComplete={handleAnalysisComplete}
              />
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {view === "result" && currentAnalysis && (
          <AnalysisResult analysis={currentAnalysis} />
        )}

        {/* History */}
        {view === "history" && (
          <div className="space-y-4">
            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : history.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No analyses yet
              </p>
            ) : (
              history.map((item) => (
                <Card
                  key={item._id}
                  className="cursor-pointer"
                  onClick={() => loadAnalysis(item._id)}
                >
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {item.file_name || "Resume"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          color: scoreColor(item.overall_score || 0),
                        }}
                      >
                        {item.overall_score || 0}
                      </span>
                      /100
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}