import { Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import LoadingScreen from './components/LoadingScreen';
import RevealScreen from './components/RevealScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Hero />} />
      <Route path="/loading" element={<LoadingScreen />} />
      <Route path="/reveal" element={<RevealScreen />} />
    </Routes>
  );
}

export default App;
