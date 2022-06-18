import React, {
  createContext,
  useCallback,
  useMemo,
  useState
} from 'react';

export const SidebarStateContext = createContext(null);

export function AppProvider({ children }) {
  const [sidebarState, setSidebarState] = useState('closed');

  const toggleSidebarState = useCallback(() => {
    if (sidebarState === 'open') {
      setSidebarState('closed');
    } else if (sidebarState === 'closed') {
      setSidebarState('is_opening');
      setTimeout(() => {
        setSidebarState('open');
      }, 50);
    }
  }, [sidebarState]);
  const sidebarStateProviderValue = useMemo(() => ({
    sidebarState,
    setSidebarState,
    toggleSidebarState
  }), [sidebarState, toggleSidebarState]);

  return (
    <SidebarStateContext.Provider value={sidebarStateProviderValue}>
      {children}
    </SidebarStateContext.Provider>
  );
}
