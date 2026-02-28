import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Moon,
  Sun,
  Menu,
  X,
  Plus,
  LayoutDashboard,
  LogOut,
  User,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { to: "/discover", label: "Discover" },
  { to: "/ai", label: "✦ AI Recommendations" },
];

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    setOpen(false);
    setDropdown(false);
  }, [pathname]);

  const active = (p) => pathname === p;
  const doLogout = () => {
    logout();
    setDropdown(false);
    navigate("/");
  };

  const USER_MENU = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      to: `/profile/${user?.id}`,
      icon: <User className="h-4 w-4" />,
      label: "My Profile",
    },
    {
      to: "/saved",
      icon: <Bookmark className="h-4 w-4" />,
      label: "Saved Projects",
    },
  ];

  const desktopLinks = [
    ...NAV_LINKS,
    ...(isLoggedIn ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];
  const mobileLinks = [
    ...NAV_LINKS,
    ...(isLoggedIn
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/create", label: "+ New Project" },
          { to: `/profile/${user?.id}`, label: "My Profile" },
          { to: "/saved", label: "Saved" },
        ]
      : [
          { to: "/login", label: "Log In" },
          { to: "/register", label: "Get Started" },
        ]),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/96 backdrop-blur-xl shadow-sm border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[66px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="MilestoFund Logo"
            className="h-12 w-auto object-contain select-none transition-transform hover:scale-105"
          />
          <span className="font-black text-[19px] md:text-[21px] tracking-tight hidden sm:block">
            Milesto<span style={{ color: "var(--teal)" }}>Fund</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {desktopLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active(to)
                  ? "text-primary font-semibold bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "var(--teal)" }}
              >
                <Plus className="h-3.5 w-3.5" /> New Project
              </Link>

              <div className="relative">
                <button
                  onClick={() => setDropdown(!dropdown)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-lg overflow-hidden shrink-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: "var(--teal)" }}
                  >
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    ) : (
                      user?.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium hidden lg:block max-w-[80px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-card rounded-2xl shadow-xl border border-border py-2 z-20 animate-fade-in">
                      <div className="px-4 py-3 border-b border-border mb-1">
                        <p className="font-semibold text-sm truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      {USER_MENU.map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className="flex items-center gap-3 mx-1.5 px-3 py-2.5 text-sm rounded-xl hover:bg-secondary transition-colors text-foreground/80 hover:text-foreground"
                        >
                          <span className="text-muted-foreground">{icon}</span>
                          {label}
                        </Link>
                      ))}
                      <div className="border-t border-border mt-1 pt-1 mx-1.5">
                        <button
                          onClick={doLogout}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/8 rounded-xl w-full transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "var(--teal)" }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-border py-3 px-4 space-y-0.5 animate-fade-in">
          {mobileLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active(to)
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary text-foreground/80"
              }`}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn && (
            <button
              onClick={() => {
                setOpen(false);
                doLogout();
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/8 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          )}
          <button
            onClick={() => {
              toggle();
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm hover:bg-secondary w-full text-foreground/80 transition-colors"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
}
