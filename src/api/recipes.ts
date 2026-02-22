import config from '../config';

export interface Recipe {
  _id: string;
  title: string;
  ingredients: string[];
  instructions: string;
}

function logFetch(url: string): void {
  const parsed = new URL(url);
  const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
  console.log('[FETCH]', { url, port });
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  const url = `${config.API_URL}/recipes`;
  logFetch(url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return res.json();
}

export async function createRecipe(data: {
  title: string;
  ingredients: string[];
  instructions: string;
}): Promise<void> {
  const url = `${config.API_URL}/recipes`;
  logFetch(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to create recipe');
  }
}

export async function deleteRecipe(id: string): Promise<void> {
  const url = `${config.API_URL}/recipes/${id}`;
  logFetch(url);
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('Failed to delete recipe');
  }
}

export async function generateInstructions(
  title: string,
  ingredients: string[]
): Promise<string> {
  const url = `${config.API_URL}/recipes/generate`;
  logFetch(url);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, ingredients }),
  });
  if (!res.ok) {
    throw new Error('Failed to generate instructions');
  }
  const data = await res.json();
  return data.recipe ?? '';
}
