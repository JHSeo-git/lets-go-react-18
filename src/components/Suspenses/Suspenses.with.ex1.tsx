import { Suspense } from 'react';
import { fetchData } from '../../helpers/common.helpers';
import Spinner from './Spinner';
import Story from './Story';
import { useData } from './Suspenses.hooks';
import { Item } from './Suspenses.types';

function StoryWithData({ id }: { id: string }) {
  const data = useData(`s-${id}`, () => fetchData<Item>(`item/${Number(id)}`));

  return <Story item={data} />;
}

function NewsWithData({ count = 30 }: { count?: number }) {
  const storyIds = useData('top', () => fetchData<string[]>('topstories', 500));

  return (
    <ol>
      {storyIds.slice(0, count).map((id) => {
        return (
          <li key={id}>
            <Suspense fallback={<Spinner />}>
              <StoryWithData id={id} />
            </Suspense>
          </li>
        );
      })}
    </ol>
  );
}

function SuspensesWithEx1() {
  return (
    <>
      <h2>With Suspense ex1</h2>
      <h3>Fetch HackerNews Top 30 stories, and then fetch each story</h3>
      <p>fetch 30 stories with 500ms delay</p>
      <p>fetch each story with 0 delay</p>
      <div style={{ padding: '1rem 0' }}>
        <Suspense fallback={<Spinner />}>
          <NewsWithData count={30} />
        </Suspense>
      </div>
    </>
  );
}

export default SuspensesWithEx1;
