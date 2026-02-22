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

function toDetailedError(
  context: string,
  err: unknown,
  url: string
): Error {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg === 'Failed to fetch' || err instanceof TypeError) {
    return new Error(
      `${context}: לא ניתן להתחבר לשרת (${url}). ` +
        'אפשרויות: 1) ה-backend כבוי או לא פרוס, 2) VITE_API_URL לא הוגדר ב-Vercel (אם הפרויקט פרוס שם), 3) אין חיבור אינטרנט, 4) חסימה של CORS/חומת אש. שגיאה מקורית: Failed to fetch'
    );
  }

  return new Error(
    err instanceof Error ? err.message : `${context}: ${String(err)}`
  );
}

async function fetchWithDetails(
  url: string,
  opts?: RequestInit
): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw toDetailedError('שגיאת רשת', err, url);
  }

  if (!res.ok) {
    let body = '';
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          body = json?.message ? ` — ${json.message}` : ` — ${text}`;
        } catch {
          body = ` — ${text}`;
        }
      }
    } catch {
      /* ignore */
    }
    throw new Error(
      `שגיאת שרת (HTTP ${res.status}): ${res.statusText}${body}. URL: ${url}`
    );
  }

  return res;
}

export async function fetchAllRecipes(): Promise<Recipe[]> {
  const url = `${config.API_URL}/recipes`;
  logFetch(url);
  const res = await fetchWithDetails(url);
  return res.json();
}

export async function createRecipe(data: {
  title: string;
  ingredients: string[];
  instructions: string;
}): Promise<void> {
  const url = `${config.API_URL}/recipes`;
  logFetch(url);
  await fetchWithDetails(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteRecipe(id: string): Promise<void> {
  const url = `${config.API_URL}/recipes/${id}`;
  logFetch(url);
  await fetchWithDetails(url, { method: 'DELETE' });
}

export async function generateInstructions(
  title: string,
  ingredients: string[]
): Promise<string> {
  const url = `${config.API_URL}/recipes/generate`;
  logFetch(url);
  const res = await fetchWithDetails(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, ingredients }),
  });
  const data = await res.json();
  return data.recipe ?? '';
}
