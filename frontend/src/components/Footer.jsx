import { Link } from "react-router-dom";
import { Heart, Twitter, Github, Linkedin } from "lucide-react";

const LINKS = [
  {
    title: "Explore",
    items: [
      ["Discover", "/discover"],
      ["Trending", "/discover?sort=most-funded"],
      ["Ending Soon", "/discover?sort=ending-soon"],
      ["New Projects", "/discover?sort=newest"],
    ],
  },
  {
    title: "Create",
    items: [
      ["Start Campaign", "/create"],
      ["AI Tools", "/ai"],
      ["Dashboard", "/dashboard"],
    ],
  },
  {
    title: "Account",
    items: [
      ["Sign Up", "/register"],
      ["Log In", "/login"],
      ["Saved Projects", "/saved"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border mt-0">
      {/* Upper */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--teal)" }}
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-black text-[17px] tracking-tight">
              Milesto<span style={{ color: "var(--teal)" }}>Fund</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-[220px]">
            India's platform for creative crowdfunding. Back great ideas. Launch
            your own.
          </p>
          <div className="flex gap-2">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {LINKS.map(({ title, items }) => (
          <div key={title}>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-4">
              {title}
            </p>
            <ul className="space-y-3">
              {items.map(([label, href]) => (
                <li key={href}>
                  <Link
                    to={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Lower */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 MilestoFund. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
