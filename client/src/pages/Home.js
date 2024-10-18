import React, { useState, useEffect } from 'react';
import './Home.css';
import { FaCogs, FaChartLine, FaTools } from 'react-icons/fa'; // Icons for menu

function Home() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    fetch(`${apiUrl}/api/config`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => 
        {
          const updatedConfig = {
            ...data,
            logoUrl: `${apiUrl}${data.logoUrl}`, // Add the full URL to the logo
          };
          setConfig(updatedConfig);
          console.log('Config data:', updatedConfig);  // Log to verify the response
        })
      .catch(error => console.error('Error fetching config:', error));
  }, []);

  if (!config) {
    return <div className="loading">Loading System Configuration...</div>;
  }

  return (
    <div className="homepage advanced-theme">
      <header className="header">
        <img src={config.logoUrl} alt="Sawmill Logo" className="logo animated-logo" />
        <h1 className="site-title">{config.siteName} Optimization Hub</h1>
      </header>

      <div className="dashboard">
        <div className="analytics-widget">
          <h3>Real-Time Production Efficiency</h3>
          <div className="efficiency-meter"></div>
        </div>
        <div className="analytics-widget">
          <h3>System Load</h3>
          <div className="progress-bar"></div>
        </div>
      </div>

      <nav className="machine-menu">
        <h2>Control Panel</h2>
        <ul>
          {config.machines.map((machine, index) => (
            <li key={index} className="menu-item">
              <FaTools className="menu-icon" />
              <a href={`/machines/${machine.id}`} className="launch-button">{machine.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="analytics global">
        <h2>Global Site Analytics</h2>
        <ul>
          <li><FaChartLine className="analytics-icon" /><a href="/analytics/performance">Performance Analytics</a></li>
          <li><FaCogs className="analytics-icon" /><a href="/analytics/downtime">Downtime Analytics</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Home;