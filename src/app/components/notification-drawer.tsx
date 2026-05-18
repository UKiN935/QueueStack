import { X, ArrowBigUp, MessageCircle, Trophy } from "lucide-react";
import { Link } from "react-router";

interface NotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

type NotificationType = "answer" | "upvote" | "achievement";

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  link?: string;
  read: boolean;
}

const NOTIFICATIONS: Record<string, Notification[]> = {
  today: [
    {
      id: 1,
      type: "upvote",
      message: "Sarah Kim upvoted your answer on 'Differential equations with boundary conditions'",
      time: "5m ago",
      link: "/question/1",
      read: false,
    },
    {
      id: 2,
      type: "answer",
      message: "New answer on 'Maxwell's equations in integral form' that you're following",
      time: "1h ago",
      link: "/question/2",
      read: false,
    },
    {
      id: 3,
      type: "achievement",
      message: "Achievement unlocked: Knowledge Seeker - Asked 10 questions",
      time: "2h ago",
      read: false,
    },
  ],
  yesterday: [
    {
      id: 4,
      type: "answer",
      message: "Marcus Wu answered your question 'Understanding thermodynamics entropy'",
      time: "Yesterday, 8:30 PM",
      link: "/question/3",
      read: true,
    },
    {
      id: 5,
      type: "upvote",
      message: "Your question received 10 upvotes",
      time: "Yesterday, 3:15 PM",
      link: "/question/4",
      read: true,
    },
  ],
  thisWeek: [
    {
      id: 6,
      type: "achievement",
      message: "Achievement unlocked: Helpful Hand - 50 answers posted",
      time: "3 days ago",
      read: true,
    },
    {
      id: 7,
      type: "answer",
      message: "Emily Park answered 'Quantum mechanics superposition principle'",
      time: "4 days ago",
      link: "/question/5",
      read: true,
    },
  ],
};

const notifConfig: Record<NotificationType, { color: string; icon: React.ReactNode }> = {
  answer: {
    color: "var(--notif-answer)",
    icon: <MessageCircle className="w-4 h-4" />,
  },
  upvote: {
    color: "var(--notif-upvote)",
    icon: <ArrowBigUp className="w-4 h-4" />,
  },
  achievement: {
    color: "var(--notif-achievement)",
    icon: <Trophy className="w-4 h-4" />,
  },
};

export function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-background/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[360px] bg-background-secondary border-l border-border-strong z-[100] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-strong">
          <h2 className="heading text-xl">Notifications</h2>
          <button
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {Object.entries(NOTIFICATIONS).map(([period, notifs]) => (
            <div key={period}>
              {/* Period Header */}
              <div className="px-6 py-3 bg-background sticky top-0 z-10">
                <h3 className="heading text-xs tracking-wider text-foreground-muted uppercase">
                  {period === "today" ? "TODAY" : period === "yesterday" ? "YESTERDAY" : "THIS WEEK"}
                </h3>
              </div>

              {/* Notifications */}
              <div>
                {notifs.map((notif) => (
                  <div
                    key={notif.id}
                    className="relative group"
                    style={{
                      borderLeft: `3px solid ${notifConfig[notif.type].color}`,
                    }}
                  >
                    <div
                      className={`px-6 py-4 ${
                        notif.read ? "bg-background-secondary" : "bg-background"
                      } hover:bg-background transition-colors`}
                    >
                      {/* Notification content */}
                      <div className="flex gap-3">
                        <div
                          className="shrink-0 w-8 h-8 flex items-center justify-center"
                          style={{ color: notifConfig[notif.type].color }}
                        >
                          {notifConfig[notif.type].icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          {notif.link ? (
                            <Link
                              to={notif.link}
                              onClick={onClose}
                              className="block group-hover:text-lime transition-colors"
                            >
                              <p className="text-sm font-light text-foreground mb-1">
                                {notif.message}
                              </p>
                            </Link>
                          ) : (
                            <p className="text-sm font-light text-foreground mb-1">
                              {notif.message}
                            </p>
                          )}
                          <span className="mono text-xs text-foreground-muted">{notif.time}</span>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      {!notif.read && (
                        <div
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                          style={{ backgroundColor: notifConfig[notif.type].color }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-border-strong bg-background-secondary">
          <button className="w-full text-center text-sm text-indigo font-medium hover:underline">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
