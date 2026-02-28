import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Trash2, ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle, Image, Calendar, Tag, Target, FileText, Gift, Flag } from "lucide-react";
import { projectService } from "../services/api";
import { Button }  from "../components/ui/button";
import { Input, Label, Textarea } from "../components/ui/index.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Spinner } from "../components/Loader";

const STEPS = [
  { label:"Basics",     icon: FileText },
  { label:"Details",    icon: Target },
  { label:"Rewards",    icon: Gift },
  { label:"Milestones", icon: Flag },
  { label:"Review",     icon: Check },
];
const CATEGORIES = ["Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion","Other"];
const emptyReward = () => ({ title:"", description:"", min_amount:"", max_backers:"", items:[""], estimated_delivery:"" });
const emptyMilestone = () => ({ title:"", description:"", percentage:"", amount:"" });

// ── Field wrapper with validation display ──────────────────────
function Field({ label, error, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1">
        {label}{required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive animate-fade-up">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function CharCount({ value, max }) {
  const left = max - (value?.length || 0);
  return (
    <span className={`text-xs ${left < 20 ? "text-orange-500" : "text-muted-foreground"}`}>
      {left} chars left
    </span>
  );
}

// ── Per-step validators ────────────────────────────────────────
function validateBasics(basics) {
  const e = {};
  if (!basics.title.trim())              e.title = "Project title is required";
  else if (basics.title.length < 5)      e.title = "Title must be at least 5 characters";
  if (!basics.short_description.trim())  e.short_description = "Short description is required";
  else if (basics.short_description.length < 20) e.short_description = "Write at least 20 characters";
  if (!basics.category)                  e.category = "Please select a category";
  if (!basics.deadline)                  e.deadline = "Campaign deadline is required";
  else if (new Date(basics.deadline) <= new Date()) e.deadline = "Deadline must be in the future";
  return e;
}

function validateDetails(details) {
  const e = {};
  if (!details.description.trim())         e.description = "Full description is required";
  else if (details.description.length < 50) e.description = "Write at least 50 characters to tell your story";
  if (!details.goal_amount)                 e.goal_amount = "Funding goal is required";
  else if (parseFloat(details.goal_amount) < 100) e.goal_amount = "Minimum goal is ₹100";
  return e;
}

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState("");

  const [basics, setBasics]       = useState({ title:"", short_description:"", category:"", cover_image_url:"", deadline:"" });
  const [details, setDetails]     = useState({ description:"", goal_amount:"", tags:"" });
  const [rewards, setRewards]     = useState([emptyReward()]);
  const [milestones, setMilestones] = useState([emptyMilestone()]);

  // Reward helpers
  const addReward    = () => setRewards((r) => [...r, emptyReward()]);
  const removeReward = (i) => setRewards((r) => r.filter((_, idx) => idx !== i));
  const updateReward = (i, f, v) => setRewards((r) => r.map((rw, idx) => idx === i ? { ...rw, [f]: v } : rw));
  const addItem    = (ri) => setRewards((r) => r.map((rw, idx) => idx === ri ? { ...rw, items: [...rw.items, ""] } : rw));
  const updateItem = (ri, ii, v) => setRewards((r) => r.map((rw, idx) => idx === ri ? { ...rw, items: rw.items.map((it, ij) => ij === ii ? v : it) } : rw));
  const removeItem = (ri, ii) => setRewards((r) => r.map((rw, idx) => idx === ri ? { ...rw, items: rw.items.filter((_, ij) => ij !== ii) } : rw));

  // Milestone helpers
  const addMilestone    = () => setMilestones((m) => [...m, emptyMilestone()]);
  const removeMilestone = (i) => setMilestones((m) => m.filter((_, idx) => idx !== i));
  const updateMilestone = (i, f, v) => setMilestones((m) => m.map((ms, idx) => idx === i ? { ...ms, [f]: v } : ms));

  const tryNextStep = () => {
    let e = {};
    if (step === 0) e = validateBasics(basics);
    if (step === 1) e = validateDetails(details);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleSubmit = async () => {
    setLoading(true); setApiError("");
    try {
      const payload = {
        ...basics, ...details,
        goal_amount: parseFloat(details.goal_amount),
        rewards:    rewards.filter((r) => r.title && r.min_amount).map((r) => ({
          title: r.title, description: r.description,
          min_amount: parseFloat(r.min_amount),
          max_backers: r.max_backers ? parseInt(r.max_backers) : null,
          items: r.items.filter(Boolean),
          estimated_delivery: r.estimated_delivery,
        })),
        milestones: milestones.filter((m) => m.title && m.percentage && m.amount).map((m) => ({
          title: m.title, description: m.description,
          percentage: parseInt(m.percentage), amount: parseFloat(m.amount),
        })),
      };
      const res = await projectService.create(payload);
      navigate(`/projects/${res.data.data.project.id}`);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to create project. Please try again.");
    } finally { setLoading(false); }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Create a Project</h1>
        <p className="text-muted-foreground">Share your idea and bring it to life with community support</p>
      </div>

      {/* AI Banner */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Need help writing your pitch?</p>
          <p className="text-xs text-muted-foreground">Use AI to generate descriptions, reward ideas, and risk analysis.</p>
        </div>
        <Button size="sm" variant="outline" asChild className="shrink-0 rounded-xl">
          <Link to="/ai">✨ AI Tools</Link>
        </Button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8 gap-0">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                i < step  ? "bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-green-900/40"
                : i === step ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110"
                : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 transition-all duration-500 ${i < step ? "bg-green-500" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            {(() => { const { icon: Icon } = STEPS[step]; return <Icon className="h-5 w-5 text-primary" />; })()}
            {STEPS[step].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">

          {/* ── STEP 0: BASICS ── */}
          {step === 0 && <>
            <Field label="Project Title" required error={errors.title}
              hint="Make it short, specific, and memorable">
              <div className="relative">
                <Input placeholder="e.g. EcoBottle Pro — Sustainable Hydration" value={basics.title}
                  onChange={(e) => { setBasics((b) => ({ ...b, title: e.target.value })); setErrors((er) => ({ ...er, title:"" })); }}
                  className={errors.title ? "border-destructive" : ""} maxLength={80} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CharCount value={basics.title} max={80} />
                </div>
              </div>
            </Field>

            <Field label="Short Description" required error={errors.short_description}
              hint="One sentence that hooks visitors instantly">
              <div className="relative">
                <Input placeholder="e.g. A self-cleaning water bottle that filters any water in seconds"
                  value={basics.short_description} maxLength={200}
                  onChange={(e) => { setBasics((b) => ({ ...b, short_description: e.target.value })); setErrors((er) => ({ ...er, short_description:"" })); }}
                  className={errors.short_description ? "border-destructive" : ""} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CharCount value={basics.short_description} max={200} />
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required error={errors.category}>
                <select value={basics.category}
                  onChange={(e) => { setBasics((b) => ({ ...b, category: e.target.value })); setErrors((er) => ({ ...er, category:"" })); }}
                  className={`flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none transition-shadow ${errors.category ? "border-destructive" : "border-input"}`}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Campaign Deadline" required error={errors.deadline}>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="date" min={today} value={basics.deadline}
                    onChange={(e) => { setBasics((b) => ({ ...b, deadline: e.target.value })); setErrors((er) => ({ ...er, deadline:"" })); }}
                    className={`pl-10 ${errors.deadline ? "border-destructive" : ""}`} />
                </div>
              </Field>
            </div>

            <Field label="Cover Image URL" hint="Paste a direct image link — leave blank to use a placeholder">
              <div className="relative">
                <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="https://example.com/my-project-image.jpg"
                  value={basics.cover_image_url}
                  onChange={(e) => setBasics((b) => ({ ...b, cover_image_url: e.target.value }))}
                  className="pl-10" />
              </div>
              {basics.cover_image_url && (
                <img src={basics.cover_image_url} alt="preview" onError={(e) => e.target.style.display="none"}
                  className="mt-2 h-32 w-full object-cover rounded-xl border" />
              )}
            </Field>
          </>}

          {/* ── STEP 1: DETAILS ── */}
          {step === 1 && <>
            <Field label="Full Description" required error={errors.description}
              hint="Tell your story — what problem do you solve? Why should people back you?">
              <Textarea placeholder="We're building something extraordinary because..." rows={9}
                value={details.description}
                onChange={(e) => { setDetails((d) => ({ ...d, description: e.target.value })); setErrors((er) => ({ ...er, description:"" })); }}
                className={errors.description ? "border-destructive" : ""} />
              <div className="flex justify-between items-center mt-1">
                <span />
                <span className="text-xs text-muted-foreground">{details.description.length} chars</span>
              </div>
            </Field>

            <Field label="Funding Goal (₹)" required error={errors.goal_amount} hint="Minimum ₹100">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₹</span>
                <Input type="number" min={100} step="1" placeholder="50000"
                  value={details.goal_amount}
                  onChange={(e) => { setDetails((d) => ({ ...d, goal_amount: e.target.value })); setErrors((er) => ({ ...er, goal_amount:"" })); }}
                  className={`pl-7 ${errors.goal_amount ? "border-destructive" : ""}`} />
              </div>
            </Field>

            <Field label="Tags" hint="Comma-separated keywords to help people find your project">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="e.g. eco, sustainability, product, startup"
                  value={details.tags}
                  onChange={(e) => setDetails((d) => ({ ...d, tags: e.target.value }))}
                  className="pl-10" />
              </div>
            </Field>
          </>}

          {/* ── STEP 2: REWARDS ── */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Create reward tiers to motivate backers. At least one reward is recommended.</p>
              {rewards.map((rw, ri) => (
                <Card key={ri} className="border-2 border-dashed hover:border-primary/40 transition-colors">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{ri + 1}</div>
                        <h4 className="font-semibold text-sm">Reward Tier {ri + 1}</h4>
                      </div>
                      {rewards.length > 1 && (
                        <button onClick={() => removeReward(ri)}
                          className="text-xs text-destructive hover:underline flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <Input placeholder="Tier title (e.g. Early Bird Special)" value={rw.title}
                      onChange={(e) => updateReward(ri, "title", e.target.value)} />
                    <Textarea placeholder="Describe what backers receive..." rows={2} value={rw.description}
                      onChange={(e) => updateReward(ri, "description", e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Min. Pledge (₹) *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
                          <Input type="number" min={1} placeholder="500" value={rw.min_amount}
                            onChange={(e) => updateReward(ri, "min_amount", e.target.value)} className="pl-7" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max Backers</Label>
                        <Input type="number" min={1} placeholder="Unlimited" value={rw.max_backers}
                          onChange={(e) => updateReward(ri, "max_backers", e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Est. Delivery Date</Label>
                      <Input placeholder="e.g. March 2026" value={rw.estimated_delivery}
                        onChange={(e) => updateReward(ri, "estimated_delivery", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Items Included</Label>
                      {rw.items.map((item, ii) => (
                        <div key={ii} className="flex gap-2">
                          <Input placeholder={`Item ${ii + 1}`} value={item}
                            onChange={(e) => updateItem(ri, ii, e.target.value)} />
                          {rw.items.length > 1 && (
                            <button onClick={() => removeItem(ri, ii)}
                              className="text-destructive hover:text-destructive/70 shrink-0">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => addItem(ri)}
                        className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Plus className="h-3 w-3" /> Add item
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addReward} className="w-full rounded-xl border-dashed h-11">
                <Plus className="h-4 w-4 mr-2" /> Add Reward Tier
              </Button>
            </div>
          )}

          {/* ── STEP 3: MILESTONES ── */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Milestones show backers your roadmap. Define what you'll achieve at each funding level.</p>
              {milestones.map((ms, mi) => (
                <Card key={mi} className="border-2 border-dashed hover:border-primary/40 transition-colors">
                  <CardContent className="pt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">{mi + 1}</div>
                        <h4 className="font-semibold text-sm">Milestone {mi + 1}</h4>
                      </div>
                      {milestones.length > 1 && (
                        <button onClick={() => removeMilestone(mi)}
                          className="text-xs text-destructive hover:underline flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <Input placeholder="Milestone title (e.g. First Prototype Ready)" value={ms.title}
                      onChange={(e) => updateMilestone(mi, "title", e.target.value)} />
                    <Textarea placeholder="What will you achieve at this stage?" rows={2} value={ms.description}
                      onChange={(e) => updateMilestone(mi, "description", e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">% of Goal (1–100)</Label>
                        <Input type="number" min={1} max={100} placeholder="25" value={ms.percentage}
                          onChange={(e) => updateMilestone(mi, "percentage", e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Target Amount (₹)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">₹</span>
                          <Input type="number" min={1} placeholder="12500" value={ms.amount}
                            onChange={(e) => updateMilestone(mi, "amount", e.target.value)} className="pl-7" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" onClick={addMilestone} className="w-full rounded-xl border-dashed h-11">
                <Plus className="h-4 w-4 mr-2" /> Add Milestone
              </Button>
            </div>
          )}

          {/* ── STEP 4: REVIEW ── */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-5 rounded-2xl bg-muted/50 border space-y-4">
                <h3 className="font-bold text-lg">{basics.title}</h3>
                <p className="text-sm text-muted-foreground">{basics.short_description}</p>
                {basics.cover_image_url && (
                  <img src={basics.cover_image_url} alt="cover"
                    className="w-full h-40 object-cover rounded-xl" />
                )}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  {[
                    ["Category",  basics.category],
                    ["Deadline",  basics.deadline],
                    ["Goal",      `₹${parseFloat(details.goal_amount || 0).toLocaleString("en-IN")}`],
                    ["Rewards",   `${rewards.filter((r) => r.title).length} tiers`],
                  ].map(([k, v]) => (
                    <div key={k} className="text-center p-3 rounded-xl bg-background border">
                      <p className="text-xs text-muted-foreground mb-0.5">{k}</p>
                      <p className="font-bold text-sm">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
                <Check className="h-5 w-5 shrink-0" />
                Everything looks great! Your campaign will go live immediately after launching.
              </div>
            </div>
          )}

          {apiError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />{apiError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="rounded-xl">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            <div className="flex-1" />
            {step < STEPS.length - 1 ? (
              <Button onClick={tryNextStep} className="rounded-xl px-6">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="rounded-xl px-8 h-12 text-base font-semibold min-w-[160px]">
                {loading ? <Spinner className="h-5 w-5 text-white" /> : "Launch Project 🚀"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
