import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RowContainer } from "../../styles/containers/styles";

export const CustomPageTemplate = React.memo((props) => {
  const Page = props.content;
  const themeColors = useSelector((state) => state.themeColors);
  const [data] = useState(props);
  return (
    <RowContainer theme={themeColors} className={"data-layout " + props.viewMode}>
      {data && <Page {...data} themeColors={themeColors} />}
    </RowContainer>
  );
});
