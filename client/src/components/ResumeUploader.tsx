import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API } from "@/config";

interface Props {
  onAnalysisComplete: (analysis: any, id: string) => void;
}

export default function ResumeUploader({ onAnalysisComplete }: Props) {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"file" | "text">("text");

  // 🔹 Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
      setResumeText(""); // clear text if file uploaded
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  // 🔥 Analyze function
  const analyze = async () => {
    if (!resumeText.trim() && !file) {
      toast({
        title: "Please add resume content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Unauthorized",
          description: "Please login again",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (file) {
        formData.append("resumeFile", file);
      } else {
        formData.append("resumeText", resumeText.trim());
      }

      formData.append("jobRole", jobRole.trim() || "");

      const response = await fetch(
        `${API}/api/resume/analyze`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      onAnalysisComplete(data.data, data.data._id);

      toast({
        title: "Analysis complete! 🎉",
      });

      // Clear after success
      setFile(null);
      setResumeText("");
    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle Mode */}
      <div className="flex gap-2">
        {(["text", "file"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setInputMode(mode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              inputMode === mode
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground bg-muted/50"
            }`}
            style={
              inputMode === mode
                ? { background: "var(--gradient-primary)" }
                : {}
            }
          >
            {mode === "text" ? "Paste Text" : "Upload PDF"}
          </button>
        ))}
      </div>

      {/* TEXT MODE */}
      {inputMode === "text" ? (
        <div className="space-y-2">
          <Label>Paste Your Resume</Label>
          <textarea
            className="w-full h-48 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
        </div>
      ) : (
        /* FILE MODE */
        <div>
          {!file ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">Drop your resume here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Supports .pdf and .txt
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 glass rounded-xl border border-border/50">
              <FileText className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Job Role */}
      <div className="space-y-2">
        <Label>
          Target Job Role{" "}
          <span className="text-muted-foreground text-xs">(optional)</span>
        </Label>
        <Input
          placeholder="e.g. Frontend Developer, Data Analyst"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <Button
        onClick={analyze}
        disabled={loading}
        className="w-full font-bold py-5 text-base"
        style={{ background: "var(--gradient-primary)" }}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Analyzing with AI...
          </>
        ) : (
          "Analyze My Resume"
        )}
      </Button>
    </div>
  );
}