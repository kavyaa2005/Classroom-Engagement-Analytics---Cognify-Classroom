import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";
import type { AxiosRequestConfig } from "axios";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Generic hook that calls the backend API and manages loading/error state.
 * Re-fetches whenever `url` changes.
 */
export function useFetch<T = unknown>(
  url: string | null,
  config?: AxiosRequestConfig
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);
  const callCount = useRef(0);

  const fetchData = useCallback(async () => {
    if (!url) return;
    const call = ++callCount.current;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ data: T }>(url, config);
      if (call === callCount.current) {
        setData(res.data.data as T);
      }
    } catch (err: unknown) {
      if (call === callCount.current) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load data.";
        setError(msg);
      }
    } finally {
      if (call === callCount.current) setLoading(false);
    }
  }, [url]); // eslint-disable-line

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
