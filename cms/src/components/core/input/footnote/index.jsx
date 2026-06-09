import React from "react";
import { FootNote } from "../styles";
import { GetIcon } from "../../../../icons";

const Footnote = ({ footnote, footnoteIcon, className = "" }) => {
  return footnote?.length > 0 ? (
    <FootNote className={className}>
      {footnoteIcon?.length > 0 && <GetIcon icon={footnoteIcon}></GetIcon>}
      <span> {footnote}</span>
    </FootNote>
  ) : (
    ""
  );
};

export default Footnote;
