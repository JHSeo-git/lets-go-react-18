import { NavLink, Route, Routes } from 'react-router-dom';
import AutomaticBatching from './components/AutomaticBatching';
import Home from './components/Home';
import Suspenses from './components/Suspenses';
import Transitions from './components/Transitions';
import './styles.css';

function App() {
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/">Home 2</NavLink>
          <NavLink to="/automatic-batching">Automatic Batching</NavLink>
          <NavLink to="/transitions">Transitions</NavLink>
          <NavLink to="/suspense">Suspense</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/automatic-batching" element={<AutomaticBatching />} />
          <Route path="/transitions" element={<Transitions />} />
          <Route path="/suspense" element={<Suspenses />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
