import React, { useState, useEffect } from "react";
import { ArrowBigUp, MessageSquare, Eye } from "lucide-react";
import { Link } from "react-router";
import socket from "../../socket"; 

const FILTERS = ["All", "Unanswered", "Trending", "Following"];

// Known tags with colors — unknown tags get a default grey
const TAGS: Record<string, { name: string; color: string }> = {
  physics:     { name: "Physics",     color: "#5271FF" },
  calculus:    { name: "Calculus",    color: "#B8FF57" },
  chemistry:   { name: "Chemistry",   color: "#FF5757" },
  biology:     { name: "Biology",     color: "#57FFB8" },
  algebra:     { name: "Algebra",     color: "#FFB857" },
  javascript:  { name: "JavaScript",  color: "#F7DF1E" },
  react:       { name: "React",       color: "#61DAFB" },
  nodejs:      { name: "Node.js",     color: "#68A063" },
  python:      { name: "Python",      color: "#3776AB" },
  history:     { name: "History",     color: "#FF9F7F" },
  economics:   { name: "Economics",   color: "#C084FC" },
  statistics:  { name: "Statistics",  color: "#FB923C" },
  geography:   { name: "Geography",   color: "#34D399" },
  literature:  { name: "Literature",  color: "#F472B6" },
};

const DEFAULT_TAG_COLOR = "#7070A0"; // grey for unknown tags

// Helper — get tag display name and color
const getTag = (tag: string) => ({
  name:  TAGS[tag]?.name  ?? tag,           // fallback to raw tag name
  color: TAGS[tag]?.color ?? DEFAULT_TAG_COLOR, // fallback to grey
});

// ── Types ──────────────────────────────────────────────────────
interface Question {
  _id: string;
  title: string;
  tags: string[];
  upvotes: number;
  answers: number;
  views: number;
  answered: boolean;
  timeAgo: string;
  excerpt: string;
}

interface ActivityItem {
  user: string;
  action: string;
  question: string;
  time: string;
}

const ACTIVITY: ActivityItem[] = [
  { user: "Alex Chen",    action: "answered",    question: "Organic chemistry synthesis pathway", time: "2m"  },
  { user: "Sarah Kim",    action: "upvoted",     question: "Linear algebra proof",                time: "5m"  },
  { user: "Marcus Wu",    action: "asked",       question: "Quantum mechanics superposition",     time: "8m"  },
  { user: "Emily Park",   action: "commented on",question: "Statistical hypothesis testing",      time: "12m" },
  { user: "David Lee",    action: "answered",    question: "Complex analysis residue theorem",    time: "15m" },
  { user: "Nina Patel",   action: "upvoted",     question: "Cell membrane transport",             time: "18m" },
  { user: "Jordan Smith", action: "asked",       question: "Graph theory chromatic number",       time: "22m" },
  { user: "Maya Torres",  action: "answered",    question: "Thermodynamics entropy change",       time: "25m" },
];

