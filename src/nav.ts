import { createContext, useContext } from 'react';

export type Screen = 'login' | 'dashboard' | 'analytics' | 'practice' | 'history' | 'accessibility';

export const NavContext = createContext<{ go: (s: Screen) => void }>({ go: () => {} });

export const useNav = () => useContext(NavContext);
