import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { WeeklyMenuSummary } from "../types";
import { fetchMenus, generateMenu } from "../api/menus";
import { fetchRecipeTags } from "../api/recipes";
import { btn, btnPrimary, input } from "../utils/styles";

export default function HomePage() {
  const [menus, setMenus] = useState<WeeklyMenuSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxCookingMinutes, setMaxCookingMinutes] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchMenus(), fetchRecipeTags()])
      .then(([menus, tags]) => {
        setMenus(menus);
        setAllTags(tags);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleCreate = async () => {
    setShowGenerateModal(false);
    setGenerating(true);
    setError(null);
    try {
      const menu = await generateMenu({
        tags: selectedTags.length > 0 ? selectedTags : null,
        maxCookingMinutes: maxCookingMinutes ? parseInt(maxCookingMinutes, 10) : null,
      });
      navigate(`/menus/${menu.id}`);
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : "";
      const message = raw.toLowerCase().includes("no recipes match")
        ? "No recipes match the selected filters. Try broadening your criteria."
        : raw.toLowerCase().includes("no recipes")
        ? "You have no recipes yet — add some on the Recipes page before generating a menu."
        : raw || "Failed to generate menu";
      setError(message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p>Loading menus...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl leading-tight m-0">Weekly Menus</h1>
        <button
          className={btnPrimary}
          onClick={() => setShowGenerateModal(true)}
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate new weekly menu"}
        </button>
      </div>

      {showGenerateModal && (
        <div
          className="fixed inset-0 bg-accent/40 flex items-center justify-center z-100"
          onClick={() => setShowGenerateModal(false)}
        >
          <div
            className="bg-bg border border-border rounded-xl p-8 w-[90%] max-w-[480px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 m-0">Generate Weekly Menu</h2>

            {allTags.length > 0 && (
              <div className="mb-5">
                <p className="font-medium mb-2 m-0">Filter by tags</p>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-accent text-white border-accent"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="maxCooking" className="block font-medium mb-1">
                Max cooking time (minutes, optional)
              </label>
              <input
                id="maxCooking"
                type="number"
                min="1"
                className={`${input} w-32`}
                value={maxCookingMinutes}
                onChange={(e) => setMaxCookingMinutes(e.target.value)}
                placeholder="e.g. 45"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button className={btn} onClick={() => setShowGenerateModal(false)}>
                Cancel
              </button>
              <button className={btnPrimary} onClick={handleCreate}>
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="fixed inset-0 bg-accent/40 flex items-center justify-center z-100"
          onClick={() => setError(null)}
        >
          <div
            className="bg-bg border border-border rounded-xl p-8 w-[90%] max-w-[400px] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="m-0 mb-6 text-lg">{error}</p>
            <div className="flex justify-center gap-3">
              <button className={btn} onClick={() => setError(null)}>Cancel</button>
              <button className={btnPrimary} onClick={() => navigate("/recipes")}>
                Go to Recipes
              </button>
            </div>
          </div>
        </div>
      )}

      {menus.length === 0 ? (
        <div className="text-center py-12 px-4 text-text-light">
          <p>No menus yet. Generate your first weekly menu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {menus.map((m) => (
            <Link key={m.id} to={`/menus/${m.id}`} className="no-underline text-inherit">
              <div className="bg-white border border-border rounded-lg p-4 transition-colors hover:border-accent">
                <h3 className="m-0 mb-2 text-text">{m.name}</h3>
                <p className="m-0 text-text-muted text-sm">
                  Starts {m.startDate} &middot; {m.itemCount} meals planned
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
