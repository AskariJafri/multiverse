import { useState } from 'react';
import './App.css';
import UILibraryDemo from './UILibraryDemo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import RoomScreen from './Screens/RoomScreen';
import HouseScreen from './Screens/HouseScreen';
import NeighboursScreen from './Screens/NeighboursScreen';
import Layout from './Components/Layout';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeScreen />} />
          <Route path="ui" element={<UILibraryDemo />} />
          <Route path="house/:houseId" element={<HouseScreen />} />
          <Route path="house/:houseId/room/:roomId" element={<RoomScreen />} />
          <Route path="neighbours" element={<NeighboursScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
