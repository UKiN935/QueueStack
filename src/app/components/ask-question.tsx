import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";

// Suggested tags — just hints, not a fixed list
const SUGGESTED_TAGS = [
  "physics", "calculus", "chemistry", "biology", "algebra",
  "javascript", "react", "nodejs", "python", "history",
  "economics", "geography", "literature", "statistics"
];

export function AskQuestion() {
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────────────
  const [title, setTitle]               = useState("");
  const [body, setBody]                 = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput]         = useState(""); // current tag being typed
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // ── Redirect if not logged in ─────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, []);

  // ── Add tag on Enter or comma ─────────────────────────────────
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && tagInput === "" && selectedTags.length > 0) {
      // remove last tag on backspace if input is empty
      setSelectedTags((prev) => prev.slice(0, -1));
    }
  };

  const addTag = (value: string) => {
    const tag = value.trim().toLowerCase().replace(/,/g, "");
    if (!tag) return;
    if (selectedTags.includes(tag)) {
      setTagInput("");
      return;
    }
    if (selectedTags.length >= 5) {
      setTagInput("");
      return; // max 5 tags
    }
    setSelectedTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  // ── Filtered suggestions ──────────────────────────────────────
  const suggestions = SUGGESTED_TAGS.filter(
    (t) => t.includes(tagInput.toLowerCase()) && !selectedTags.includes(t) && tagInput.length > 0
  );

  // ── Submit handler ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, body, tags: selectedTags }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      navigate("/");

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[760px] px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-foreground-muted text-xs font-mono tracking-widest mb-3">NEW DOUBT</p>
        <h1 className="heading text-4xl text-foreground">Ask a Question</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Title */}
        <div>
          <label className="heading text-xs tracking-widest text-foreground-muted block mb-3">
            TITLE
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How do I solve this differential equation?"
            required
            className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-4 focus:outline-none focus:border-lime transition-colors"
          />
          <p className="text-xs text-foreground-muted mt-2 font-light">
            Be specific — a clear title gets faster answers.
          </p>
        </div>

        {/* Body */}
        <div>
          <label className="heading text-xs tracking-widest text-foreground-muted block mb-3">
            DESCRIBE YOUR DOUBT
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Explain your doubt in detail. What have you tried? Where are you stuck?"
            required
            rows={7}
            className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-4 focus:outline-none focus:border-lime transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="heading text-xs tracking-widest text-foreground-muted block mb-3">
            TAGS <span className="text-foreground-muted font-light normal-case tracking-normal">({selectedTags.length}/5)</span>
          </label>

          {/* Tag input box */}
          <div className="flex flex-wrap gap-2 bg-background-secondary border border-border-strong px-3 py-3 focus-within:border-lime transition-colors min-h-[52px]">
            {/* Selected tags */}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-medium"
              >
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>
                  <X className="w-3 h-3 hover:text-white transition-colors" />
                </button>
              </span>
            ))}

            {/* Input */}
            {selectedTags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={selectedTags.length === 0 ? "Type a tag and press Enter..." : "Add another..."}
                className="flex-1 min-w-[140px] bg-transparent text-foreground placeholder:text-foreground-muted font-light text-sm focus:outline-none"
              />
            )}
          </div>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="mt-1 bg-background-secondary border border-border-strong">
              {suggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addTag(suggestion)}
                  className="w-full text-left px-4 py-2 text-sm text-foreground-muted hover:text-foreground hover:bg-background transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <p className="text-xs text-foreground-muted mt-2 font-light">
            Press Enter or comma to add a tag. Max 5 tags. Any topic allowed.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm font-light">Error: {error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-lime text-black heading text-sm tracking-wider px-8 py-4 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "POSTING..." : "+ POST QUESTION"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-foreground-muted text-sm font-light hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}