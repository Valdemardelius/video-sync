import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RoomPage from './RoomPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;