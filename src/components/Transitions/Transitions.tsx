import faker from '@faker-js/faker';
import { useState } from 'react';
import TransitionDefer from './Transition.defer';
import TransitionWith from './Transition.with';
import TransitionWithout from './Transition.without';

const names = Array.from({ length: 5000 }, () => {
  return faker.name.findName();
});

type Tab = 'with' | 'without' | 'defer';

function Transitions() {
  const [tab, setTab] = useState<Tab>('with');
  return (
    <article>
      <div>
        <button onClick={() => setTab('with')}>With Transitions</button>
        <button onClick={() => setTab('without')}>Without Transitions</button>
        <button onClick={() => setTab('defer')}>useDeferred Transitions</button>
      </div>
      {tab === 'with' && <TransitionWith names={names} />}
      {tab === 'without' && <TransitionWithout names={names} />}
      {tab === 'defer' && <TransitionDefer names={names} />}
    </article>
  );
}

export default Transitions;
