import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Users, IndianRupee, FolderOpen, Edit, Plus, Eye, BarChart3, Rocket, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { userService, paymentService } from "../services/api";
import { PageLoader, RowSkeleton } from "../components/Loader";
import { Button } from "../components/ui/button";
import { Badge, Progress } from "../components/ui/index.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { formatMoney, fundingPct } from "../utils/format";

const TABS = ["My Projects", "Contributions", "Activity"];

export default function DashboardPage() {
  const [data,    setData]    = useState(null);
  const [contribs,setContribs]= useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState("My Projects");

  useEffect(() => {
    Promise.all([userService.getDashboard(), paymentService.getMyContributions()])
      .then(([dash, c]) => {
        setData(dash.data.data);
        setContribs(c.data.data.contributions || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const stats = [
    { label:"Total Raised",  value: formatMoney(data.totalRaised),  icon: IndianRupee,  bg:"bg-green-50 dark:bg-green-900/20",  color:"text-green-600" },
    { label:"Total Backers", value: data.totalBackers,               icon: Users,        bg:"bg-blue-50 dark:bg-blue-900/20",    color:"text-blue-600"  },
    { label:"My Projects",   value: data.projects.length,            icon: FolderOpen,   bg:"bg-purple-50 dark:bg-purple-900/20",color:"text-purple-600"},
    { label:"Backed",        value: contribs.length,                 icon: TrendingUp,   bg:"bg-orange-50 dark:bg-orange-900/20",color:"text-orange-600"},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Track your campaigns and contributions</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm shadow-primary/20">
          <Link to="/create"><Plus className="h-4 w-4 mr-2" />New Project</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, bg, color }) => (
          <Card key={label} className="overflow-hidden card-hover">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`h-4.5 w-4.5 ${color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {data.dailyData?.length > 0 && (
        <Card className="mb-8 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Daily Funding — Last 30 Days
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Live data</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.dailyData} margin={{ top:5, right:10, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize:11 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize:11 }} tickFormatter={(v) => `₹${v}`} width={60} />
                <Tooltip
                  formatter={(v) => [formatMoney(v), "Raised"]}
                  contentStyle={{ borderRadius:"12px", border:"1px solid hsl(var(--border))", background:"hsl(var(--card))" }}
                />
                <Area type="monotone" dataKey="amount" stroke="hsl(var(--primary))" strokeWidth={2.5}
                  fill="url(#colorAmt)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border mb-6">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── My Projects ── */}
      {tab === "My Projects" && (
        <div className="space-y-4">
          {data.projects.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-bold text-lg mb-1">No projects yet</h3>
              <p className="text-muted-foreground text-sm mb-6">Launch your first campaign and start raising funds</p>
              <Button asChild className="rounded-xl">
                <Link to="/create">Create Your First Project</Link>
              </Button>
            </div>
          ) : data.projects.map((p) => (
            <Card key={p.id} className="overflow-hidden card-hover">
              <CardContent className="pt-5 pb-5">
                <div className="flex gap-4 items-center">
                  {p.cover_image_url
                    ? <img src={p.cover_image_url} alt={p.title}
                        className="w-20 h-14 rounded-xl object-cover shrink-0 hidden sm:block" />
                    : <div className="w-20 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 hidden sm:flex items-center justify-center shrink-0">
                        <FolderOpen className="h-6 w-6 text-primary/40" />
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Link to={`/projects/${p.id}`} className="font-bold hover:text-primary transition-colors truncate">
                        {p.title}
                      </Link>
                      <Badge variant={p.status === "funded" ? "success" : p.status === "active" ? "default" : "secondary"}
                        className="text-xs capitalize shrink-0">{p.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm mb-2">
                      <span className="font-bold text-foreground">{formatMoney(p.amount_raised)}</span>
                      <span className="text-muted-foreground">of {formatMoney(p.goal_amount)}</span>
                      <span className="ml-auto font-semibold text-primary">{fundingPct(p.amount_raised, p.goal_amount).toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full progress-gradient transition-all duration-700"
                        style={{ width:`${Math.min(fundingPct(p.amount_raised, p.goal_amount), 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl">
                      <Link to={`/projects/${p.id}`}><Eye className="h-4 w-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl">
                      <Link to={`/projects/${p.id}/edit`}><Edit className="h-4 w-4" /></Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Contributions ── */}
      {tab === "Contributions" && (
        <div className="space-y-3">
          {contribs.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="h-8 w-8 text-muted-foreground/40" />
              </div>
              <h3 className="font-bold text-lg mb-1">No contributions yet</h3>
              <p className="text-muted-foreground text-sm mb-6">Back a project you believe in</p>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/discover">Discover Projects</Link>
              </Button>
            </div>
          ) : contribs.map((c) => (
            <Card key={c.id} className="card-hover">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                {c.projects?.cover_image_url
                  ? <img src={c.projects.cover_image_url} alt=""
                      className="w-14 h-10 rounded-lg object-cover shrink-0 hidden sm:block" />
                  : <div className="w-14 h-10 rounded-lg bg-muted hidden sm:flex items-center justify-center shrink-0">
                      <IndianRupee className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                }
                <div className="flex-1 min-w-0">
                  <Link to={`/projects/${c.project_id}`}
                    className="font-semibold hover:text-primary transition-colors truncate block">
                    {c.projects?.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg">{formatMoney(c.amount)}</p>
                  <p className="text-xs text-green-600 font-medium">Paid</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Activity ── */}
      {tab === "Activity" && (
        <div className="space-y-3">
          {data.recentContributions?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-4xl mb-3">📭</p>
              <p>No recent activity on your projects.</p>
            </div>
          ) : data.recentContributions?.map((c) => (
            <div key={c.id}
              className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:bg-muted/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center shrink-0">
                <IndianRupee className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  <span className="font-bold">{c.backer?.name || "An anonymous backer"}</span>
                  {" "}backed your project
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                </p>
              </div>
              <p className="font-bold text-lg shrink-0 text-green-600">+{formatMoney(c.amount)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
