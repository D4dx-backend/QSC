import React from "react";
import ListItems from "./items";
import ListItem from "./item";
import { ListSurfaceThemeContext, useListSurfaceTheme } from "./themeContext";

const ListTable = (props) => {
  const inheritedSurfaceTheme = useListSurfaceTheme();
  const { isSlug = false, surfaceTheme = inheritedSurfaceTheme || "" } = props;
  const resolvedProps = { ...props, surfaceTheme };

  return <ListSurfaceThemeContext.Provider value={surfaceTheme}>{isSlug ? <ListItem {...resolvedProps} /> : <ListItems {...resolvedProps} />}</ListSurfaceThemeContext.Provider>;
};
export default ListTable;
