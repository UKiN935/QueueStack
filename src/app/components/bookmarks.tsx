import { Trash2, ExternalLink, Calendar } from "lucide-react";
import { useState } from "react";
import Masonry from "react-responsive-masonry";
import { Link } from "react-router";

interface Bookmark {
  id: number;
  questionId: number;
  title: string;
  personalNote: string;
  tag: string;
  tagColor: string;
  savedDate: string;
}

const BOOKMARKS: Bookmark[] = [
  {
    id: 1,
    questionId: 1,
    title: "How do I solve this differential equation with boundary conditions?",
    personalNote: "Great explanation of inconsistent boundary conditions. Remember the sin(2x) zero points.",
    tag: "Calculus",
    tagColor: "#B8FF57",
    savedDate: "Mar 8, 2026",
  },
  {
    id: 2,
    questionId: 2,
    title: "What's the difference between enthalpy and entropy?",
    personalNote: "Review this before thermodynamics exam",
    tag: "Chemistry",
    tagColor: "#FF5757",
    savedDate: "Mar 7, 2026",
  },
  {
    id: 3,
    questionId: 3,
    title: "Understanding Maxwell's equations in integral vs differential form",
    personalNote:
      "Physical interpretation differences are key. Integral form for macroscopic, differential for point-wise analysis. Come back to this for E&M final.",
    tag: "Physics",
    tagColor: "#5271FF",
    savedDate: "Mar 6, 2026",
  },
  {
    id: 4,
    questionId: 4,
    title: "Proving the quadratic formula using completing the square",
    personalNote: "Clear algebraic steps",
    tag: "Algebra",
    tagColor: "#FFB857",
    savedDate: "Mar 5, 2026",
  },
  {
    id: 5,
    questionId: 5,
    title: "Why does DNA replication occur in the 5' to 3' direction only?",
    personalNote: "Biochemical constraint related to polymerase mechanism. Important for molecular bio quiz.",
    tag: "Biology",
    tagColor: "#57FFB8",
    savedDate: "Mar 4, 2026",
  },
  {
    id: 6,
    questionId: 6,
    title: "Linear algebra proof for eigenvalue decomposition",
    personalNote: "Study this proof technique",
    tag: "Mathematics",
    tagColor: "#B8FF57",
    savedDate: "Mar 3, 2026",
  },
];

export function Bookmarks() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="heading text-4xl mb-2">Bookmarks</h1>
        <p className="text-foreground-muted font-light">
          Your saved questions and notes • {BOOKMARKS.length} items
        </p>
      </div>

      {/* Notebook Texture Background */}
      <div
        className="relative bg-background-secondary border border-border-strong p-8 noise-texture"
        style={{
          backgroundImage: `repeating-linear-gradient(
            transparent,
            transparent 31px,
            #2A2A35 31px,
            #2A2A35 32px
          )`,
          backgroundSize: "100% 32px",
        }}
      >
        {/* Left margin line (like a notebook) */}
        <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-destructive/30"></div>

        {/* Masonry Grid */}
        <Masonry columnsCount={2} gutter="24px" className="pl-8">
          {BOOKMARKS.map((bookmark) => (
            <div
              key={bookmark.id}
              className="relative bg-background border border-border-strong p-6 group"
              onMouseEnter={() => setHoveredId(bookmark.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tag */}
              <div className="absolute -top-3 left-4">
                <span
                  className="px-3 py-1 text-xs font-medium border"
                  style={{
                    backgroundColor: bookmark.tagColor + "20",
                    color: bookmark.tagColor,
                    borderColor: bookmark.tagColor + "40",
                  }}
                >
                  {bookmark.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="heading text-lg text-foreground mb-3 mt-2">
                {bookmark.title}
              </h3>

              {/* Personal Note */}
              <div className="mb-4 p-3 bg-background-secondary border-l-2 border-indigo">
                <p className="text-sm text-foreground-muted font-light italic">
                  "{bookmark.personalNote}"
                </p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-xs text-foreground-muted mono">
                <Calendar className="w-3.5 h-3.5" />
                {bookmark.savedDate}
              </div>

              {/* Hover Actions */}
              {hoveredId === bookmark.id && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Link
                    to={`/question/${bookmark.questionId}`}
                    className="p-2 bg-lime text-lime-foreground hover:opacity-90 transition-opacity"
                    title="Open question"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    className="p-2 bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </Masonry>

        {/* Empty State (commented out, but available) */}
        {/* {BOOKMARKS.length === 0 && (
          <div className="text-center py-24">
            <BookmarkIcon className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
            <h3 className="heading text-xl text-foreground-muted mb-2">No bookmarks yet</h3>
            <p className="text-foreground-muted font-light">
              Save questions you want to revisit later
            </p>
          </div>
        )} */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-background-secondary border border-border-strong p-4 text-center">
          <div className="heading text-2xl text-foreground mb-1">{BOOKMARKS.length}</div>
          <div className="text-sm text-foreground-muted">Total Bookmarks</div>
        </div>
        <div className="bg-background-secondary border border-border-strong p-4 text-center">
          <div className="heading text-2xl text-lime mb-1">3</div>
          <div className="text-sm text-foreground-muted">Added This Week</div>
        </div>
        <div className="bg-background-secondary border border-border-strong p-4 text-center">
          <div className="heading text-2xl text-indigo mb-1">5</div>
          <div className="text-sm text-foreground-muted">Different Subjects</div>
        </div>
      </div>
    </div>
  );
}
