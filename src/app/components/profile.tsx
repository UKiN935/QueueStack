import { Trophy, Lock, TrendingUp } from "lucide-react";
import { useState } from "react";

const USER_XP = 23847;

interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  icon: string;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-answer",
    name: "First Answer",
    description: "Posted your first answer",
    xp: 100,
    unlocked: true,
    icon: "💡",
    color: "#B8FF57",
  },
  {
    id: "helpful-hand",
    name: "Helpful Hand",
    description: "Received 50 upvotes on answers",
    xp: 500,
    unlocked: true,
    icon: "🤝",
    color: "#5271FF",
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Asked 10 quality questions",
    xp: 250,
    unlocked: true,
    icon: "🔍",
    color: "#FFD700",
  },
  {
    id: "expert-100",
    name: "Expert (100)",
    description: "Reach 100 accepted answers",
    xp: 2000,
    unlocked: false,
    progress: 67,
    maxProgress: 100,
    icon: "🎓",
    color: "#FF5757",
  },
  {
    id: "community-leader",
    name: "Community Leader",
    description: "Help 1000 students",
    xp: 5000,
    unlocked: false,
    progress: 423,
    maxProgress: 1000,
    icon: "👑",
    color: "#57FFB8",
  },
  {
    id: "master-teacher",
    name: "Master Teacher",
    description: "Write 500 detailed answers",
    xp: 3000,
    unlocked: false,
    progress: 189,
    maxProgress: 500,
    icon: "📚",
    color: "#FFB857",
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 30-day active streak",
    xp: 1000,
    unlocked: true,
    icon: "🔥",
    color: "#FF5757",
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "All answers have 10+ upvotes",
    xp: 1500,
    unlocked: false,
    progress: 8,
    maxProgress: 10,
    icon: "⭐",
    color: "#FFD700",
  },
];

export function Profile() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-12">
      {/* Profile Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="heading text-4xl mb-2">Alex Chen</h1>
            <p className="text-foreground-muted font-light">
              Physics & Mathematics Enthusiast
            </p>
          </div>

          {/* XP Counter - Game Score Style */}
          <div className="bg-background-secondary border-2 border-lime p-6 noise-texture">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-lime" />
              <div>
                <div className="heading text-5xl text-lime tabular-nums">{USER_XP.toLocaleString()}</div>
                <div className="text-sm text-foreground-muted tracking-wider mt-1">TOTAL XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background-secondary border border-border-strong p-4">
            <div className="heading text-3xl text-foreground mb-1">143</div>
            <div className="text-sm text-foreground-muted">Questions Asked</div>
          </div>
          <div className="bg-background-secondary border border-border-strong p-4">
            <div className="heading text-3xl text-foreground mb-1">289</div>
            <div className="text-sm text-foreground-muted">Answers Posted</div>
          </div>
          <div className="bg-background-secondary border border-border-strong p-4">
            <div className="heading text-3xl text-lime mb-1">67</div>
            <div className="text-sm text-foreground-muted">Accepted Answers</div>
          </div>
          <div className="bg-background-secondary border border-border-strong p-4 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-lime" />
            <div>
              <div className="heading text-2xl text-foreground mb-1">12 Day</div>
              <div className="text-sm text-foreground-muted">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <h2 className="heading text-2xl mb-6">Achievements</h2>

        {/* Horizontal Scrollable Shelf */}
        <div className="relative -mx-8 px-8">
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-6" style={{ width: "max-content" }}>
              {ACHIEVEMENTS.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative w-72 shrink-0"
                  onMouseEnter={() => setHoveredCard(achievement.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transform:
                      hoveredCard === achievement.id
                        ? "perspective(1000px) rotateY(5deg) translateY(-8px)"
                        : "perspective(1000px) rotateY(0deg) translateY(0px)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  {/* 3D Tilt Card */}
                  <div
                    className={`bg-background-secondary border-2 p-6 noise-texture ${
                      achievement.unlocked
                        ? "border-border-strong"
                        : "border-border opacity-60 grayscale"
                    } hover:border-lime transition-all`}
                  >
                    {/* Lock indicator for locked achievements */}
                    {!achievement.unlocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-foreground-muted" />
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      className="w-16 h-16 flex items-center justify-center text-4xl mb-4 border-2"
                      style={{
                        borderColor: achievement.unlocked ? achievement.color : "#2A2A35",
                        backgroundColor: achievement.unlocked
                          ? achievement.color + "20"
                          : "transparent",
                      }}
                    >
                      {achievement.icon}
                    </div>

                    {/* Content */}
                    <h3 className="heading text-xl mb-2" style={{ color: achievement.color }}>
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-foreground-muted font-light mb-4">
                      {achievement.description}
                    </p>

                    {/* XP Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border-strong mb-4">
                      <Trophy className="w-3.5 h-3.5 text-lime" />
                      <span className="heading text-sm text-lime">+{achievement.xp} XP</span>
                    </div>

                    {/* Progress Bar (for locked achievements) */}
                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div>
                        <div className="flex items-center justify-between mb-2 text-xs">
                          <span className="text-foreground-muted">Progress</span>
                          <span className="mono text-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <div className="h-2 bg-background border border-border-strong">
                          <div
                            className="h-full transition-all"
                            style={{
                              width: `${
                                (achievement.progress / (achievement.maxProgress || 1)) * 100
                              }%`,
                              backgroundColor: achievement.color,
                            }}
                          />
                        </div>
                        {/* Segmented Progress Indicator */}
                        <div className="flex gap-1 mt-2">
                          {Array.from({ length: achievement.maxProgress || 0 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-1 flex-1"
                              style={{
                                backgroundColor:
                                  i < (achievement.progress || 0)
                                    ? achievement.color
                                    : "#2A2A35",
                              }}
                            />
                          )).slice(0, 20)}
                        </div>
                      </div>
                    )}

                    {/* Unlocked Date */}
                    {achievement.unlocked && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <span className="mono text-xs text-foreground-muted">
                          Unlocked: Mar 5, 2026
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-4">
            <div className="h-1 w-12 bg-lime"></div>
            <div className="h-1 w-12 bg-border"></div>
            <div className="h-1 w-12 bg-border"></div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-16">
        <h2 className="heading text-2xl mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: "Answered", title: "How to solve differential equations", time: "2h ago", upvotes: 12 },
            { action: "Asked", title: "Understanding quantum mechanics", time: "5h ago", upvotes: 8 },
            { action: "Answered", title: "Maxwell's equations explained", time: "1d ago", upvotes: 24 },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-background-secondary border-l-2 border-indigo"
            >
              <div>
                <span className="text-sm text-foreground-muted">{item.action}</span>
                <p className="text-foreground font-light mt-1">{item.title}</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="mono text-foreground-muted">{item.time}</span>
                <span className="text-lime">+{item.upvotes} upvotes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
