import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { projectService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "../components/Loader";
import { Button }   from "../components/ui/button";
import { Input, Label, Textarea } from "../components/ui/index.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const CATEGORIES = ["Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion","Other"];
const STATUSES   = ["draft","active","ended","cancelled"];

export default function EditProjectPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const [form, setForm] = useState({
    title: "", short_description: "", description: "", category: "",
    cover_image_url: "", goal_amount: "", deadline: "", status: "active", tags: "",
  });

  useEffect(() => {
    projectService.getById(id)
      .then((r) => {
        const p = r.data.data.project;
        if (p.creator_id !== user?.id) { navigate("/dashboard"); return; }
        setForm({
          title:             p.title || "",
          short_description: p.short_description || "",
          description:       p.description || "",
          category:          p.category || "",
          cover_image_url:   p.cover_image_url || "",
          goal_amount:       p.goal_amount?.toString() || "",
          deadline:          p.deadline || "",
          status:            p.status || "active",
          tags:              (p.tags || []).join(", "),
        });
      })
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSuccess("");
    try {
      await projectService.update(id, {
        ...form,
        goal_amount: parseFloat(form.goal_amount),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      setSuccess("Project updated successfully!");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This will permanently delete your project and cannot be undone.")) return;
    setDeleting(true);
    try {
      await projectService.delete(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project.");
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground text-sm">Update your campaign details</p>
        </div>
      </div>

      {success && (
        <div className="mb-5 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Project Title *</Label>
              <Input value={form.title} onChange={handleChange("title")} required />
            </div>
            <div className="space-y-1.5">
              <Label>Short Description</Label>
              <Input value={form.short_description} onChange={handleChange("short_description")} maxLength={200} placeholder="One-line tagline" />
            </div>
            <div className="space-y-1.5">
              <Label>Category *</Label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Cover Image URL</Label>
              <Input value={form.cover_image_url} onChange={handleChange("cover_image_url")} placeholder="https://..." />
              {form.cover_image_url && (
                <img src={form.cover_image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg border" onError={(e) => e.target.style.display = "none"} />
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input value={form.tags} onChange={handleChange("tags")} placeholder="e.g. tech, innovation, startup" />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Details */}
        <Card>
          <CardHeader><CardTitle className="text-base">Campaign Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Description *</Label>
              <Textarea value={form.description} onChange={handleChange("description")} rows={8} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Funding Goal ($) *</Label>
                <Input type="number" min={100} value={form.goal_amount} onChange={handleChange("goal_amount")} required />
              </div>
              <div className="space-y-1.5">
                <Label>Deadline *</Label>
                <Input type="date" value={form.deadline} onChange={handleChange("deadline")} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader><CardTitle className="text-base">Campaign Status</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
              <p className="text-xs text-muted-foreground">
                {form.status === "draft" && "Draft projects are not publicly visible."}
                {form.status === "active" && "Active projects are visible and accepting contributions."}
                {form.status === "ended" && "Ended projects are visible but no longer accept contributions."}
                {form.status === "cancelled" && "Cancelled projects will be hidden from discover."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to={`/projects/${id}`}>View Project</Link>
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <Card className="mt-8 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete this project and all associated data (rewards, milestones, contributions). This action cannot be undone.
          </p>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete Project"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
