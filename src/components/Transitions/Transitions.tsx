import faker from '@faker-js/faker';
import { useState } from 'react';
import TransitionDeferEx1 from './Transition.defer.ex1';
import TransitionDeferEx2 from './Transition.defer.ex2';
import TransitionWithEx1 from './Transition.with.ex1';
import TransitionWithEx2 from './Transition.with.ex2';
import TransitionWithoutEx1 from './Transition.without.ex1';
import TransitionWithoutEx2 from './Transition.without.ex2';

const names = Array.from({ length: 5000 }, () => {
  return faker.name.findName();
});

type Tab =
  | 'with-ex1'
  | 'with-ex2'
  | 'without-ex1'
  | 'without-ex2'
  | 'defer-ex1'
  | 'defer-ex2';

function Transitions() {
  const [tab, setTab] = useState<Tab>('with-ex1');
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
          <button onClick={() => setTab('with-ex1')}>
            With Transitions Ex1
          </button>
          <button onClick={() => setTab('without-ex1')}>
            Without Transitions Ex1
          </button>
          <button onClick={() => setTab('defer-ex1')}>
            useDeferredValue Ex1
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <button onClick={() => setTab('with-ex2')}>
            With Transitions Ex2
          </button>
          <button onClick={() => setTab('without-ex2')}>
            Without Transitions Ex2
          </button>
          <button onClick={() => setTab('defer-ex2')}>
            useDeferredValue Ex2
          </button>
        </div>
      </div>
      {tab === 'with-ex1' && <TransitionWithEx1 />}
      {tab === 'without-ex1' && <TransitionWithoutEx1 />}
      {tab === 'defer-ex1' && <TransitionDeferEx1 />}
      {tab === 'with-ex2' && <TransitionWithEx2 names={names} />}
      {tab === 'without-ex2' && <TransitionWithoutEx2 names={names} />}
      {tab === 'defer-ex2' && <TransitionDeferEx2 names={names} />}
    </article>
  );
}

export default Transitions;
