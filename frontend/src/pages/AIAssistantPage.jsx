import { useState } from "react";
import { Sparkles, Wand2, RotateCcw, Copy, Check, Lock, ChevronRight } from "lucide-react";
import { aiService } from "../services/api";
import { Button }  from "../components/ui/button";
import { Input, Label, Textarea } from "../components/ui/index.jsx";
import { Card, CardContent } from "../components/ui/card";
import { Spinner } from "../components/Loader";

const TOOLS = [
  { id:"description", label:"Description Writer", icon:"✍️", color:"bg-blue-50 dark:bg-blue-900/20 text-blue-600",   desc:"Full campaign description from your idea" },
  { id:"title",       label:"Title Generator",    icon:"💡", color:"bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600", desc:"5 catchy campaign title ideas" },
  { id:"rewards",     label:"Reward Tier Ideas",  icon:"🎁", color:"bg-green-50 dark:bg-green-900/20 text-green-600",  desc:"Creative reward suggestions" },
  { id:"pitch",       label:"Pitch Improver",     icon:"🚀", color:"bg-purple-50 dark:bg-purple-900/20 text-purple-600",desc:"Paste your draft — AI rewrites it" },
  { id:"risks",       label:"Risks & Challenges", icon:"⚠️", color:"bg-orange-50 dark:bg-orange-900/20 text-orange-600",desc:"Identify risks + mitigation" },
];

const CATEGORIES = ["Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion","Other"];

