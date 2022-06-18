import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  Navigate,
  Route,
  Routes,
  useMatch
} from 'react-router-dom';

import CategoryModule from '@/components/categories/CategoryModule';
import WorkModule from '@/components/works/WorkModule';
import Sidebar from '@/components/layout/Sidebar';
import TopToolbar from '@/components/layout/TopToolbar';
import { SidebarStateContext } from '@/core/AppContext';
import { getModules, setModules } from '@/core/modules';

const AUTO_COLLAPSE_SIZE = 992;

setModules([
  {
    name: 'Categories',
    icon: 'fa-bookmark',
    pathName: 'categories',
    component: <CategoryModule />
  },
  {
    name: 'Works',
    icon: 'fa-shapes',
    pathName: 'works',
    component: <WorkModule />
  }
]);

function ModuleHeader({ module }) {
  return useMatch(`${module.pathName}/*`) && (
    <h1 className="m-0">{module.name}</h1>
  );
}

function App() {
  const { sidebarState, setSidebarState } = useContext(SidebarStateContext);
  useEffect(() => {
    if (window.innerWidth > AUTO_COLLAPSE_SIZE) {
      setSidebarState('open');
    }
  }, [setSidebarState]);

  let dynamicSidebarClassNames;
  if (sidebarState === 'open') {
    dynamicSidebarClassNames = window.innerWidth <= AUTO_COLLAPSE_SIZE
      ? 'sidebar-open' : '';
  } else if (sidebarState === 'closed') {
    dynamicSidebarClassNames = window.innerWidth <= AUTO_COLLAPSE_SIZE
      ? 'sidebar-closed sidebar-collapse' : 'sidebar-collapse';
  } else if (sidebarState === 'is_opening') {
    dynamicSidebarClassNames = window.innerWidth <= AUTO_COLLAPSE_SIZE
      ? 'sidebar-open sidebar-is-opening' : 'sidebar-is-opening';
  }

  const [contentWrapperMinHeight, setContentWrapperMinHeight] = useState(0);
  const toolbarRef = useRef(null);
  useEffect(() => {
    const resizeContentWrapper = () => {
      setContentWrapperMinHeight(window.innerHeight - toolbarRef.current.offsetHeight);
    };
    resizeContentWrapper();
    window.addEventListener('resize', resizeContentWrapper);
    return () => {
      window.removeEventListener('resize', resizeContentWrapper);
    };
  }, []);

  const modules = getModules();

  return (
    <div className={`sidebar-mini ${dynamicSidebarClassNames}`} style={{ height: 'auto' }}>
      <div className="wrapper">
        <TopToolbar ref={toolbarRef} />
        <Sidebar />
        <div className="content-wrapper" style={{ minHeight: contentWrapperMinHeight }}>
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  {modules.map((module) => (
                    <ModuleHeader key={module.pathName} module={module} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="categories" replace />} />
            {modules.map((module) => (
              <Route key={module.pathName} path={`${module.pathName}/*`} element={module.component} />
            ))}
          </Routes>
        </div>
      </div>
      <div
        id="sidebar-overlay"
        aria-hidden
        onClick={() => {
          setSidebarState('closed');
        }}
      />
    </div>
  );
}

export default App;
