import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { projectService } from "../services/api";
import ProjectCard from "../components/ProjectCard";
import { CardSkeleton } from "../components/Loader";
import { Input } from "../components/ui/index.jsx";

const CATS = ["All","Technology","Art","Music","Film","Food","Games","Health","Education","Community","Fashion","Other"];
const SORTS = [["newest","Newest"],["most-funded","Most Funded"],["ending-soon","Ending Soon"],["oldest","Oldest"]];

export default function DiscoverPage() {
  const [params] = useSearchParams();
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [total,     setTotal]     = useState(0);
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState(params.get("search") || "");
  const [category,  setCategory]  = useState(params.get("category") || "All");
  const [sort,      setSort]      = useState(params.get("sort") || "newest");
  const [draft,     setDraft]     = useState(search);

  const fetch = useCallback(async (reset=true) => {
    setLoading(true);
    try {
      const p = reset ? 1 : page;
      const res = await projectService.getAll({ search:search||undefined, category:category==="All"?undefined:category, sort, page:p, limit:12 });
      const data = res.data.data || [];
      setProjects(reset ? data : prev => [...prev,...data]);
      setTotal(res.data.meta?.total || data.length);
      if (reset) setPage(1);
    } catch { setProjects([]); }
    finally { setLoading(false); }
  }, [search, category, sort, page]);

  useEffect(() => { const t = setTimeout(() => setSearch(draft), 400); return () => clearTimeout(t); }, [draft]);
  useEffect(() => { fetch(true); }, [search, category, sort]);

  const clear = () => { setDraft(""); setSearch(""); setCategory("All"); setSort("newest"); };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Discover Projects</h1>
        <p className="text-muted-foreground">Find and back the next great Indian idea</p>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-[66px] z-30 bg-background/95 backdrop-blur-xl border-b border-border -mx-5 sm:-mx-8 px-5 sm:px-8 pb-4 pt-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search projects…" value={draft} onChange={e => setDraft(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border"/>
            {draft && <button onClick={() => { setDraft(""); setSearch(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4"/></button>}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0"/>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {SORTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          {(search || category !== "All" || sort !== "newest") && (
            <button onClick={clear} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <X className="h-4 w-4"/> Clear
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                category === cat
                  ? "text-white border-transparent shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
              style={category === cat ? { background:"var(--teal)", borderColor:"var(--teal)" } : {}}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!loading && (
        <p className="text-sm text-muted-foreground mb-6">
          {total > 0 ? `${projects.length} of ${total} projects` : "No projects found"}
          {search && <span className="font-semibold text-foreground"> for "{search}"</span>}
          {category !== "All" && <span className="font-semibold text-foreground"> in {category}</span>}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading
          ? Array.from({length:9}).map((_,i) => <CardSkeleton key={i}/>)
          : projects.length > 0
            ? projects.map(p => <ProjectCard key={p.id} project={p}/>)
            : (
              <div className="col-span-3 text-center py-24 rounded-3xl border border-dashed">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/25"/>
                <h3 className="font-bold text-xl mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">Try a different keyword or category</p>
                <button onClick={clear} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:border-primary/40 transition-all">Clear filters</button>
              </div>
            )
        }
      </div>

      {!loading && projects.length < total && (
        <div className="text-center mt-12">
          <button onClick={() => { setPage(p => p+1); fetch(false); }}
            className="px-8 py-3.5 rounded-2xl border border-border text-sm font-semibold hover:border-primary/40 transition-all hover:shadow-sm">
            Load More Projects
          </button>
        </div>
      )}
    </div>
  );
}
