import { useLayoutEffect } from 'react';

function LogEvents() {
  useLayoutEffect(() => {
    console.log('Commit');
  });

  console.log('Render');

  return null;
}

export default LogEvents;
