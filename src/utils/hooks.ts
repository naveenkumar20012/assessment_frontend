import { duration } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import api from "./api";
import { handleError } from "./common";
import { urlFormatter } from "./formatters";

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface API<T> {
  data: T;
  error: ConstructedObject;
  loading: boolean;
  setData: (data: T) => void;
}

export const useAPI = <T>(url: string): API<T> => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ConstructedObject>({});
  const axios = api();
  useEffect(() => {
    setLoading(true);
    axios
      .get(url)
      .then((res) => {
        const resultData = res.data as unknown;
        setData(resultData);
      })
      .catch((err) => {
        console.error(err);
        const formattedError = err as ConstructedObject;
        setError(formattedError);
        handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axios, url]);
  return { data, error, loading, setData };
};

export const usePaginatedAPI = (url: string, limit = 10) => {
  const [data, setData] = useState<Array<unknown>>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ConstructedObject>({});
  const axios = api();
  const maxPages = Math.ceil(count / limit);
  const nextPage = () => {
    if (page + 1 < maxPages) {
      setPage((existingPage) => existingPage + 1);
    }
  };
  const previousPage = () => {
    if (page > 1) {
      setPage((existingPage) => existingPage - 1);
    }
  };
  const trigger = `${page}-${limit}`;
  useEffect(() => {
    setLoading(true);
    const formattedURL = urlFormatter(url, `limit=${limit}&page=${page}`);
    axios
      .get(formattedURL)
      .then((res) => {
        const resultData = res.data as PaginatedResult;
        setCount(resultData.count);
        setData((existingData) =>
          page === 1
            ? [...resultData.results]
            : [...existingData, ...resultData.results]
        );
      })
      .catch((err) => {
        console.error(err);
        const formattedError = err as ConstructedObject;
        setError(formattedError);
        handleError(err);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return {
    data,
    error,
    loading,
    nextPage,
    count,
    page,
    setData,
    setPage,
    previousPage,
  };
};
