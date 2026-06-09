import React from "react";
import { SubHead } from "../styles";
import { GetIcon } from "../../../../icons";

const SubPageHeader = ({ icon, title, description = "", dynamicClass = "", line = true }) => {
  return (
    <SubHead className={`sub title ${dynamicClass} ${line ? "line" : ""} ${line ? "margin" : ""} `}>
      {title?.length > 0 && (
        <div>
          {icon ? <GetIcon icon={icon}></GetIcon> : null}
          {title}
        </div>
      )}
      {description.length > 0 && <p dangerouslySetInnerHTML={{ __html: description }}></p>}
    </SubHead>
  );
};

const PageHeader = ({ icon, title, description = "", dynamicClass = "", line = true, wrap = true }) => {
  return (
    <SubHead className={`title ${dynamicClass} ${line ? "line" : ""} ${line ? "margin" : ""} ${wrap ? "" : "nowrap"} `}>
      {title?.length > 0 && (
        <div>
          {icon ? <GetIcon icon={icon}></GetIcon> : null}
          {title}
        </div>
      )}
      {description.length > 0 && <p dangerouslySetInnerHTML={{ __html: description }}></p>}
    </SubHead>
  );
};

export { SubPageHeader, PageHeader };
