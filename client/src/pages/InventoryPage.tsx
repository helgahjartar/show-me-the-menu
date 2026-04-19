import { useState, useEffect, useRef } from "react";
import { input } from "../utils/styles";
import type { InventoryItem } from "../types";
import {
  fetchInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../api/inventory";

type Category = "fridge" | "freezer" | "cupboards";

const CATEGORIES: { key: Category; label: string }[] = [
  { key: "fridge", label: "Fridge" },
  { key: "freezer", label: "Freezer" },
  { key: "cupboards", label: "Cupboards" },
];

function QuantityButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-6 h-6 rounded border border-border bg-white text-text-muted hover:border-accent hover:text-accent transition-colors text-sm font-medium leading-none flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function CategoryList({
  title,
  items,
  onAdd,
  onToggle,
  onChangeQuantity,
  onRemove,
}: {
  title: string;
  items: InventoryItem[];
  onAdd: (name: string) => Promise<void>;
  onToggle: (item: InventoryItem) => Promise<void>;
  onChangeQuantity: (item: InventoryItem, delta: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      await onAdd(trimmed);
      setDraft("");
      inputRef.current?.focus();
    } finally {
      setAdding(false);
    }
  }

  const active = items.filter((i) => !i.isCrossed);
  const crossed = items.filter((i) => i.isCrossed);

  return (
    <div className="flex-1 min-w-0">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          className={input + " flex-1 min-w-0"}
          type="text"
          placeholder="Add item…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          disabled={!draft.trim() || adding}
          className="rounded-lg border border-accent px-4 py-2 text-sm font-medium bg-accent text-bg cursor-pointer transition-colors hover:bg-accent-dark hover:border-accent-dark disabled:opacity-50 disabled:cursor-not-allowed shrink-0 w-[72px]"
        >
          Add
        </button>
      </form>

      {items.length === 0 && (
        <p className="text-text-muted text-sm italic">Nothing here yet.</p>
      )}

      {active.length > 0 && (
        <ul className="space-y-2 mb-3">
          {active.map((item) => (
            <li key={item.id} className="flex items-center gap-2 group">
              <button
                onClick={() => onToggle(item)}
                className="w-5 h-5 rounded border border-border flex items-center justify-center shrink-0 hover:border-accent transition-colors bg-white"
                aria-label="Mark as used"
              />
              <span className="flex-1 text-sm">{item.name}</span>
              <div className="flex items-center gap-1 w-[72px] justify-center shrink-0">
                <QuantityButton onClick={() => onChangeQuantity(item, -1)}>−</QuantityButton>
                <span className="w-6 text-center text-sm tabular-nums font-medium">{item.quantity}</span>
                <QuantityButton onClick={() => onChangeQuantity(item, +1)}>+</QuantityButton>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-lg leading-none w-4 text-center shrink-0"
                aria-label="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {crossed.length > 0 && (
        <>
          <div className="text-xs font-medium text-text-muted uppercase tracking-wide mb-1 mt-4">
            Used / checked off
          </div>
          <ul className="space-y-2">
            {crossed.map((item) => (
              <li key={item.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => onToggle(item)}
                  className="w-5 h-5 rounded border border-accent flex items-center justify-center shrink-0 bg-accent text-bg transition-colors hover:bg-accent-dark text-xs font-bold"
                  aria-label="Mark as available"
                >
                  ✓
                </button>
                <span className="flex-1 text-sm line-through text-text-muted">{item.name}</span>
                <span className="w-[72px] text-center text-sm text-text-muted tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-lg leading-none w-4 text-center shrink-0"
                  aria-label="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(category: Category, name: string) {
    const item = await createInventoryItem(category, name, 1);
    setItems((prev) => [...prev, item]);
  }

  async function handleToggle(item: InventoryItem) {
    const updated = await updateInventoryItem(item.id, !item.isCrossed, item.quantity);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleChangeQuantity(item: InventoryItem, delta: number) {
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;
    const updated = await updateInventoryItem(item.id, item.isCrossed, newQty);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleRemove(id: number) {
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight m-0 mb-1">Inventory</h1>
      <p className="text-text-muted mb-6 text-sm">
        Keep track of what you have at home. Cross off items as you use them.
      </p>

      <div className="flex flex-col sm:flex-row gap-8">
        {CATEGORIES.map(({ key, label }, idx) => (
          <>
            {idx > 0 && (
              <>
                <div className="hidden sm:block w-px bg-border" />
                <div className="block sm:hidden h-px bg-border" />
              </>
            )}
            <CategoryList
              key={key}
              title={label}
              items={items.filter((i) => i.category === key)}
              onAdd={(name) => handleAdd(key, name)}
              onToggle={handleToggle}
              onChangeQuantity={handleChangeQuantity}
              onRemove={handleRemove}
            />
          </>
        ))}
      </div>
    </div>
  );
}
