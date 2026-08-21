import { createContext, useContext } from 'react';

/** Whether the app animates at all. The Ministry requires a way to stop moving
 *  content, so every screen reads this and the menu flips it. */
export const MotionContext = createContext<{ on: boolean; toggle: () => void }>({ on: true, toggle: () => {} });
export const useMotion = () => useContext(MotionContext);