function FormField({ label, required, children, hint }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function AIAssistantPage() {
  const [activeTool, setActiveTool] = useState("description");
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState("");
  const [error,      setError]      = useState("");
  const [copied,     setCopied]     = useState(false);

  const [inputs, setInputs] = useState({
    description: { title:"", category:"", summary:"", audience:"", features:"" },
    title:       { concept:"", category:"", audience:"" },
    rewards:     { title:"", category:"", goal:"", description:"" },
    pitch:       { pitch:"" },
    risks:       { title:"", category:"", description:"" },
  });

  const setField = (field, value) =>
    setInputs((prev) => ({ ...prev, [activeTool]: { ...prev[activeTool], [field]: value } }));

  const currentInputs = inputs[activeTool];

  const handleRun = async () => {
    setLoading(true); setError(""); setResult("");
    try {
      const res = await aiService.generate(activeTool, currentInputs);
      setResult(res.data.result || "No result returned.");
    } catch (err) {
      setError(err.response?.data?.message || "AI request failed. Make sure ANTHROPIC_API_KEY is set in backend .env");
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchTool = (id) => { setActiveTool(id); setResult(""); setError(""); };
  const tool = TOOLS.find((t) => t.id === activeTool);

  const CatSelect = ({ field }) => (
    <select value={currentInputs[field] || ""}
      onChange={(e) => setField(field, e.target.value)}
      className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
      <option value="">Select category</option>
      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
    </select>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
          <Sparkles className="h-4 w-4" /> Powered by Gemini
        </div>
        <h1 className="text-4xl font-extrabold mb-3">Creator AI Assistant</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Write better pitches, generate reward ideas, and launch with confidence — all with AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* ── Tool Sidebar ── */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 mb-3">Choose a Tool</p>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => switchTool(t.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 ${
                activeTool === t.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:bg-muted/30"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${t.color}`}>
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${activeTool === t.id ? "text-primary" : ""}`}>{t.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{t.desc}</p>
                </div>
                {activeTool === t.id && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
              </div>
            </button>
          ))}

          <div className="mt-4 p-4 rounded-2xl bg-muted/50 border flex gap-3">
            <Lock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              API key stays on backend server — never exposed to browser.
            </p>
          </div>
        </div>

        {/* ── Main Panel ── */}
        <div className="space-y-5">
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-4">

              {/* Tool title */}
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${tool?.color}`}>
                  {tool?.icon}
                </div>
                <div>
                  <h2 className="font-bold text-lg">{tool?.label}</h2>
                  <p className="text-xs text-muted-foreground">{tool?.desc}</p>
                </div>
              </div>

              {/* ── Description Writer ── */}
              {activeTool === "description" && <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Project Title" required>
                    <Input placeholder="e.g. EcoBottle Pro" value={currentInputs.title}
                      onChange={(e) => setField("title", e.target.value)} className="rounded-xl" />
                  </FormField>
                  <FormField label="Category" required>
                    <CatSelect field="category" />
                  </FormField>
                </div>
                <FormField label="One-line Summary" required hint="What is your project in one sentence?">
                  <Input placeholder="A self-cleaning bottle that filters any water in 3 seconds"
                    value={currentInputs.summary} onChange={(e) => setField("summary", e.target.value)} className="rounded-xl" />
                </FormField>
                <FormField label="Target Audience">
                  <Input placeholder="e.g. eco-conscious travellers, college students"
                    value={currentInputs.audience} onChange={(e) => setField("audience", e.target.value)} className="rounded-xl" />
                </FormField>
                <FormField label="Key Features / Benefits">
                  <Textarea placeholder="List the main features or benefits..." rows={3}
                    value={currentInputs.features} onChange={(e) => setField("features", e.target.value)} className="rounded-xl" />
                </FormField>
              </>}

              {/* ── Title Generator ── */}
              {activeTool === "title" && <>
                <FormField label="Describe Your Idea" required>
                  <Textarea placeholder="Describe what you're building in 2-3 sentences..." rows={4}
                    value={currentInputs.concept} onChange={(e) => setField("concept", e.target.value)} className="rounded-xl" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Category">
                    <CatSelect field="category" />
                  </FormField>
                  <FormField label="Target Audience">
                    <Input placeholder="e.g. gamers, parents..." value={currentInputs.audience}
                      onChange={(e) => setField("audience", e.target.value)} className="rounded-xl" />
                  </FormField>
                </div>
              </>}

              {/* ── Reward Tier Ideas ── */}
              {activeTool === "rewards" && <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Project Title" required>
                    <Input placeholder="e.g. EcoBottle Pro" value={currentInputs.title}
                      onChange={(e) => setField("title", e.target.value)} className="rounded-xl" />
                  </FormField>
                  <FormField label="Category">
                    <CatSelect field="category" />
                  </FormField>
                </div>
                <FormField label="Funding Goal (₹)" required>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">₹</span>
                    <Input type="number" placeholder="50000" value={currentInputs.goal}
                      onChange={(e) => setField("goal", e.target.value)} className="rounded-xl pl-7" />
                  </div>
                </FormField>
                <FormField label="Project Description">
                  <Textarea placeholder="Brief description of what you're building..." rows={3}
                    value={currentInputs.description} onChange={(e) => setField("description", e.target.value)} className="rounded-xl" />
                </FormField>
              </>}

              {/* ── Pitch Improver ── */}
              {activeTool === "pitch" && (
                <FormField label="Your Current Pitch" required hint="Paste your existing description — AI will make it more compelling">
                  <Textarea placeholder="Paste your current project pitch here (minimum ~50 words for best results)..."
                    rows={10} value={currentInputs.pitch}
                    onChange={(e) => setField("pitch", e.target.value)} className="rounded-xl" />
                </FormField>
              )}

              {/* ── Risks & Challenges ── */}
              {activeTool === "risks" && <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Project Title" required>
                    <Input placeholder="e.g. EcoBottle Pro" value={currentInputs.title}
                      onChange={(e) => setField("title", e.target.value)} className="rounded-xl" />
                  </FormField>
                  <FormField label="Category">
                    <CatSelect field="category" />
                  </FormField>
                </div>
                <FormField label="Project Description" required>
                  <Textarea placeholder="Describe your project in detail..." rows={5}
                    value={currentInputs.description} onChange={(e) => setField("description", e.target.value)} className="rounded-xl" />
                </FormField>
              </>}

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button onClick={handleRun} disabled={loading} className="w-full h-12 text-base font-semibold rounded-xl" size="lg">
                {loading
                  ? <span className="flex items-center gap-2"><Spinner className="h-5 w-5 text-white" /> AI is thinking…</span>
                  : <span className="flex items-center gap-2"><Wand2 className="h-5 w-5" /> Generate with AI</span>
                }
              </Button>
            </CardContent>
          </Card>

          {/* ── Result ── */}
          {result && (
            <Card className="border-primary/30 shadow-lg animate-fade-up">
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-bold">AI Result</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 font-semibold">Generated</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setResult(""); setError(""); }} className="rounded-xl text-xs">
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reset
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl text-xs">
                      {copied
                        ? <><Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />Copied!</>
                        : <><Copy className="h-3.5 w-3.5 mr-1.5" />Copy</>
                      }
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRun} className="rounded-xl text-xs">
                      <Wand2 className="h-3.5 w-3.5 mr-1.5" /> Regenerate
                    </Button>
                  </div>
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans bg-muted/50 p-5 rounded-xl border max-h-[500px] overflow-y-auto">
                  {result}
                </pre>
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                  <span>💡</span> Copy this to your project form and personalise it to match your own voice.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
