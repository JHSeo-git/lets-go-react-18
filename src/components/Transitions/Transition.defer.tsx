import { ChangeEventHandler, useDeferredValue, useState } from 'react';
import ColorItem from './ColorItem';
import ListItem from './ListItem';
import { getColors } from './Transitions.helpers';

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
      <h2>useDeferredValue</h2>
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
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
          {getColors(
            deferredHighlight.length * deferredHighlight.length * 2
          ).map((color, i) => (
            <ColorItem key={i} color={color} />
          ))}
        </div>
        {/* {names.map((name, i) => (
          <ListItem key={i} name={name} highlight={deferredHighlight} />
        ))} */}
      </div>
    </>
  );
}

export default TransitionDefer;
