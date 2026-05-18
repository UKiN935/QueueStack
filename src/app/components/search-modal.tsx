import { X, Search, Hash, User, FileQuestion } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const TRENDING_TAGS = [
  "calculus",
  "physics",
  "organic-chemistry",
  "linear-algebra",
  "thermodynamics",
  "quantum-mechanics",
  "differential-equations",
  "cell-biology",
  "discrete-math",
  "electromagnetism",
  "statistics",
  "molecular-biology",
];

const SEARCH_RESULTS = {
  questions: [
    { id: 1, title: "How do I solve this differential equation with boundary conditions?", tags: ["calculus"] },
    { id: 2, title: "Understanding Maxwell's equations in integral vs differential form", tags: ["physics"] },
    { id: 3, title: "Differential calculus vs integral calculus - key differences", tags: ["calculus"] },
  ],
  tags: [
    { name: "differential-equations", count: 1234 },
    { name: "calculus", count: 5678 },
    { name: "differential-geometry", count: 432 },
  ],
  users: [
    { name: "Dr. Sarah Kim", reputation: 12543, specialty: "Mathematics" },
    { name: "Alex Chen", reputation: 8901, specialty: "Physics" },
  ],
};

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  if (!open) return null;

  const addFilter = (filter: string) => {
    if (!filters.includes(filter)) {
      setFilters([...filters, filter]);
    }
  };

  const removeFilter = (filter: string) => {
    setFilters(filters.filter((f) => f !== filter));
  };

  const hasQuery = query.length > 0 || filters.length > 0;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-start justify-center pt-24">
      <div className="w-full max-w-3xl mx-8">
        {/* Search Input */}
        <div className="bg-background-secondary border-2 border-lime mb-6">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <Search className="w-5 h-5 text-lime shrink-0" />
            <div className="flex-1 flex flex-wrap items-center gap-2">
              {/* Active filters as chips */}
              {filters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-indigo/20 text-indigo text-sm border border-indigo/40"
                >
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="hover:text-lime">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={filters.length > 0 ? "Continue typing..." : "Search questions, tags, users..."}
                className="flex-1 bg-transparent text-foreground font-light outline-none placeholder:text-foreground-muted min-w-[200px]"
                autoFocus
              />
            </div>
            <button onClick={onClose} className="text-foreground-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results or Empty State */}
        <div className="bg-background-secondary border border-border-strong max-h-[600px] overflow-y-auto noise-texture">
          {hasQuery ? (
            // Search Results
            <div className="p-6 space-y-8">
              {/* Questions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileQuestion className="w-4 h-4 text-lime" />
                  <h3 className="heading text-sm tracking-wider text-foreground-muted">QUESTIONS</h3>
                </div>
                <div className="space-y-3">
                  {SEARCH_RESULTS.questions.map((q) => (
                    <Link
                      key={q.id}
                      to={`/question/${q.id}`}
                      onClick={onClose}
                      className="block p-4 bg-background border border-border hover:border-lime transition-colors group"
                    >
                      <p className="text-foreground font-light mb-2 group-hover:text-lime transition-colors">
                        {q.title}
                      </p>
                      <div className="flex gap-2">
                        {q.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-foreground-muted bg-background-secondary px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="w-4 h-4 text-lime" />
                  <h3 className="heading text-sm tracking-wider text-foreground-muted">TAGS</h3>
                </div>
                <div className="space-y-2">
                  {SEARCH_RESULTS.tags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => addFilter(tag.name)}
                      className="flex items-center justify-between w-full p-3 bg-background border border-border hover:border-lime transition-colors text-left"
                    >
                      <span className="text-indigo font-medium">{tag.name}</span>
                      <span className="mono text-xs text-foreground-muted">{tag.count} questions</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Users */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-lime" />
                  <h3 className="heading text-sm tracking-wider text-foreground-muted">USERS</h3>
                </div>
                <div className="space-y-2">
                  {SEARCH_RESULTS.users.map((user) => (
                    <button
                      key={user.name}
                      className="flex items-center justify-between w-full p-3 bg-background border border-border hover:border-lime transition-colors text-left"
                    >
                      <div>
                        <p className="text-indigo font-medium">{user.name}</p>
                        <p className="text-xs text-foreground-muted">{user.specialty}</p>
                      </div>
                      <span className="mono text-xs text-lime">{user.reputation.toLocaleString()} XP</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Empty State - Trending Tags Masonry
            <div className="p-8">
              <h3 className="heading text-sm tracking-wider text-foreground-muted mb-6 text-center">
                TRENDING TAGS
              </h3>
              <div className="columns-3 gap-4">
                {TRENDING_TAGS.map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => addFilter(tag)}
                    className="block w-full mb-4 p-4 bg-background border border-border hover:border-lime transition-colors break-inside-avoid"
                    style={{
                      height: `${80 + (i % 3) * 20}px`,
                    }}
                  >
                    <Hash className="w-4 h-4 text-lime mb-2" />
                    <span className="text-foreground font-medium text-sm">{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-foreground-muted mono">
          <span>
            <kbd className="bg-background-secondary px-2 py-1">ESC</kbd> to close
          </span>
          <span>
            <kbd className="bg-background-secondary px-2 py-1">↵</kbd> to select
          </span>
        </div>
      </div>
    </div>
  );
}
