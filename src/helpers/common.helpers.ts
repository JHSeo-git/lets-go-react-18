import isomorphicFetch from 'isomorphic-fetch';

export function fetchSomthing(delay = 100) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

type IdType = number;
type FetchType = `item/${IdType}` | 'topstories';

export async function fetchData<DataType>(
  type: FetchType,
  delay = 0
): Promise<DataType> {
  const [res] = await Promise.all([
    isomorphicFetch(`https://hacker-news.firebaseio.com/v0/${type}.json`),
    new Promise((resolve) => setTimeout(resolve, delay)),
  ]);

  if (res.status !== 200) {
    throw new Error(`Status code: ${res.status}`);
  }

  return res.json() as unknown as DataType;
}
