import { ChangeEventHandler, useDeferredValue, useState } from 'react';
import ListItem from './ListItem';

export type TransitionDeferProps = {
  names: string[];
};

function TransitionDefer({ names }: TransitionDeferProps) {
  const [query, setQuery] = useState('');
  const deferredHighlight = useDeferredValue(query);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <h2>Without Transitions</h2>
      <div>
        <input type="text" value={query} onChange={handleChange} />
        {names.map((name, i) => (
          <ListItem key={i} name={name} highlight={deferredHighlight} />
        ))}
      </div>
    </>
  );
}

export default TransitionDefer;
