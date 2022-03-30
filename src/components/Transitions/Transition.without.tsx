import { ChangeEventHandler, useDeferredValue, useState } from 'react';
import ListItem from './ListItem';

export type TransitionWithoutProps = {
  names: string[];
};

function TransitionWithout({ names }: TransitionWithoutProps) {
  const [query, setQuery] = useState('');
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <h2>Without Transitions</h2>
      <div>
        <input type="text" value={query} onChange={handleChange} />
        {names.map((name, i) => (
          <ListItem key={i} name={name} highlight={query} />
        ))}
      </div>
    </>
  );
}

export default TransitionWithout;
