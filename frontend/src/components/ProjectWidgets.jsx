import { Users, Clock, Target } from "lucide-react";
import { Progress } from "./ui/index.jsx";
import { formatMoney, daysLeft as calcDaysLeft, fundingPct } from "../utils/format";

// ── ProgressBar ─────────────────────────────────────────────────────
export function ProgressBar({ amountRaised, goalAmount, deadline, backerCount }) {
  const pct  = fundingPct(amountRaised, goalAmount);
  const days = calcDaysLeft(deadline);
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-1">
        <span className="text-3xl font-extrabold">{formatMoney(amountRaised)}</span>
        <span className="text-muted-foreground text-sm ml-2">pledged of {formatMoney(goalAmount)}</span>
      </div>
      <Progress value={pct} className="h-2.5 my-3" />
      <p className="text-right text-xs text-primary font-semibold mb-5">{pct.toFixed(1)}% funded</p>
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-xl font-bold mb-0.5">
            <Users className="h-4 w-4 text-muted-foreground" />{backerCount || 0}
          </div>
          <p className="text-xs text-muted-foreground">Backers</p>
        </div>
        <div className="border-x border-border">
          <div className="flex items-center justify-center gap-1 text-xl font-bold mb-0.5">
            <Clock className="h-4 w-4 text-muted-foreground" />{days}
          </div>
          <p className="text-xs text-muted-foreground">Days Left</p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-xl font-bold mb-0.5">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatMoney(Math.max(0, goalAmount - amountRaised))}</span>
          </div>
          <p className="text-xs text-muted-foreground">To Goal</p>
        </div>
      </div>
    </div>
  );
}

// ── RewardTier ───────────────────────────────────────────────────────
export function RewardTier({ reward, selected, onSelect }) {
  const soldOut = reward.max_backers && reward.backer_count >= reward.max_backers;
  return (
    <div onClick={() => !soldOut && onSelect(reward)}
      className={`rounded-xl border-2 p-5 transition-all ${
        soldOut  ? "opacity-50 cursor-not-allowed border-border"
        : selected ? "border-primary bg-primary/5 cursor-pointer shadow-sm"
        : "border-border hover:border-primary/50 cursor-pointer hover:shadow-sm"
      }`}>
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <h4 className="font-semibold">{reward.title}</h4>
          {soldOut && <span className="text-xs text-destructive font-medium">Sold Out</span>}
        </div>
        <span className="text-primary font-bold text-lg whitespace-nowrap ml-3">₹{reward.min_amount}+</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
      {reward.items?.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {reward.items.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-green-500 text-xs font-bold">✓</span> {item}
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
        {reward.estimated_delivery && <span>Est. {reward.estimated_delivery}</span>}
        {reward.max_backers && (
          <span className={reward.backer_count >= reward.max_backers * 0.8 ? "text-orange-500" : ""}>
            {reward.max_backers - (reward.backer_count || 0)} of {reward.max_backers} left
          </span>
        )}
      </div>
      {selected && <p className="mt-2.5 text-center text-xs font-semibold text-primary">✓ Selected</p>}
    </div>
  );
}
