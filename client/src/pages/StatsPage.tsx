import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchKronanStats } from "../api/stats";
import type { KronanProductStats } from "../types";


function topLevelCategory(categoryPath: string | null): string {
  if (!categoryPath) return "Other";
  return categoryPath.split(/[/>]/)[0].trim() || "Other";
}

function fmt(n: number): string {
  return n >= 10 ? n.toFixed(1) : n.toFixed(2);
}

export function StatsPage() {
  const [hasKronanKey, setHasKronanKey] = useState<boolean | null>(null);
  const [stats, setStats] = useState<KronanProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKronanStats()
      .then((data) => {
        setHasKronanKey(true);
        setStats(data);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load stats.";
        if (msg.includes("Krónan API key")) {
          setHasKronanKey(false);
        } else {
          setHasKronanKey(true);
          setError(msg);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!hasKronanKey) {
    return (
      <div className="max-w-none sm:max-w-140">
        <h1 className="text-2xl sm:text-3xl leading-tight m-0 mb-4">Stats</h1>
        <div className="bg-white border border-border rounded-lg p-6 text-center text-text-muted">
          No Krónan API key configured. Please add your Krónan API key in Settings.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-none sm:max-w-140">
        <h1 className="text-2xl sm:text-3xl leading-tight m-0 mb-4">Stats</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="max-w-none sm:max-w-140">
        <h1 className="text-2xl sm:text-3xl leading-tight m-0 mb-4">Stats</h1>
        <div className="bg-white border border-border rounded-lg p-6 text-center text-text-muted">
          No purchase history found.
        </div>
      </div>
    );
  }

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1);
  const windowStart = twelveMonthsAgo.getTime();
  const grouped = new Map<string, { name: string; weeklyQty: number; stat: KronanProductStats }[]>();

  for (const s of stats) {
    if (s.lastPurchaseDate === null || new Date(s.lastPurchaseDate).getTime() < windowStart) continue;

    const weeklyQty = s.purchaseCount / 52;

    const category = topLevelCategory(s.categoryPath);
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push({ name: s.productName, weeklyQty, stat: s });
  }

  for (const items of grouped.values()) {
    items.sort((a, b) => b.weeklyQty - a.weeklyQty);
  }

  const sortedCategories = [...grouped.keys()].sort();

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl leading-tight m-0 mb-6">Stats</h1>
      <p className="text-sm text-text-muted mb-6 mt-0">
        How many times per week you buy each product on average, based on purchase history from the last 12 months.
      </p>

      <div className="flex flex-col gap-6">
        {sortedCategories.map((category) => {
          const items = grouped.get(category)!;
          const chartHeight = Math.max(120, items.length * 36);

          return (
            <div key={category} className="bg-white border border-border rounded-lg p-4">
              <h2 className="text-lg font-semibold m-0 mb-4">{category}</h2>
              <div style={{ height: chartHeight }} className="[&_svg]:outline-none [&_.recharts-wrapper]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={items} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" allowDecimals tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={200}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value, _name, props) => {
                        const s = props.payload.stat as KronanProductStats;
                        const v = typeof value === "number" ? value : Number(value);
                        return [
                          `${fmt(v)}x/week (${s.purchaseCount} purchase${s.purchaseCount !== 1 ? "s" : ""} total)`,
                          "Avg purchases/week",
                        ];
                      }}
                    />
                    <Bar dataKey="weeklyQty" name="Per week" fill="#c4a230" radius={[0, 3, 3, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
