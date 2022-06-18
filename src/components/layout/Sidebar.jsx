import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import { getModules } from '@/core/modules';

import logo from '@/assets/images/cube-3d.png';

function Sidebar() {
  const modules = getModules();
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="/" className="brand-link">
        <img src={logo} alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{ opacity: 0.8 }} />
        <span className="brand-text font-weight-light">SOLID SHOP</span>
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column">
            {modules.map((module) => (
              <li key={module.pathName} className="nav-item">
                <NavLink
                  to={`${module.pathName}`}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  data-test="moduleEntry"
                  data-test-name={module.pathName}
                >
                  <i className={`nav-icon fas ${module.icon}`} />
                  <p>{module.name}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
