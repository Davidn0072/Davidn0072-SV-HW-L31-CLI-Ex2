import { useCallback, useEffect, useState } from 'react';
import { fetchAllRecipes, deleteRecipe } from '../api/recipes';
import type { Recipe } from '../api/recipes';

export default function AllRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecipes = useCallback(() => {
    fetchAllRecipes()
      .then(setRecipes)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load recipes'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleDelete = async (id: string) => {
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading recipes...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  if (recipes.length === 0) {
    return <div className="text-slate-600">No recipes yet.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">All Recipes</h1>
      <div className="flex flex-col gap-4">
        {recipes.map((recipe) => (
          <article
            key={recipe._id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <h2 className="font-semibold text-slate-800">{recipe.title}</h2>
            {recipe.ingredients?.length > 0 && (
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            )}
            {recipe.instructions && (
              <p className="mt-2 text-sm text-slate-600">{recipe.instructions}</p>
            )}
            <button
              type="button"
              onClick={() => handleDelete(recipe._id)}
              className="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
