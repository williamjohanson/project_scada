import React from 'react';
import { FaBars } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ menuType, machines, isOpen, toggleSidebar }) {
  // Define the Global Menu Items as a constant array of objects
  const GlobalMenus = [
    { name: 'Downtime', link: '/global/downtime' },
    { name: 'Dialler', link: '/global/dialler' },
    { name: 'Site Analytics', link: '/global/analytics' },
    { name: 'Preventative Maintenance', link: '/global/maintenance' },
    { name: 'Breakdowns', link: '/global/breakdowns' },
    { name: 'Contractors', link: '/global/contractors' },
    { name: 'Site Settings', link: '/global/settings' },
    { name: 'Login', link: '/global/login' }
  ];

  return (
    <>
      {/* Sidebar Toggle Button - Positioned to the left */}
      <div className="navbar">
        <FaBars className="menu-bars" onClick={toggleSidebar} />
      </div>

      {/* Sidebar Menu */}
      <nav className={`sidebar ${isOpen ? 'sidebar-active' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h2>{menuType === 'global' ? 'Global Settings' : 'Machine Menu'}</h2>
          </div>
          <ul className="sidebar-menu">
            {menuType === 'global' ? (
              // Render the global menu items from the GlobalMenus array
              GlobalMenus.map((item, index) => (
                <li key={index}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))
            ) : (
              machines.map((machine) => (
                <li key={machine.id}>
                  <Link to={`/machines/${machine.id}`}>{machine.name}</Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
