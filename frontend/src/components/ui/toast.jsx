import { cn } from "../../utils/cn";

export function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div key={t.id} onClick={() => dismiss(t.id)}
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg shadow-lg border cursor-pointer",
            t.variant === "destructive" ? "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800 text-red-800 dark:text-red-200"
            : t.variant === "success"   ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-800 dark:text-green-200"
            : "bg-background border-border"
          )}>
          <div className="flex-1 min-w-0">
            {t.title       && <p className="font-semibold text-sm">{t.title}</p>}
            {t.description && <p className="text-sm opacity-80 mt-0.5">{t.description}</p>}
          </div>
          <span className="text-xs opacity-50 shrink-0 mt-0.5">✕</span>
        </div>
      ))}
    </div>
  );
}
