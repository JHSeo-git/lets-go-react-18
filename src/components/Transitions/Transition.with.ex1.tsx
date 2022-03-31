import { ChangeEventHandler, useState, useTransition } from 'react';
import ColorItem from './ColorItem';
import { getColors } from './Transitions.helpers';

function TransitionWithEx1() {
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
      <h2>With Transitions: random color box</h2>
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
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '1rem',
          }}
        >
          {getColors(highlight.length * highlight.length * 2).map(
            (color, i) => (
              <ColorItem key={i} color={color} />
            )
          )}
          {isPending && <div className="overlay">Pending</div>}
        </div>
      </div>
    </>
  );
}

export default TransitionWithEx1;
