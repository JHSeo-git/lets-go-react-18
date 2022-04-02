import { useState } from 'react';
import SuspensesWithEx1 from './Suspenses.with.ex1';
import SuspensesWithoutEx2 from './Suspenses.without.ex2';

type Tab = 'ex1' | 'ex2';

function Suspenses() {
  const [tab, setTab] = useState<Tab>('ex1');

  // FIXME: lazy or loadable + Suspense
  if (typeof window === 'undefined') {
    return <div>This is Server Rendered.</div>;
  }

  return (
    <article>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <button onClick={() => setTab('ex1')}>with suspense ex1</button>
          <button onClick={() => setTab('ex2')}>without suspense ex2</button>
        </div>
      </div>
      {tab === 'ex1' && <SuspensesWithEx1 />}
      {tab === 'ex2' && <SuspensesWithoutEx2 />}
    </article>
  );
}

export default Suspenses;