export function HomeFeed() {
  const [questions, setQuestions]   = useState<Question[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState("All");

   const filteredQuestions = activeFilter === "Unanswered"
    ? questions.filter((q) => q.answers === 0)
    : questions;

  useEffect(() => {
  
    socket.on("newQuestion", (question: Question) => {
      setQuestions((prev) => [question, ...prev]); // adds to top of feed
    });

    return () => {
      socket.off("newQuestion"); // cleanup on unmount
    };
  }, []);
  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleUpvote = async (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (upvotedIds.has(id)) return;

    const res = await fetch(`http://localhost:3001/questions/${id}/upvote`, { method: "POST" });
    const data = await res.json();

    setQuestions((prev) =>
      prev.map((q) => (q._id === id ? { ...q, upvotes: data.upvotes } : q))
    );
    setUpvotedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-8">
      {/* Filter Pills */}
      <div className="sticky top-[73px] z-40 -mx-8 px-8 py-4 bg-background border-b border-border mb-8">
        <div className="flex gap-2">
          {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full transition-all ${
              activeFilter === filter
              ? "bg-lime text-lime-foreground"
            : "bg-background-secondary text-foreground-muted hover:text-foreground border border-border"
          }`}
        >
          <span className="text-sm font-medium">{filter}</span>
      </button>
      ))}

        </div>
      </div>

      <div className="grid grid-cols-[65fr_35fr] gap-8">
        {/* Left: Question Feed */}
        <div className="space-y-6">
          {loading && <p className="text-foreground-muted text-sm font-light py-8">Loading questions...</p>}
          {error   && <p className="text-red-400 text-sm font-light py-8">Could not connect to backend: {error}</p>}

          {filteredQuestions.map((question) => (
            <Link key={question._id} to={`/question/${question._id}`} className="block group">
              <article className="relative bg-background-secondary border-l-4 border-border-strong pl-6 pr-6 py-6 hover:border-lime transition-all noise-texture">

                {/* Tags */}
                <div className="absolute -top-3 left-0 flex gap-2">
                  {question.tags.map((tag) => {
                    const { name, color } = getTag(tag); // ← works for ANY tag
                    return (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium border border-border-strong"
                        style={{
                          backgroundColor: color + "20",
                          color:           color,
                          borderColor:     color + "40",
                        }}
                      >
                        {name}
                      </span>
                    );
                  })}
                </div>

                {/* Answered Stamp */}
                {question.answered && (
                  <div className="absolute -right-2 top-8 rotate-12 px-4 py-1.5 border-2 border-lime bg-background">
                    <span className="heading text-lime text-xs tracking-wider">ANSWERED</span>
                  </div>
                )}

                {/* Upvote Counter */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 flex flex-col items-center gap-1 bg-background-secondary border border-border-strong px-2 py-3 transition-all
                    ${upvotedIds.has(question._id)
                      ? "border-lime cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-lime"
                    }`}
                  onClick={(e) => handleUpvote(e, question._id)}
                >
                  <ArrowBigUp className={`w-5 h-5 ${upvotedIds.has(question._id) ? "fill-lime text-lime" : "text-lime"}`} />
                  <span className="heading text-lg text-foreground">{question.upvotes}</span>
                </div>

                {/* Content */}
                <div className="ml-12">
                  <h3 className="heading text-xl text-foreground mb-2 group-hover:text-lime transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-sm text-foreground-muted font-light mb-4">{question.excerpt}</p>
                  <div className="flex items-center gap-6 text-xs text-foreground-muted font-light">
                    <span className="mono">{question.timeAgo}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{question.answers}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{question.views.toLocaleString()}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Right: Live Activity + Trending Tags */}
        <div className="sticky top-[145px] h-fit">
          <div className="bg-background-secondary border border-border-strong p-6 noise-texture">
            <h4 className="heading text-sm text-foreground-muted mb-4 tracking-wider">LIVE ACTIVITY</h4>
            <div className="space-y-4">
              {ACTIVITY.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <span className="mono text-[10px] text-foreground-muted mt-0.5 w-8 shrink-0">{item.time}</span>
                  <div className="font-light">
                    <span className="text-foreground font-medium">{item.user}</span>{" "}
                    <span className="text-foreground-muted">{item.action}</span>{" "}
                    <span className="text-indigo hover:underline cursor-pointer">{item.question}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags — now dynamic from questions */}
          <div className="mt-6 bg-background-secondary border border-border-strong p-6 noise-texture">
            <h4 className="heading text-sm text-foreground-muted mb-4 tracking-wider">TRENDING TAGS</h4>
            <div className="flex flex-wrap gap-2">
              {/* Get unique tags from all questions */}
              {[...new Set(questions.flatMap((q) => q.tags))].map((tag) => {
                const { name, color } = getTag(tag);
                return (
                  <button
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium border border-border-strong hover:border-lime transition-colors"
                    style={{ backgroundColor: color + "20", color, borderColor: color + "40" }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}