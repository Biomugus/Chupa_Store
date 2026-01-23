import { useState } from 'react';

type FiltersState = {
  query: string;
  minPrice?: number;
  maxPrice?: number;
};

export function useFilters(initial: FiltersState = { query: '' }) {
  const [filters, setFilters] = useState<FiltersState>(initial);

  return { filters, setFilters };
}
