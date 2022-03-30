import { useState } from 'react';
import LogEvents from '../LogEvents';
import { fetchSomthing } from './AutomaticBatching.helpers';

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
    <div>
      <h2>AutomaticBatching</h2>
      <div>
        <button onClick={handleClick}>Next</button>
        <p style={{ color: flag ? 'blue' : 'black' }}>{count}</p>
      </div>
      <LogEvents />
    </div>
  );
}

export default AutomaticBatching;
