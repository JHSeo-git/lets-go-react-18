import { ChangeEventHandler, useState, useTransition } from 'react';
import ListItem from './ListItem';

export type TransitionWithProps = {
  names: string[];
};

function TransitionWith({ names }: TransitionWithProps) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
    startTransition(() => setHighlight(e.target.value));
  };

  return (
    <>
      <h2>With Transitions</h2>
      <div>
        <input type="text" value={query} onChange={handleChange} />
        {isPending && <span>Pending...</span>}
        {names.map((name, i) => (
          <ListItem key={i} name={name} highlight={highlight} />
        ))}
      </div>
    </>
  );
}

export default TransitionWith;
