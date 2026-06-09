import React from "react";

export const withMemoization = (Component) => {
  const MemoizedComponent = React.memo((props) => <Component {...props} />);
  return MemoizedComponent;
};
