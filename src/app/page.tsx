"use client";

import { useState } from "react";
import {
ShieldCheck,
TrendingUp,
AlertTriangle,
Ban,
Activity,
Wallet,
BarChart3,
} from "lucide-react";

type Decision = "WAITING" | "APPROVE" | "WARN" | "BLOCK";

export default function Home() {
const [symbol, setSymbol] = useState("");
const [direction, setDirection] = useState("");
const [entryPrice, setEntryPrice] = useState("");
const [stopLoss, setStopLoss] = useState("");
const [takeProfit, setTakeProfit] = useState("");
const [positionSize, setPositionSize] = useState("");

const [decision, setDecision] = useState<Decision>("WAITING");
const [message, setMessage] = useState(
"Enter your trade details and TradeGuard will evaluate the risk before execution."
);

const [risk, setRisk] = useState(0);
const [profit, setProfit] = useState(0);
const [riskReward, setRiskReward] = useState(0);

const accountBalance = 100000;
const maxRisk = accountBalance * 0.01;

function analyzeTrade() {
  const entry = Number(entryPrice);
  const stop = Number(stopLoss);
  const target = Number(takeProfit);
  const size = Number(positionSize);

  const normalizedDirection = direction.trim().toUpperCase();

if (
  !symbol.trim() ||
  !normalizedDirection ||
  !entry ||
  !stop ||
  !target ||
  !size
) {
  setDecision("BLOCK");
  setMessage("Please complete all trade fields before analyzing.");
  return;
}

if (!["LONG", "SHORT"].includes(normalizedDirection)) {
  setDecision("BLOCK");
  setMessage("Direction must be LONG or SHORT.");
  return;
}

if (size <= 0) {
  setDecision("BLOCK");
  setMessage("Position size must be greater than zero.");
  return;
}

let riskPerShare = 0;
let profitPerShare = 0;

if (normalizedDirection === "LONG") {
  if (stop >= entry) {
    setDecision("BLOCK");
    setMessage("For a LONG trade, the stop loss must be below the entry price.");
    return;
  }

  if (target <= entry) {
    setDecision("BLOCK");
    setMessage("For a LONG trade, the take profit must be above the entry price.");
    return;
  }

  riskPerShare = entry - stop;
  profitPerShare = target - entry;
}

if (normalizedDirection === "SHORT") {
  if (stop <= entry) {
    setDecision("BLOCK");
    setMessage("For a SHORT trade, the stop loss must be above the entry price.");
    return;
  }

  if (target >= entry) {
    setDecision("BLOCK");
    setMessage("For a SHORT trade, the take profit must be below the entry price.");
    return;
  }

  riskPerShare = stop - entry;
  profitPerShare = entry - target;
}

const totalRisk = riskPerShare * size;
const totalProfit = profitPerShare * size;
const rr = totalRisk > 0 ? totalProfit / totalRisk : 0;

setRisk(totalRisk);
setProfit(totalProfit);
if (totalRisk > maxRisk) {
  setDecision("BLOCK");
  setMessage(
    `Maximum allowed risk is $${maxRisk.toFixed(2)}. This trade risks $${totalRisk.toFixed(2)}.`
  );
  return;
}

if (rr < 2) {
  setDecision("WARN");
  setMessage(
    `Risk/reward is ${rr.toFixed(
      2
    )}:1. TradeGuard recommends at least 2:1.`
  );
  return;
}

setDecision("APPROVE");
setMessage(
  `Trade passes the initial TradeGuard risk checks. Maximum loss is $${totalRisk.toFixed(
    2
  )}.`
);
}

const decisionStyles = {
WAITING: "text-slate-300",
APPROVE: "text-emerald-400",
WARN: "text-amber-400",
BLOCK: "text-red-400",
};

return (
  <main className="min-h-screen bg-slate-950 text-white">
    <div className="mx-auto max-w-7xl px-6 py-8">

    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-600 p-3">
          <ShieldCheck size={28} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">TradeGuard AI</h1>
          <p className="text-sm text-slate-400">
            Your AI-powered pre-trade risk guard
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Paper Trading
      </div>
    </header>

    <section className="mb-8 grid gap-4 md:grid-cols-4">
      <StatCard
        icon={<Wallet size={20} />}
        title="Paper Cash"
        value="$100,000"
        subtitle="Simulated balance"
      />

      <StatCard
        icon={<TrendingUp size={20} />}
        title="Buying Power"
        value="$200,000"
        subtitle="Available"
      />

      <StatCard
        icon={<Activity size={20} />}
        title="Open Positions"
        value="0"
        subtitle="Currently held"
      />

      <StatCard
        icon={<ShieldCheck size={20} />}
        title="Risk Status"
        value="Protected"
        subtitle="TradeGuard active"
      />
    </section>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* TRADE ANALYZER */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Analyze a Trade</h2>

          <p className="mt-1 text-sm text-slate-400">
            TradeGuard checks the trade before it reaches the broker.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Symbol"
            placeholder="QQQ"
            value={symbol}
            onChange={setSymbol}
          />

          <Input
            label="Direction"
            placeholder="LONG"
            value={direction}
            onChange={setDirection}
          />

          <Input
            label="Entry Price"
            placeholder="500.00"
            type="number"
            value={entryPrice}
            onChange={setEntryPrice}
          />

          <Input
            label="Stop Loss"
            placeholder="495.00"
            type="number"
            value={stopLoss}
            onChange={setStopLoss}
          />

          <Input
            label="Take Profit"
            placeholder="515.00"
            type="number"
            value={takeProfit}
            onChange={setTakeProfit}
          />

          <Input
            label="Position Size"
            placeholder="10"
            type="number"
            value={positionSize}
            onChange={setPositionSize}
          />
        </div>

        {/* RISK PREVIEW */}
        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <BarChart3 size={18} />
            Risk Preview
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500">Risk</p>
              <p className="mt-1 font-semibold">
                ${risk.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Potential Profit
              </p>
              <p className="mt-1 font-semibold">
                ${profit.toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Risk / Reward
              </p>
              <p className="mt-1 font-semibold">
                {riskReward > 0 ? `1 : ${riskReward.toFixed(2)}` : "—"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={analyzeTrade}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500"
        >
          Analyze Trade
        </button>
      </section>

      {/* DECISION PANEL */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">TradeGuard Decision</h2>

        <p className="mt-1 text-sm text-slate-400">
          {decision === "WAITING"
            ? "No trade analyzed yet."
            : `Analysis complete for ${symbol.toUpperCase()}.`}
        </p>

        <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-950 p-6 text-center">
          <ShieldCheck
            className="mx-auto mb-4 text-slate-500"
            size={48}
          />

          <p className="text-sm text-slate-500">Decision</p>

          <p
            className={`mt-2 text-2xl font-bold ${decisionStyles[decision]}`}
          >
            {decision}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {message}
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <RiskRule
            icon={<ShieldCheck size={18} />}
            text="Position size check"
          />

          <RiskRule
            icon={<AlertTriangle size={18} />}
            text="Maximum loss check"
          />

          <RiskRule
            icon={<Ban size={18} />}
            text="Risk limit enforcement"
          />
        </div>
      </section>
    </div>

    {/* FOOTER */}
    <footer className="mt-8 border-t border-slate-800 pt-5 text-center text-xs text-slate-500">
      TradeGuard AI • Paper Trading Environment • No real money is being used
    </footer>
  </div>
</main>

);
}

/* STAT CARD */
function StatCard({
icon,
title,
value,
subtitle,
}: {
icon: React.ReactNode;
title: string;
value: string;
subtitle: string;
}) {
return ( <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5"> <div className="mb-4 flex items-center gap-2 text-slate-400">
{icon} <span className="text-sm">{title}</span> </div>

```
  <p className="text-2xl font-bold">{value}</p>

  <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
</div>


);
}

/* INPUT */
function Input({
label,
placeholder,
type = "text",
value,
onChange,
}: {
label: string;
placeholder: string;
type?: string;
value: string;
onChange: (value: string) => void;
}) {
return ( <div> <label className="mb-2 block text-sm text-slate-300">
{label} </label>

  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
  />
</div>


);
}

/* RISK RULE */
function RiskRule({
icon,
text,
}: {
icon: React.ReactNode;
text: string;
}) {
return ( <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
{icon}
{text} </div>
);
}