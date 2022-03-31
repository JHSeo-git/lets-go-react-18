import { useEffect, useState } from 'react';

const cache: { [key: string]: () => unknown } = {};

export function useData<DataType>(
  key: string,
  fetcher: () => Promise<DataType>
) {
  if (!cache[key]) {
    let data: DataType;
    let promise: Promise<DataType>;
    cache[key] = () => {
      if (data !== undefined) return data;
      if (!promise) promise = fetcher().then((r) => (data = r));
      throw promise;
    };
  }
  return cache[key]() as unknown as DataType;
}

export function useFetch<DataType>(fetcher: () => Promise<DataType>) {
  const [data, setData] = useState<DataType>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        const result = await fetcher();
        setData(result);
      } catch (e) {
        setError(e as unknown as Error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [fetcher]);

  return { data, error, loading };
}
