import React, { useState, useEffect } from 'react';
import './Home.css';
import Sidebar from '../components/Sidebar';
import { FaCogs, FaChartLine, FaTools } from 'react-icons/fa';

function Home() {
  const [config, setConfig] = useState(null);
  const [menuType, setMenuType] = useState('global'); // Menu type (global/machine)
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    // Fetch configuration data from API
    fetch(`${apiUrl}/api/config`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const updatedConfig = {
          ...data,
          logoUrl: `${apiUrl}${data.logoUrl}`, // Add the full URL to the logo
        };
        setConfig(updatedConfig);
      })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  // Handle loading state
  if (!config) {
    return <div className="loading">Loading System Configuration...</div>;
  }

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`homepage ${sidebarOpen ? 'with-sidebar' : 'no-sidebar'}`}>
      {/* Sidebar Component */}
      <Sidebar menuType={menuType} machines={config.machines} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Header Section */}
      <header className="header">
        <img src={config.logoUrl} alt="Sawmill Logo" className="logo animated-logo" />
        <h1 className="site-title">{config.siteName} Optimization Hub</h1>
      </header>

      {/* Machine Menu Section */}
      <nav className="machine-menu">
        <h2>Control Panel</h2>
        <ul>
          {config.machines.map((machine, index) => (
            <li key={index} className="menu-item">
              <FaTools className="menu-icon" />
              <a href={`/machines/${machine.id}`} className="launch-button">
                {machine.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Home;
