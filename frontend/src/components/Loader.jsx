import { cn } from "../utils/cn";

export function Spinner({ className }) {
  return (
    <div className={cn("rounded-full border-[2.5px] border-current border-t-transparent animate-spin inline-block", className || "h-5 w-5")}/>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-border"/>
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-l-transparent border-r-transparent border-b-transparent animate-spin"/>
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading…</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="skeleton h-48 w-full rounded-none"/>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="skeleton h-6 w-6 rounded-full"/>
          <div className="skeleton h-3 w-28 rounded-full"/>
        </div>
        <div className="skeleton h-4 w-4/5 rounded-full"/>
        <div className="skeleton h-3 w-full rounded-full"/>
        <div className="skeleton h-3 w-2/3 rounded-full"/>
        <div className="skeleton h-2 w-full rounded-full mt-4"/>
        <div className="flex justify-between mt-2">
          <div className="skeleton h-3 w-1/3 rounded-full"/>
          <div className="skeleton h-3 w-1/5 rounded-full"/>
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
          <div className="skeleton h-12 w-12 rounded-xl shrink-0"/>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 w-1/2 rounded-full"/>
            <div className="skeleton h-3 w-1/3 rounded-full"/>
          </div>
          <div className="skeleton h-6 w-20 rounded-full"/>
        </div>
      ))}
    </div>
  );
}

export function ButtonLoader({ text = "Loading…" }) {
  return <span className="flex items-center gap-2"><Spinner className="h-4 w-4"/>{text}</span>;
}
