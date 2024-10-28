import React, { useState, useEffect } from 'react';
import './Home.css';
import './Dialler.css';
import Sidebar from '../components/Sidebar';

function Dialler() {
    const [config, setConfig] = useState(null);
    const [menuType, setMenuType] = useState('global'); // Menu type (global/machine)
    const [sidebarOpen, setSidebarOpen] = useState(true); // State to control sidebar visibility
    const [isEnabled, setIsEnabled] = useState(false);

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
    // Toggle handler
    const handleToggle = () => {
        setIsEnabled((prev) => !prev);
    };

    return (
        <div className={`homepage ${sidebarOpen ? 'with-sidebar' : 'no-sidebar'}`}>
            <Sidebar menuType={menuType} machines={config.machines} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <header className="header">
            <img src={config.logoUrl} alt="Sawmill Logo" className="logo animated-logo" />
            <h1 className="site-title">{config.siteName} Dialler</h1>
            </header>

            {/* Toggle Slider Section */}
            <div className="toggle-slider-container">
            <h2>Dialler</h2>
            <div className={`toggle-slider ${isEnabled ? 'enabled' : 'disabled'}`} onClick={handleToggle}>
                <span className="slider-circle"></span>
            </div>
            <p className="status-text">Status: {isEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
        </div>
    );
}

export default Dialler;