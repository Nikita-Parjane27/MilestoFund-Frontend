import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, Shield, Users, TrendingUp, CheckCircle, Quote, Star } from "lucide-react";
import { projectService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { CardSkeleton } from "../components/Loader";

const STATS = [
  { val:"₹2.4Cr+", label:"Total Funded" },
  { val:"12,500+", label:"Backers" },
  { val:"340+",    label:"Projects" },
  { val:"94%",     label:"Success Rate" },
];

const HOW = [
  { n:"01", emoji:"✏️", title:"Create Your Campaign",    body:"Use our 5-step builder + AI writing tools to go live in minutes." },
  { n:"02", emoji:"🌟", title:"Get Discovered",           body:"Your project reaches thousands of passionate Indian backers instantly." },
  { n:"03", emoji:"💸", title:"Collect Funds Securely",   body:"Payments via Razorpay. Funds transferred directly to your account." },
];

const FEATURES = [
  { icon:"⚡", c:"var(--teal-lt)", tc:"var(--teal)", title:"Launch in Minutes",    body:"Guided 5-step builder and AI pitch tools. No technical skills needed." },
  { icon:"🔐", c:"#e8f5e9",      tc:"#2e7d32",     title:"100% Secure Payments", body:"Bank-grade security with Razorpay. Every rupee is protected." },
  { icon:"🤖", c:"#ede7f6",      tc:"#6a1b9a",     title:"AI-Powered Writing",   body:"Gemini AI writes descriptions, reward ideas and risk assessments." },
  { icon:"📊", c:"#fff3e0",      tc:"#e65100",     title:"Live Analytics",        body:"Track backers and daily funding from your real-time dashboard." },
  { icon:"🎯", c:"#fce4ec",      tc:"#c62828",     title:"Milestone System",     body:"Show transparent goals so backers trust exactly where money goes." },
  { icon:"💬", c:"#e3f2fd",      tc:"#1565c0",     title:"Community Updates",    body:"Built-in comments and impact reports keep backers engaged." },
];

const TESTIMONIALS = [
  { q:"MilestoFund helped me raise ₹8 lakh in 3 weeks. The AI pitch tools made all the difference.", name:"Priya Sharma", role:"Game Developer · Pune", stars:5 },
  { q:"Clean, professional, trustworthy. I've backed 12 projects here and every creator delivered.", name:"Arjun Nair",   role:"Serial Backer · Bangalore", stars:5 },
  { q:"Our documentary got fully funded in days. The community support was truly overwhelming.", name:"Meera Pillai", role:"Filmmaker · Chennai", stars:5 },
];

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const [trending,    setTrending]    = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [aiLoading,   setAiLoading]   = useState(false);

  useEffect(() => {
    projectService.getAll({ sort:"most-funded", limit:6 })
      .then((r) => setTrending(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    setAiLoading(true);
    projectService.getRecommended()
      .then((r) => setRecommended(r.data.data?.projects || []))
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [isLoggedIn]);

  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background:"var(--navy)" }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-[140px]" style={{ background:"rgba(26,158,143,0.25)" }}/>
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-[140px]" style={{ background:"rgba(245,166,35,0.15)" }}/>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"60px 60px" }}/>
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left copy */}
          <div>
            <div className="animate-fade-up delay-1 inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/12 bg-white/6 text-white/65 text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
              340+ projects funded · India's #1 platform
            </div>

            <h1 className="animate-fade-up delay-2 text-[clamp(3rem,7vw,5.5rem)] font-black text-white leading-[1.0] tracking-tight mb-6">
              Fund Ideas<br/>
              <span className="grad-hero">That Matter.</span>
            </h1>

            <p className="animate-fade-up delay-3 text-white/55 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg">
              Discover creative projects by passionate Indians. Back the ones you believe in — or launch your own campaign in minutes.
            </p>

            <div className="animate-fade-up delay-4 flex flex-wrap gap-3">
              <Link to="/discover"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[15px] font-semibold text-white transition-all hover:opacity-90 hover:shadow-xl hover:shadow-teal-500/25"
                style={{ background:"var(--teal)" }}>
                Explore Projects <ArrowRight className="h-4 w-4"/>
              </Link>
              <Link to="/create"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[15px] font-semibold text-white/80 border border-white/15 hover:bg-white/10 transition-all backdrop-blur-sm">
                Start a Campaign
              </Link>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-5 grid grid-cols-4 gap-0 mt-14 border border-white/10 rounded-2xl overflow-hidden divide-x divide-white/10">
              {STATS.map(({ val, label }) => (
                <div key={label} className="py-4 text-center bg-white/4">
                  <p className="text-xl font-black text-white">{val}</p>
                  <p className="text-xs text-white/40 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — feature card stack */}
          <div className="hidden lg:flex flex-col gap-4 animate-slide-r delay-3">
            {[
              { icon:"🚀", title:"Launch in minutes", sub:"5-step guided builder" },
              { icon:"🤖", title:"AI-powered pitch",  sub:"Gemini writes your description" },
              { icon:"💳", title:"Secure payments",   sub:"Razorpay · UPI · Cards · Wallets" },
              { icon:"📈", title:"Real-time analytics",sub:"Live dashboard & backer tracking" },
            ].map(({ icon, title, sub }) => (
              <div key={title}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/8 transition-colors">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 bg-white/8">{icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{sub}</p>
                </div>
                <CheckCircle className="h-4 w-4 ml-auto shrink-0" style={{ color:"var(--teal)" }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80 L1440 80 L1440 20 Q1080 80 720 40 Q360 0 0 40 Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* ─── SCROLLING CATEGORY TICKER ────────────────────────── */}
      <div className="py-6 border-b border-border bg-background overflow-hidden">
        <div className="flex gap-0 w-max animate-ticker">
          {["Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion",
            "Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion"].map((cat, i) => (
            <Link key={i} to={`/discover?category=${cat}`}
              className="inline-flex items-center gap-2 mx-2.5 px-4 py-2 rounded-full border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/30 transition-all whitespace-nowrap">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* ─── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-16">
          <span className="badge-teal inline-flex items-center px-3 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4">How it works</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Simple. Fast. Powerful.</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">From idea to funded in three steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW.map(({ n, emoji, title, body }) => (
            <div key={n} className="relative p-8 rounded-3xl border border-border bg-card card-lift group overflow-hidden">
              <span className="absolute top-5 right-6 text-[5rem] font-black text-border/40 leading-none select-none group-hover:text-primary/8 transition-colors">{n}</span>
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style={{ background:"var(--teal-lt)" }}>{emoji}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rule max-w-6xl mx-auto"/>

      {/* ─── TRENDING PROJECTS ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="badge-gold inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3"><Zap className="h-3 w-3"/>Trending Now</span>
            <h2 className="text-3xl sm:text-4xl font-black">Most Backed This Week</h2>
          </div>
          <Link to="/discover" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all">
            View all <ArrowRight className="h-4 w-4"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? Array.from({length:6}).map((_,i)=><CardSkeleton key={i}/>) : trending.map(p=><ProjectCard key={p.id} project={p}/>)}
        </div>
      </section>

      {/* ─── AI RECOMMENDATIONS ───────────────────────────────── */}
      {isLoggedIn && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge-teal inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest mb-3"><Sparkles className="h-3 w-3"/>For You</span>
              <h2 className="text-3xl sm:text-4xl font-black">Recommended Projects</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiLoading ? Array.from({length:3}).map((_,i)=><CardSkeleton key={i}/>) :
              recommended.length > 0 ? recommended.slice(0,3).map(p=><ProjectCard key={p.id} project={p}/>) : (
              <div className="col-span-3 text-center py-16 rounded-3xl border border-dashed">
                <Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/25"/>
                <p className="font-semibold mb-1">No recommendations yet</p>
                <p className="text-muted-foreground text-sm mb-5">Back a few projects to get personalised picks</p>
                <Link to="/discover" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:border-primary/40 transition-all">Explore Projects</Link>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="rule max-w-6xl mx-auto"/>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Why MilestoFund?</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">Built for Indian creators. Trusted by thousands of backers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon, c, tc, title, body }) => (
            <div key={title} className="p-7 rounded-3xl border border-border bg-card card-lift">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5" style={{ background:c, color:tc }}>{icon}</div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge-teal inline-flex items-center px-3 py-1.5 rounded-full text-xs uppercase tracking-widest mb-4">Testimonials</span>
            <h2 className="text-4xl font-black">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ q, name, role, stars }) => (
              <div key={name} className="bg-card rounded-3xl p-7 border border-border card-lift">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:stars}).map((_,i)=><Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400"/>)}
                </div>
                <p className="text-foreground/80 leading-relaxed text-sm mb-6">"{q}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background:"var(--teal)" }}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-28 px-5" style={{ background:"var(--navy)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[120px]" style={{ background:"rgba(26,158,143,0.2)" }}/>
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-[1.05]">
            Ready to fund<br/><span className="grad-hero">your big idea?</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-lg mx-auto">
            Thousands of backers are waiting to discover the next great Indian project. Yours could be next.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/create"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-[15px] text-white hover:opacity-90 transition-all hover:shadow-xl hover:shadow-teal-500/25"
              style={{ background:"var(--teal)" }}>
              Launch Your Campaign <ArrowRight className="h-5 w-5"/>
            </Link>
            <Link to="/discover"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-[15px] text-white/70 border border-white/15 hover:bg-white/10 transition-all">
              Browse Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
