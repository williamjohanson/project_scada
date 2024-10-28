import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Dialler from './pages/Dialler';

function App() {
  return (
    <Router>
      <Sidebar menuType="global" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/global/dialler" element={<Dialler />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
