import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllRecipes } from '../api/recipes';
import type { Recipe } from '../api/recipes';

export default function SearchRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    if (hasFetched.current) return;

    setError(null);
    setLoading(true);
    fetchAllRecipes()
      .then((data) => {
        setRecipes(data);
        hasFetched.current = true;
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load recipes'))
      .finally(() => setLoading(false));
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return recipes.filter((r) => r.title?.toLowerCase().includes(q));
  }, [recipes, query]);

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Search Recipes</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="search" className="text-base font-semibold text-slate-900">
            Recipe name
          </label>
          <input
            id="search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Recipe name..."
            className="max-w-md flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
          />
        </div>
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Search Recipes</h1>
      <div className="flex items-center gap-2">
        <label htmlFor="search" className="text-base font-semibold text-slate-900">
          Recipe name
        </label>
        <input
          id="search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Recipe name..."
          className="max-w-md flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>
      {loading && <p className="text-slate-600">Loading recipes...</p>}
      <div className="flex flex-col gap-4">
        {!query.trim() ? (
          <p className="text-slate-600">Type a recipe name above to search.</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600">No matching recipes.</p>
        ) : (
          filtered.map((recipe) => (
            <article
              key={recipe._id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="space-y-2">
                <div>
                  <span className="block text-base font-semibold text-slate-900">Recipe name</span>
                  <h2 className="font-semibold text-slate-800">{recipe.title}</h2>
                </div>
                {recipe.ingredients?.length > 0 && (
                  <div>
                    <span className="block text-base font-semibold text-slate-900">Ingredients</span>
                    <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.instructions && (
                  <div>
                    <span className="block text-base font-semibold text-slate-900">Instructions</span>
                    <p className="mt-1 text-sm text-slate-600">{recipe.instructions}</p>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
