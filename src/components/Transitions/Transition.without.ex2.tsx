import { ChangeEventHandler, useState } from 'react';
import ListItem from './ListItem';

export type TransitionWithoutEx2Props = {
  names: string[];
};

function TransitionWithoutEx2({ names }: TransitionWithoutEx2Props) {
  const [query, setQuery] = useState('');
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <h2>Without Transitions: query and highlight</h2>
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
            <ListItem key={i} name={name} highlight={query} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TransitionWithoutEx2;
