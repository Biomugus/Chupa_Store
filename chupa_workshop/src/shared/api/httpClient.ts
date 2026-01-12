export async function httpClient<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
      ...init,
    });

    if (!response.ok) {
      console.warn(`Request to ${url} failed with ${response.status}`);
      return null; // безопасно
    }

    return response.json() as Promise<T>;
  } catch (err) {
    console.error('HTTP error:', err);
    return null;
  }
}
