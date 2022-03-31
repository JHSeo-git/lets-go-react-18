import { ChangeEventHandler, useDeferredValue, useState } from 'react';
import ListItem from './ListItem';

export type TransitionDeferEx2Props = {
  names: string[];
};

function TransitionDeferEx2({ names }: TransitionDeferEx2Props) {
  const [query, setQuery] = useState('');
  const deferredHighlight = useDeferredValue(query);
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <h2>useDeferredValue: query and highlight</h2>
      <div>
        <div className="input-box">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            maxLength={100}
          />
          <span>{query.length}</span>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {names.map((name, i) => (
            <ListItem key={i} name={name} highlight={deferredHighlight} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TransitionDeferEx2;
