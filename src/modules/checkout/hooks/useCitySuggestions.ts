// src/modules/checkout/hooks/useCitySuggestions.ts

import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { CitySuggestion, UseCitySuggestionsResult } from '../types/checkoutTypes';

export function useCitySuggestions(query: string): UseCitySuggestionsResult {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedQuery] = useDebounce(query, 400);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const fetchCities = async () => {
      setIsLoading(true);

      try {
        const res = await fetch('/api/suggestions/city', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: debouncedQuery }),
        });

        if (!res.ok) throw new Error('Network error');

        const data: CitySuggestion[] = await res.json();
        if (!cancelled) setSuggestions(data ?? []);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCities();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { suggestions, isLoading };
}
