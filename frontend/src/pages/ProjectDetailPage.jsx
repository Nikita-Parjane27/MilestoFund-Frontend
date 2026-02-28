import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Share2, Bookmark, BookmarkCheck, Edit, MessageSquare, Bell, CheckCircle, Loader2, CreditCard, Lock } from "lucide-react";
import { projectService, paymentService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/Loader";
import { ProgressBar } from "../components/ProjectWidgets";
import { RewardTier }  from "../components/ProjectWidgets";
import { Button } from "../components/ui/button";
import { Badge, Input, Textarea, Separator } from "../components/ui/index.jsx";
import { Card, CardContent } from "../components/ui/card";
import { formatMoney } from "../utils/format";

const TABS = ["Story", "Rewards", "Updates", "Comments", "Impact"];

/* ── Mock Payment Modal ──────────────────────────────────────────── */
function MockPaymentModal({ amount, projectTitle, onSuccess, onCancel }) {
  const [step,    setStep]    = useState("form");   // form | processing | success
  const [cardNum, setCardNum] = useState("");
  const [expiry,  setExpiry]  = useState("");
  const [cvv,     setCvv]     = useState("");
  const [name,    setName]    = useState("");

  const formatCard   = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const formatExpiry = (v) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const handlePay = (e) => {
    e.preventDefault();
    setStep("processing");
    // Simulate processing delay
    setTimeout(() => {
      setStep("success");
      setTimeout(() => onSuccess(), 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={step==="form"?onCancel:undefined}/>

      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl border border-border overflow-hidden animate-scale-in">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border" style={{ background:"var(--navy)" }}>
          <div className="flex items-center gap-3 mb-1">
            <Lock className="h-4 w-4 text-emerald-400"/>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Secure Payment</span>
          </div>
          <p className="text-white font-bold text-lg">{projectTitle}</p>
          <p className="text-3xl font-black text-white mt-1">₹{amount?.toLocaleString()}</p>
        </div>

        <div className="p-6">
          {/* STEP: form */}
          {step === "form" && (
            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Cardholder Name</label>
                <Input placeholder="Nikita Parjane" value={name} onChange={e=>setName(e.target.value)} required className="h-11 rounded-xl"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Card Number</label>
                <div className="relative">
                  <Input placeholder="1234 5678 9012 3456" value={cardNum}
                    onChange={e=>setCardNum(formatCard(e.target.value))} required className="h-11 rounded-xl pr-12"/>
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Expiry</label>
                  <Input placeholder="MM/YY" value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} required className="h-11 rounded-xl"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">CVV</label>
                  <Input placeholder="•••" type="password" maxLength={3} value={cvv} onChange={e=>setCvv(e.target.value.replace(/\D/g,"").slice(0,3))} required className="h-11 rounded-xl"/>
                </div>
              </div>

              {/* Demo hint */}
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <span className="text-base">💡</span>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Demo mode — enter any values, no real payment</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onCancel}
                  className="flex-1 h-11 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 h-11 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background:"var(--teal)" }}>
                  Pay ₹{amount?.toLocaleString()}
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                <Lock className="h-3 w-3"/> Demo payment — no real money charged
              </p>
            </form>
          )}

          {/* STEP: processing */}
          {step === "processing" && (
            <div className="py-10 flex flex-col items-center gap-4 text-center">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-border"/>
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-l-transparent border-r-transparent border-b-transparent animate-spin"/>
              </div>
              <div>
                <p className="font-bold text-lg">Processing Payment…</p>
                <p className="text-muted-foreground text-sm mt-1">Please wait a moment</p>
              </div>
            </div>
          )}

          {/* STEP: success */}
          {step === "success" && (
            <div className="py-10 flex flex-col items-center gap-4 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-9 w-9 text-emerald-500"/>
              </div>
              <div>
                <p className="font-bold text-xl text-emerald-600 dark:text-emerald-400">Payment Successful!</p>
                <p className="text-muted-foreground text-sm mt-1">Redirecting to confirmation…</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id }              = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate            = useNavigate();

  const [project,     setProject]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [tab,         setTab]         = useState("Story");
  const [saved,       setSaved]       = useState(false);
  const [reward,      setReward]      = useState(null);
  const [amount,      setAmount]      = useState("");
  const [comment,     setComment]     = useState("");
  const [backing,     setBacking]     = useState(false);
  const [commentLoad, setCommentLoad] = useState(false);

  const refreshProject = () => {
    projectService.getById(id)
      .then((r) => setProject(r.data.data.project))
      .catch(() => {});
  };

  useEffect(() => {
    projectService.getById(id)
      .then((r) => setProject(r.data.data.project))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader/>;
  if (!project) return (
    <div className="text-center py-20">
      <p className="text-xl mb-4">Project not found.</p>
      <Button asChild><Link to="/discover">Browse Projects</Link></Button>
    </div>
  );

  const isCreator  = user?.id === project.creator_id;
  const backAmount = reward ? reward.min_amount : parseFloat(amount);

  const handleSave = async () => {
    if (!isLoggedIn) return navigate("/login");
    await projectService.toggleSave(id);
    setSaved(!saved);
  };

  // Handle Back This Project — opens real Razorpay popup
  const handleBack = async () => {
    if (!isLoggedIn) return navigate("/login");
    if (!backAmount || backAmount < 1) return alert("Please enter a valid amount.");

    setBacking(true);
    try {
      // Step 1 — create order on backend
      const orderRes = await paymentService.createOrder({
        projectId: id,
        amount:    backAmount,
        rewardId:  reward?.id,
      });

      const { orderId, amount: amountPaise, currency, keyId, projectTitle, userName, userEmail, mock } = orderRes.data.data;

      // Step 2a — MOCK fallback (if Razorpay keys not configured)
      if (mock || !keyId) {
        const verifyRes = await paymentService.verify({
          mock_order_id: orderId,
          projectId:     id,
          rewardId:      reward?.id || "",
          amount:        amountPaise,
        });
        const paymentId = verifyRes.data.data?.payment_id || `mock_${Date.now()}`;
        navigate(`/payment-success?payment_id=${paymentId}`);
        return;
      }

      // Step 2b — REAL Razorpay checkout popup
      const options = {
        key:          keyId,
        amount:       amountPaise,
        currency:     currency || "INR",
        name:         "MilestoFund",
        description:  `Back: ${projectTitle}`,
        order_id:     orderId,
        prefill: {
          name:  userName,
          email: userEmail,
        },
        theme: { color: "#1a9e8f" },

        handler: async (response) => {
          // Payment successful — verify on backend
          setBacking(true);
          try {
            const verifyRes = await paymentService.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              projectId:           id,
              rewardId:            reward?.id || "",
              amount:              amountPaise,  // in paise
              amountINR:           backAmount,   // in rupees (backup)
            });
            const paymentId = verifyRes.data.data?.payment_id || response.razorpay_payment_id;
            // Refresh project data to show updated amount
            refreshProject();
            navigate(`/payment-success?payment_id=${paymentId}&project_id=${id}`);
          } catch (err) {
            console.error("Verify error:", err);
            alert("Payment was successful but verification failed. Please contact support with payment ID: " + response.razorpay_payment_id);
            setBacking(false);
          }
        },

        modal: {
          ondismiss: () => { setBacking(false); },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.response?.data?.message || "Payment failed. Please try again.");
      setBacking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !isLoggedIn) return;
    setCommentLoad(true);
    try {
      const res = await projectService.addComment(id, { text: comment });
      setProject((p) => ({ ...p, comments: [...(p.comments || []), res.data.data.comment] }));
      setComment("");
    } finally { setCommentLoad(false); }
  };

  const handleDeleteComment = async (cid) => {
    await projectService.deleteComment(id, cid);
    setProject((p) => ({ ...p, comments: (p.comments || []).filter((c) => c.id !== cid) }));
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link> /
          <Link to="/discover" className="hover:text-foreground">Discover</Link> /
          <span className="text-foreground truncate max-w-[200px]">{project.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cover image */}
            <div className="rounded-2xl overflow-hidden bg-muted aspect-video">
              {project.cover_image_url
                ? <img src={project.cover_image_url} alt={project.title} className="w-full h-full object-cover"/>
                : <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background:"var(--teal-lt)" }}>🎯</div>
              }
            </div>

            {/* Title row */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                  <h1 className="text-3xl font-black">{project.title}</h1>
                </div>
                <div className="flex gap-2 shrink-0">
                  {isCreator && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/projects/${id}/edit`}><Edit className="h-4 w-4 mr-1"/>Edit</Link>
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={handleSave}>
                    {saved ? <BookmarkCheck className="h-4 w-4 text-primary"/> : <Bookmark className="h-4 w-4"/>}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => {
                    if (navigator.share) navigator.share({ title: project.title, url: window.location.href });
                    else navigator.clipboard.writeText(window.location.href);
                  }}>
                    <Share2 className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">{project.short_description}</p>
              <div className="flex items-center gap-2 mt-3">
                {project.creator?.avatar_url
                  ? <img src={project.creator.avatar_url} className="w-7 h-7 rounded-full object-cover" alt=""/>
                  : <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background:"var(--teal)" }}>{project.creator?.name?.[0]}</div>
                }
                <span className="text-sm">by <Link to={`/profile/${project.creator_id}`} className="font-semibold hover:underline text-primary">{project.creator?.name}</Link></span>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                      tab===t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}>
                    {t}{t==="Comments" && project.comments?.length ? ` (${project.comments.length})` : ""}
                  </button>
                ))}
              </div>

              {tab==="Story" && (
                <div className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-base leading-relaxed">{project.description}</div>
                  {project.milestones?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Project Milestones</h3>
                      <div className="space-y-3">
                        {[...project.milestones].sort((a,b)=>a.percentage-b.percentage).map((m) => (
                          <div key={m.id} className={`flex items-start gap-3 p-4 rounded-xl border ${m.reached?"border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20":"border-border bg-card"}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${m.reached?"bg-emerald-500 text-white":"bg-muted text-muted-foreground"}`}>
                              {m.reached?"✓":m.percentage+"%"}
                            </div>
                            <div>
                              <p className="font-semibold">{m.title}</p>
                              <p className="text-sm text-muted-foreground">{m.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatMoney(m.amount)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.impact_published && (
                    <div className="mt-8 p-6 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20">
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-3">🌱 Impact Report</h3>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">{project.impact_summary}</p>
                      {project.impact_highlights?.length > 0 && (
                        <ul className="space-y-2">{project.impact_highlights.map((h,i)=>(
                          <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                            <span className="text-emerald-500 font-bold">✓</span>{h}
                          </li>
                        ))}</ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab==="Rewards" && (
                <div className="space-y-4">
                  {project.rewards?.length ? project.rewards.map((r) => (
                    <RewardTier key={r.id} reward={r} selected={reward?.id===r.id}
                      onSelect={(rw) => { setReward(reward?.id===rw.id?null:rw); setAmount(rw.min_amount.toString()); }}/>
                  )) : <p className="text-muted-foreground text-center py-8">No reward tiers defined.</p>}
                </div>
              )}

              {tab==="Updates" && (
                <div className="space-y-4">
                  {isCreator && (
                    <Card>
                      <CardContent className="pt-5">
                        <p className="font-semibold text-sm mb-3">Post an Update</p>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.target);
                          await projectService.postUpdate(id, { title:fd.get("title"), body:fd.get("body") });
                          const r = await projectService.getById(id);
                          setProject(r.data.data.project);
                          e.target.reset();
                        }} className="space-y-3">
                          <Input name="title" placeholder="Update title" required/>
                          <Textarea name="body" placeholder="Share progress with your backers…" rows={4} required/>
                          <Button type="submit" size="sm"><Bell className="h-4 w-4 mr-1.5"/>Post Update</Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                  {project.project_updates?.length ? [...project.project_updates].reverse().map((u) => (
                    <Card key={u.id}>
                      <CardContent className="pt-5">
                        <h4 className="font-bold mb-1">{u.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3">{new Date(u.created_at).toLocaleDateString()}</p>
                        <p className="text-sm whitespace-pre-wrap">{u.body}</p>
                      </CardContent>
                    </Card>
                  )) : <p className="text-muted-foreground text-center py-8">No updates yet.</p>}
                </div>
              )}

              {tab==="Comments" && (
                <div className="space-y-5">
                  {isLoggedIn && (
                    <form onSubmit={handleComment} className="space-y-3">
                      <Textarea value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Share your thoughts…" rows={3} required/>
                      <Button type="submit" size="sm" disabled={commentLoad||!comment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-1.5"/>{commentLoad?"Posting…":"Post Comment"}
                      </Button>
                    </form>
                  )}
                  <Separator/>
                  {project.comments?.length ? [...project.comments].reverse().map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background:"var(--teal)" }}>
                        {c.author?.avatar_url
                          ? <img src={c.author.avatar_url} className="w-full h-full object-cover rounded-full" alt=""/>
                          : c.author?.name?.[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{c.author?.name}</span>
                          <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                          {user?.id===c.author_id && (
                            <button onClick={()=>handleDeleteComment(c.id)} className="text-xs text-destructive hover:underline ml-auto">Delete</button>
                          )}
                        </div>
                        <p className="text-sm mt-1">{c.text}</p>
                      </div>
                    </div>
                  )) : <p className="text-muted-foreground text-center py-8">No comments yet. Be the first!</p>}
                </div>
              )}

              {tab==="Impact" && (
                <div className="space-y-5">
                  {isCreator && !project.impact_published && (
                    <Card className="border-emerald-200 dark:border-emerald-800">
                      <CardContent className="pt-5">
                        <h3 className="font-bold mb-1 flex items-center gap-2">🌱 Publish Impact Report</h3>
                        <p className="text-sm text-muted-foreground mb-4">Share how your project made a difference.</p>
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          const fd = new FormData(e.target);
                          await projectService.publishImpact(id, { summary:fd.get("summary"), highlights:fd.get("highlights") });
                          const r = await projectService.getById(id);
                          setProject(r.data.data.project);
                          e.target.reset();
                        }} className="space-y-3">
                          <Textarea name="summary" placeholder="Summarise the impact your project achieved..." rows={4} required/>
                          <Textarea name="highlights" placeholder="Key highlights (one per line)" rows={4}/>
                          <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Publish Impact Report</Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                  {project.impact_published ? (
                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20">
                      <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-3">🌱 Impact Report</h3>
                      <p className="text-emerald-700 dark:text-emerald-300 mb-4">{project.impact_summary}</p>
                      {project.impact_highlights?.length > 0 && (
                        <ul className="space-y-2">{project.impact_highlights.map((h,i)=>(
                          <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 dark:text-emerald-300">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>{h}
                          </li>
                        ))}</ul>
                      )}
                    </div>
                  ) : (!isCreator && (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-3xl mb-2">🌱</p>
                      <p className="font-medium">No impact report yet</p>
                      <p className="text-sm">The creator will publish one after the project ships.</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-5">
            <ProgressBar amountRaised={project.amount_raised} goalAmount={project.goal_amount}
              deadline={project.deadline} backerCount={project.backer_count}/>

            {project.status==="active" && (
              <Card>
                <CardContent className="pt-5 space-y-4">
                  <h3 className="font-bold text-lg">Back this Project</h3>

                  {reward ? (
                    <div className="p-3 rounded-xl border border-primary bg-primary/5 text-sm">
                      <p className="font-semibold">{reward.title}</p>
                      <p className="text-muted-foreground">₹{reward.min_amount}+ pledge</p>
                      <button onClick={()=>setReward(null)} className="text-xs text-destructive hover:underline mt-1">Remove reward</button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Enter pledge amount (₹)</p>
                      <Input type="number" min={1} step="1" placeholder="e.g. 500" value={amount}
                        onChange={(e)=>setAmount(e.target.value)} className="rounded-xl"/>
                    </div>
                  )}

                  <button onClick={handleBack} disabled={backing||(!reward&&!amount)}
                    className="w-full h-11 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background:"var(--teal)" }}>
                    {backing
                      ? <><Loader2 className="h-4 w-4 animate-spin"/>Recording…</>
                      : <><CreditCard className="h-4 w-4"/>Back This Project</>
                    }
                  </button>

                  {/* Razorpay secure badge */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2">
                    <span>🔒</span>
                    <span className="font-medium">Secured by Razorpay · Test Mode</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Creator card */}
            <Card>
              <CardContent className="pt-5">
                <h3 className="font-semibold mb-3">About the Creator</h3>
                <div className="flex items-center gap-3">
                  {project.creator?.avatar_url
                    ? <img src={project.creator.avatar_url} className="w-10 h-10 rounded-full object-cover" alt=""/>
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background:"var(--teal)" }}>{project.creator?.name?.[0]}</div>
                  }
                  <div>
                    <p className="font-semibold">{project.creator?.name}</p>
                    {project.creator?.bio && <p className="text-xs text-muted-foreground line-clamp-2">{project.creator.bio}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
