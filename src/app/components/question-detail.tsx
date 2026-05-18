import { ArrowBigUp, ArrowBigDown, MessageSquare, Bookmark, Share2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// ── Types ──────────────────────────────────────────────────────
interface Question {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  views: number;
  askedBy: string;
  askedTime: string;
  hasImages?: boolean;
  answered: boolean;
}

interface Comment {
  _id: string;
  author: string;
  text: string;
  time: string;
}

interface Answer {
  _id: string;
  body: string;
  upvotes: number;
  downvotes: number;
  answeredBy: string;
  answeredTime: string;
  accepted: boolean;
  comments: Comment[];
}

export function QuestionDetail() {
  const { id } = useParams();

  // ── State ────────────────────────────────────────────────────
  const [question, setQuestion]           = useState<Question | null>(null);
  const [answers, setAnswers]             = useState<Answer[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [commentStates, setCommentStates] = useState<Record<string, boolean>>({});
  const [answerText, setAnswerText]       = useState("");
  const [answerAuthor, setAnswerAuthor]   = useState("");
  const [posting, setPosting]             = useState(false);
  const [posted, setPosted]               = useState(false);

  // ── Fetch question AND answers together ───────────────────────
  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/questions/${id}`).then((res) => {
        if (!res.ok) throw new Error("Question not found");
        return res.json();
      }),
      fetch(`http://localhost:3001/questions/${id}/answers`).then((res) => {
        if (!res.ok) throw new Error("Could not load answers");
        return res.json();
      }),
    ])
      .then(([questionData, answersData]) => {
        setQuestion(questionData);
        setAnswers(answersData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // ── Toggle comments ───────────────────────────────────────────
  const toggleComments = (answerId: string) => {
    setCommentStates((prev) => ({ ...prev, [answerId]: !prev[answerId] }));
  };

  const handlePostAnswer = async () => {
    if (!answerText.trim() || !answerAuthor.trim()) return;
    setPosting(true);

    try {
      const res = await fetch(`http://localhost:3001/questions/${id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: answerText, author: answerAuthor }),
      });

      if (!res.ok) throw new Error("Failed to post answer");

      const newAnswer: Answer = await res.json();

      setAnswers((prev) => [...prev, newAnswer]); // add to list instantly
      setAnswerText("");
      setAnswerAuthor("");
      setPosted(true);

    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p className="text-foreground-muted text-sm font-light p-12">Loading question...</p>;
  if (error)   return <p className="text-red-400 text-sm font-light p-12">Error: {error}</p>;
  if (!question) return null;

  return (
    <div className="mx-auto max-w-[1000px] px-8 py-12">
      <article className="mb-12">
        <h1 className="heading text-[48px] leading-[1.1] text-foreground mb-6">
          {question.title}
        </h1>

        <div className="flex items-center gap-6 py-4 border-y border-border mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-muted font-light">Asked by</span>
            <span className="text-sm text-indigo font-medium hover:underline cursor-pointer">
              {question.askedBy}
            </span>
          </div>
          <span className="mono text-xs text-foreground-muted">{question.askedTime}</span>
          <div className="flex items-center gap-1 text-sm text-foreground-muted">
            <Eye className="w-4 h-4" />
            <span className="font-light">{(question.views ?? 0).toLocaleString()} views</span>
          </div>
          <div className="flex gap-2 ml-auto">
            {question.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-medium bg-background-secondary border border-border">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert max-w-none mb-8">
          <div className="whitespace-pre-wrap text-foreground font-light leading-relaxed">
            {question.body}
          </div>
        </div>

        {question.hasImages && (
          <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
            <div className="shrink-0 w-64 h-48 bg-background-secondary border border-border flex items-center justify-center">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop"
                alt="Equation diagram"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background-secondary border border-border-strong">
            <button className="px-4 py-3 hover:bg-lime/10 hover:text-lime transition-colors">
              <ArrowBigUp className="w-5 h-5" />
            </button>
            <span className="heading text-lg">{(question.upvotes ?? 0) - (question.downvotes ?? 0)}</span>
            <button className="px-4 py-3 hover:bg-destructive/10 hover:text-destructive transition-colors">
              <ArrowBigDown className="w-5 h-5" />
            </button>
          </div>
          <button className="px-6 py-3 bg-background-secondary border border-border-strong hover:border-lime transition-colors flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span className="text-sm font-medium">Bookmark</span>
          </button>
          <button className="px-6 py-3 bg-background-secondary border border-border-strong hover:border-lime transition-colors flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </article>

      {/* Answers divider */}
      <div className="relative my-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-border-strong"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-6 py-2 heading text-sm tracking-wider text-foreground-muted">
            {answers.length} ANSWERS
          </span>
        </div>
      </div>

      {/* Answers — real data from backend */}
      <div className="space-y-8">
        {answers.map((answer) => (
          <article
            key={answer._id}
            className={`bg-background-secondary border-l-4 ${
              answer.accepted ? "border-lime" : "border-border-strong"
            } pl-6 pr-6 py-6 noise-texture`}
          >
            {answer.accepted && (
              <div className="flex items-center gap-2 mb-4">
                <div className="px-3 py-1 bg-lime text-lime-foreground">
                  <span className="heading text-xs tracking-wider">ACCEPTED ANSWER</span>
                </div>
              </div>
            )}

            <div className="prose prose-invert max-w-none mb-6">
              <div className="whitespace-pre-wrap text-foreground font-light leading-relaxed">
                {answer.body}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-background border border-border-strong">
                  <button className="px-3 py-2 hover:bg-lime/10 hover:text-lime transition-colors">
                    <ArrowBigUp className="w-4 h-4" />
                  </button>
                  <span className="heading text-base">{answer.upvotes - answer.downvotes}</span>
                  <button className="px-3 py-2 hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <ArrowBigDown className="w-4 h-4" />
                  </button>
                </div>
                {answer.comments.length > 0 && (
                  <button
                    onClick={() => toggleComments(answer._id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{answer.comments.length} comments</span>
                    {commentStates[answer._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-indigo font-medium">{answer.answeredBy}</span>
                <span className="mono text-xs text-foreground-muted">{answer.answeredTime}</span>
              </div>
            </div>

            {commentStates[answer._id] && answer.comments.length > 0 && (
              <div className="border-t border-border pt-4 space-y-3">
                {answer.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 text-sm pl-4 border-l-2 border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-indigo font-medium">{comment.author}</span>
                        <span className="mono text-xs text-foreground-muted">{comment.time}</span>
                      </div>
                      <p className="text-foreground-muted font-light">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Post Your Answer */}
      <div className="mt-12">
        <h3 className="heading text-xl mb-6">Your Answer</h3>
        <input
          type="text"
          value={answerAuthor}
          onChange={(e) => setAnswerAuthor(e.target.value)}
          placeholder="Your name"
          className="w-full bg-background-secondary border border-border-strong text-foreground placeholder:text-foreground-muted font-light px-5 py-3 mb-4 focus:outline-none focus:border-lime transition-colors"
        />
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          className="w-full h-48 bg-background-secondary border border-border-strong p-4 text-foreground font-light resize-none focus:border-lime outline-none transition-colors"
          placeholder="Write your answer here..."
        />
        {posted && (
          <p className="text-lime text-sm font-light mt-2">✓ Answer posted successfully!</p>
        )}
        <button
          onClick={handlePostAnswer}
          disabled={posting || !answerText.trim() || !answerAuthor.trim()}
          className="mt-4 px-8 py-3 bg-lime text-lime-foreground heading text-sm tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {posting ? "POSTING..." : "POST ANSWER"}
        </button>
      </div>
    </div>
  );
}
