import { ChangeEventHandler, useState } from 'react';
import ColorItem from './ColorItem';
import ListItem from './ListItem';
import { getColors } from './Transitions.helpers';

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
          {getColors(query.length * query.length * 2).map((color, i) => (
            <ColorItem key={i} color={color} />
          ))}
        </div>
        {/* {names.map((name, i) => (
          <ListItem key={i} name={name} highlight={query} />
        ))} */}
      </div>
    </>
  );
}

export default TransitionWithout;
