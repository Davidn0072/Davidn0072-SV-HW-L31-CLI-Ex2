import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe, generateInstructions } from '../api/recipes';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const parseIngredients = (str: string): string[] => {
    return str
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const validate = (): string | null => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return 'Recipe name is required.';
    if (trimmedTitle.length > 15) return 'Recipe name must be at most 15 characters.';
    if (instructions.length > 200) return 'Instructions must be at most 200 characters.';
    return null;
  };

  const handleGetInstructions = async () => {
    const trimmedTitle = title.trim();
    const ingredientsList = parseIngredients(ingredients);
    if (!trimmedTitle) {
      alert('Recipe name is required.');
      return;
    }
    if (ingredientsList.length === 0) {
      alert('Ingredients are required.');
      return;
    }
    setAiLoading(true);
    setError(null);
    try {
      const generated = await generateInstructions(trimmedTitle, ingredientsList);
      setInstructions(generated.slice(0, 200));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate instructions');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      const ingredientsList = parseIngredients(ingredients);
      await createRecipe({
        title: title.trim(),
        ingredients: ingredientsList,
        instructions,
      });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Add New Recipe</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-base font-semibold text-slate-900">
            Recipe Name
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={15}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="e.g. Chocolate Cake (max 15 chars)"
          />
        </div>
        <div>
          <label htmlFor="ingredients" className="mb-1 block text-base font-semibold text-slate-900">
            Ingredients
          </label>
          <input
            id="ingredients"
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="e.g. Milk, Eggs, Water or Milk Eggs Water"
          />
        </div>
        <div>
          <label htmlFor="instructions" className="mb-1 block text-base font-semibold text-slate-900">
            Instructions
          </label>
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={handleGetInstructions}
              disabled={aiLoading || !title.trim() || !ingredients.trim()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {aiLoading ? 'Generating...' : 'Get instructions by AI'}
            </button>
          </div>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            maxLength={200}
            rows={6}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="Step by step instructions... (max 200 chars)"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add New Recipe'}
        </button>
      </form>
    </div>
  );
}
