import { createContext, useContext } from "react";

export const ListSurfaceThemeContext = createContext("");

export const useListSurfaceTheme = () => useContext(ListSurfaceThemeContext);