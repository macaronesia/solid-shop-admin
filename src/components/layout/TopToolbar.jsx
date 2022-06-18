import { useApolloClient } from '@apollo/client';
import React, {
  forwardRef,
  useContext,
  useState
} from 'react';
import { useNavigate } from 'react-router-dom';

import { SidebarStateContext } from '@/core/AppContext';
import { clearAuthData, useUserInfo } from '@/core/auth';

const TopToolbar = forwardRef((props, ref) => {
  const userInfo = useUserInfo();

  const [userDropdownShow, setUserDropdownShow] = useState(false);

  const { toggleSidebarState } = useContext(SidebarStateContext);
  const toggleUserDropdownButton = () => {
    setUserDropdownShow(!userDropdownShow);
  };

  const client = useApolloClient();
  const navigate = useNavigate();
  const logout = async () => {
    await clearAuthData(client);
    navigate('/');
  };

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light" ref={ref}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            type="button"
            className="nav-link button-without-styling"
            onClick={toggleSidebarState}
          >
            <i className="fas fa-bars" />
          </button>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className={`nav-item dropdown ${userDropdownShow ? 'show' : ''}`}>
          <button
            type="button"
            className="nav-link dropdown-toggle button-without-styling"
            onClick={toggleUserDropdownButton}
            data-test="username"
          >
            Hi,&nbsp;
            {userInfo.username}
            <span className="caret" />
          </button>
          <div className={`dropdown-menu dropdown-menu-right ${userDropdownShow ? 'show' : ''}`}>
            <button
              type="button"
              className="dropdown-item dropdown-footer button-without-styling"
              onClick={logout}
              data-test="logout"
            >
              Sign Out
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
});

export default TopToolbar;
