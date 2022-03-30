import { NavLink, Route, Routes } from 'react-router-dom';
import AutomaticBatching from './components/AutomaticBatching/AutomaticBatching';
import Home from './components/Home';
import Transitions from './components/Transitions';
import './styles.css';

function App() {
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/automatic-batching">Automatic Batching</NavLink>
          <NavLink to="/transitions">Transitions</NavLink>
        </nav>
        <div className="subtle">
          <strong>
            See <code>Console</code> tab.
          </strong>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/automatic-batching" element={<AutomaticBatching />} />
          <Route path="/transitions" element={<Transitions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
