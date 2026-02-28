import { Link } from "react-router-dom";
import { Users, Clock } from "lucide-react";
import { formatMoney, daysLeft as calcDaysLeft, fundingPct } from "../utils/format";

export default function ProjectCard({ project }) {
  const pct     = parseFloat(project.funding_percentage ?? fundingPct(project.amount_raised, project.goal_amount));
  const days    = project.days_left ?? calcDaysLeft(project.deadline);
  const backers = project.backer_count ?? (project.contributions?.length ?? 0);
  const funded  = pct >= 100;
  const ending  = days > 0 && days <= 5;

  return (
    <div className="card-lift group rounded-2xl bg-card overflow-hidden">
      <Link to={`/projects/${project.id}`} className="block">
        {/* Cover */}
        <div className="relative h-48 overflow-hidden bg-secondary">
          {project.cover_image_url
            ? <img src={project.cover_image_url} alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            : <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background:"var(--teal-lt)" }}>
                💡
              </div>
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-black/70 text-foreground backdrop-blur-sm shadow-sm">
              {project.category}
            </span>
            {funded && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">✓ Funded</span>
            )}
            {ending && !funded && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm animate-pulse">⚡ Ending</span>
            )}
            {project.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm" style={{ background:"var(--gold)", color:"#1a1612" }}>★ Featured</span>
            )}
          </div>

          {/* Days pill */}
          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-sm">
              {days > 0 ? `${days}d left` : "Ended"}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Creator row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background"
              style={{ background:"var(--teal)" }}>
              {project.creator?.avatar_url
                ? <img src={project.creator.avatar_url} alt="" className="w-full h-full object-cover"/>
                : project.creator?.name?.[0]?.toUpperCase()
              }
            </div>
            <span className="text-xs text-muted-foreground font-medium truncate">{project.creator?.name}</span>
          </div>

          <h3 className="font-bold text-[15px] leading-snug mb-1.5 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {project.short_description || project.description}
          </p>

          {/* Progress */}
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden mb-2.5">
            <div className="progress-fill h-full transition-all duration-700" style={{ width:`${Math.min(pct,100)}%` }}/>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">{formatMoney(project.amount_raised)}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              funded
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-primary/10 text-primary"
            }`}>{Math.round(pct)}%</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5"/><b className="text-foreground/70">{backers}</b> backers</span>
            <span>of {formatMoney(project.goal_amount)}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
