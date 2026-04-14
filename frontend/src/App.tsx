import { Routes, Route } from 'react-router-dom';
import { StudyFlow } from './pages/StudyFlow';
import { Dashboard } from './pages/Dashboard';
import { RawView } from './pages/RawView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudyFlow />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/raw" element={<RawView />} />
    </Routes>
  );
}

export default App;
