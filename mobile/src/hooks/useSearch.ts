import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Debounces a value by the given delay (ms).
 * Useful for search inputs to avoid firing on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Generic search hook.
 * Calls `searchFn(query)` whenever the debounced query changes.
 * Returns { results, loading, error, setQuery }.
 */
export function useSearch<T>(
  searchFn: (query: string) => Promise<T[]>,
  delay = 400
) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, delay);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    searchFn(debouncedQuery)
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Search failed. Please try again.");
          setLoading(false);
        }
      });
  }, [debouncedQuery]);

  const clear = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
  }, []);

  return { query, setQuery, results, loading, error, clear };
}
