import { useEffect, useState } from 'react';
import { fetchData } from '../../helpers/common.helpers';
import Spinner from './Spinner';
import Story from './Story';
import { Item } from './Suspenses.types';

function StoryWithData({ id }: { id: string }) {
  const [data, setData] = useState<Item>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetchStoryById = async () => {
      try {
        setLoading(true);

        const data = await fetchData(`item/${Number(id)}`, 0);
        setData(data);
      } catch (e) {
        setError(e as unknown as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryById();
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>;
  if (!data) return null;

  return <Story item={data} />;
}

function NewsWithData({ count = 30 }: { count?: number }) {
  const [storyIds, setStoryIds] = useState<string[]>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        setLoading(true);

        const ids = await fetchData('topstories', 500);
        setStoryIds(ids);
      } catch (e) {
        setError(e as unknown as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStories();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>;
  if (!storyIds) return null;

  return (
    <ol>
      {storyIds.slice(0, count).map((id) => {
        return (
          <li key={id}>
            <StoryWithData id={id} />
          </li>
        );
      })}
    </ol>
  );
}

function SuspensesWithoutEx2() {
  return (
    <>
      <h2>Without Suspense ex2</h2>
      <h3>Fetch HackerNews Top 30 stories, and then fetch each story</h3>
      <p>fetch 30 stories with 500ms delay</p>
      <p>fetch each story with 0 delay</p>
      <div style={{ padding: '1rem 0' }}>
        <NewsWithData />
      </div>
    </>
  );
}

export default SuspensesWithoutEx2;
