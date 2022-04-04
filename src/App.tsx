import { lazy, Suspense } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import AutomaticBatching from './components/AutomaticBatching';
import Home from './components/Home';
import Suspenses from './components/Suspenses';
import Transitions from './components/Transitions';
import ErrorComponent from './components/ErrorComponent';
import './styles.css';

function App() {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <div>
          <header>
            <nav>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/automatic-batching">Automatic Batching</NavLink>
              <NavLink to="/transitions">Transitions</NavLink>
              <NavLink to="/suspense">Suspense</NavLink>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/automatic-batching"
                element={<AutomaticBatching />}
              />
              <Route path="/transitions" element={<Transitions />} />
              <Route path="/suspense" element={<Suspenses />} />
            </Routes>
          </main>
        </div>
      </ErrorBoundary>
    </Suspense>
  );
}

export default App;
