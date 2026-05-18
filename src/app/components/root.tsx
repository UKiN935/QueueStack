import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Search, Bell, BookmarkIcon, User, Home, LogOut } from "lucide-react";
import { useState } from "react";
import { SearchModal } from "./search-modal";
import { NotificationDrawer } from "./notification-drawer";

export function Root() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);

  // ── Auth state from localStorage ─────────────────────────────
  const token = localStorage.getItem("token");
  const name  = localStorage.getItem("name");

  // ── Logout ───────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border-strong bg-background-secondary">
        <div className="mx-auto max-w-[1600px] px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lime flex items-center justify-center">
              <span className="heading text-lime-foreground text-xl">Q</span>
            </div>
            <span className="heading text-2xl text-foreground">QueStack</span>
          </Link>

          <nav className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-muted text-foreground-muted hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-light">Search</span>
              <kbd className="mono text-xs bg-background px-1.5 py-0.5">⌘K</kbd>
            </button>

            {/* Home */}
            <Link
              to="/"
              className={`p-2.5 ${
                location.pathname === "/" ? "text-lime" : "text-foreground-muted hover:text-foreground"
              } transition-colors`}
            >
              <Home className="w-5 h-5" />
            </Link>

            {/* Bookmarks */}
            <Link
              to="/bookmarks"
              className={`p-2.5 ${
                location.pathname === "/bookmarks" ? "text-lime" : "text-foreground-muted hover:text-foreground"
              } transition-colors`}
            >
              <BookmarkIcon className="w-5 h-5" />
            </Link>

            {/* Notifications */}
            <button
              onClick={() => setNotifOpen(true)}
              className="p-2.5 text-foreground-muted hover:text-foreground transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-lime rounded-full"></span>
            </button>

            {/* ── Auth section ── */}
            {token ? (
              // ── Logged in ──────────────────────────────────
              <>
                {/* Profile */}
                <Link
                  to="/profile"
                  className={`p-2.5 ${
                    location.pathname === "/profile" ? "text-lime" : "text-foreground-muted hover:text-foreground"
                  } transition-colors`}
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Username */}
                <span className="text-sm text-foreground-muted font-light hidden md:block">
                  Hey, <span className="text-foreground font-medium">{name}</span>
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-foreground-muted hover:text-accent3 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>

                {/* Ask Question */}
                <Link to="/ask">
                  <button className="bg-lime text-black heading text-sm tracking-wider px-6 py-2.5 hover:opacity-90 transition-opacity">
                    + ASK QUESTION
                  </button>
                </Link>
              </>
            ) : (
              // ── Logged out ─────────────────────────────────
              <>
                <Link to="/login">
                  <button className="text-foreground-muted border border-border-strong heading text-sm tracking-wider px-6 py-2.5 hover:border-lime hover:text-foreground transition-all">
                    LOGIN
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-lime text-black heading text-sm tracking-wider px-6 py-2.5 hover:opacity-90 transition-opacity">
                    SIGN UP
                  </button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Modals */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationDrawer open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
