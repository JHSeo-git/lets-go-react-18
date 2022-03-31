import { ChangeEventHandler, useState, useTransition } from 'react';
import ListItem from './ListItem';

export type TransitionWithEx2Props = {
  names: string[];
};

function TransitionWithEx2({ names }: TransitionWithEx2Props) {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
    startTransition(() => {
      setHighlight(e.target.value);
    });
  };

  return (
    <>
      <h2>With Transitions: query and highlight</h2>
      <div>
        <div className="input-box">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            maxLength={100}
          />
          <span>{highlight.length}</span>
        </div>
        <div
          style={{
            position: 'relative',
            marginTop: '1rem',
          }}
        >
          {names.map((name, i) => (
            <ListItem key={i} name={name} highlight={highlight} />
          ))}
          {isPending && <div className="overlay">Pending</div>}
        </div>
      </div>
    </>
  );
}

export default TransitionWithEx2;
