import { useEffect } from 'react';

function LogEvents() {
  useEffect(() => {
    console.log('Mount');
  }, []);
  console.log('Render');

  return null;
}

export default LogEvents;
