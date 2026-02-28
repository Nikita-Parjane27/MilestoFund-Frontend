// ── PaymentSuccessPage ────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, IndianRupee, ArrowRight, Home, LayoutDashboard } from "lucide-react";
import { paymentService } from "../services/api";
import { Button } from "../components/ui/button";
import { PageLoader } from "../components/Loader";

export function PaymentSuccessPage() {
  const [params]        = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setL] = useState(true);

  useEffect(() => {
    const pid = params.get("payment_id");
    if (pid) {
      paymentService.getContribution(pid)
        .then((r) => setData(r.data.data))
        .catch(() => {})
        .finally(() => setL(false));
    } else { setL(false); }
  }, []);

  if (loading) return <PageLoader />;
  const contribution = data?.contribution;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-green-50/50 to-background dark:from-green-900/10">
      <div className="w-full max-w-md text-center animate-bounce-in">
        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-28 h-28 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <span className="absolute -top-2 -right-2 text-3xl animate-float">🎉</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">Your contribution has been processed via Razorpay.</p>

        {contribution && (
          <div className="bg-card border rounded-2xl p-5 mb-6 text-left space-y-3 shadow-sm">
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Project</span>
              <span className="font-semibold text-sm text-right max-w-[60%] truncate">{contribution.projects?.title}</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Amount Backed</span>
              <span className="font-bold text-xl flex items-center gap-1 text-green-600">
                <IndianRupee className="h-4 w-4" />{contribution.amount?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-muted-foreground">Payment ID</span>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded-lg text-muted-foreground">
                {contribution.razorpay_payment_id}
              </span>
            </div>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-8">
          You'll receive updates from the creator as the project progresses. Thank you for backing an idea you believe in! 🚀
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          {contribution?.project_id && (
            <Button asChild variant="outline" className="rounded-xl">
              <Link to={`/projects/${contribution.project_id}`}>View Project</Link>
            </Button>
          )}
          <Button asChild className="rounded-xl">
            <Link to="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />My Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── ProfilePage ────────────────────────────────────────────────────────
import { useParams } from "react-router-dom";
import { Globe, Calendar, TrendingUp } from "lucide-react";
import { userService } from "../services/api";
import { Card, CardContent } from "../components/ui/card";
import { Badge, Progress } from "../components/ui/index.jsx";
import { formatMoney, fundingPct } from "../utils/format";

export function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile(id)
      .then((r) => setProfile(r.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (!profile) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">👤</p>
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <Button asChild variant="outline" className="rounded-xl mt-2">
          <Link to="/discover">Browse Projects</Link>
        </Button>
      </div>
    </div>
  );

  const { user, projects } = profile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 animate-fade-in">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10 p-6 rounded-2xl border bg-card shadow-sm">
        {user.avatar_url
          ? <img src={user.avatar_url} alt={user.name}
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-border shrink-0" />
          : <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-extrabold text-4xl shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
        }
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold mb-1">{user.name}</h1>
          {user.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-3">{user.bio}</p>}
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            {user.website && (
              <a href={user.website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Globe className="h-3.5 w-3.5" />{user.website}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Joined {new Date(user.created_at).toLocaleDateString("en-IN", { month:"long", year:"numeric" })}
            </span>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="font-extrabold text-lg">{projects.length}</p>
              <p className="text-xs text-muted-foreground">Projects</p>
            </div>
            {user.total_backed > 0 && (
              <div className="text-center">
                <p className="font-extrabold text-lg">{formatMoney(user.total_backed)}</p>
                <p className="text-xs text-muted-foreground">Total Backed</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" /> Projects ({projects.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-2">🎯</p>
            <p>No projects yet.</p>
          </div>
        ) : projects.map((p) => (
          <Link key={p.id} to={`/projects/${p.id}`}>
            <Card className="card-hover h-full">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold line-clamp-2 leading-tight">{p.title}</h3>
                  <Badge variant={p.status === "funded" ? "success" : p.status === "active" ? "default" : "secondary"}
                    className="text-xs capitalize shrink-0">{p.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{p.short_description}</p>
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary mb-2">
                  <div className="h-full rounded-full progress-gradient"
                    style={{ width:`${Math.min(fundingPct(p.amount_raised, p.goal_amount), 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatMoney(p.amount_raised)}</span>
                  <span>{fundingPct(p.amount_raised, p.goal_amount).toFixed(0)}% of {formatMoney(p.goal_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── SavedPage ──────────────────────────────────────────────────────────
import { Bookmark } from "lucide-react";
export function SavedPage() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  
  useEffect(() => {
    userService.getSaved()
      .then((r) => setProjects(r.data.data.projects || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Bookmark className="h-7 w-7 text-primary" /> Saved Projects
        </h1>
        <p className="text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} saved</p>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed">
          <Bookmark className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <h3 className="font-bold text-lg mb-1">No saved projects yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Bookmark projects you're interested in</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/discover">Discover Projects</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <Card className="card-hover h-full">
                {p.cover_image_url && (
                  <div className="h-40 overflow-hidden rounded-t-xl">
                    <img src={p.cover_image_url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="pt-4">
                  <h3 className="font-bold line-clamp-2 mb-1 hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.short_description}</p>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary mb-1.5">
                    <div className="h-full rounded-full progress-gradient"
                      style={{ width:`${Math.min(fundingPct(p.amount_raised, p.goal_amount), 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{formatMoney(p.amount_raised)}</span>
                    <span>{fundingPct(p.amount_raised, p.goal_amount).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── NotFoundPage ───────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-up">
        <p className="text-[9rem] font-black leading-none mb-4" style={{ color:"hsl(var(--border))" }}>404</p>
        <h1 className="text-2xl font-extrabold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="rounded-xl">
            <Link to="/"><Home className="h-4 w-4 mr-2" />Go Home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/discover">Discover Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
