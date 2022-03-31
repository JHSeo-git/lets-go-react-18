import { useState } from 'react';
import { fetchSomthing } from '../../helpers/common.helpers';
import LogEvents from '../LogEvents';

function AutomaticBatching() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    fetchSomthing().then(() => {
      setCount((c) => c + 1);
      setFlag((f) => !f);
    });
  };

  return (
    <article>
      <h2>Automatic Batching</h2>
      <h3>
        See <code>console</code> tab.
      </h3>
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <button onClick={handleClick}>Next</button>
        <p
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: flag ? 'blue' : 'red',
          }}
        >
          {count}
        </p>
      </div>
      <LogEvents />
    </article>
  );
}

export default AutomaticBatching;
