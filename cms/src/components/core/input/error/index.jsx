import React from "react";
import { projectSettings } from "../../../project/brand/project";
import { ErrorMessage } from "../../form/styles";
import { GetIcon } from "../../../../icons";

const ErrorLabel = ({ error, info, className = "", icon = "info" }) => {
  return (
    <>
      {error?.length > 0 && (
        <ErrorMessage className={`${info?.length > 0 ? "info" : ""} ${projectSettings.formInputView} ${className}`}>
          {icon.length > 0 && <GetIcon icon={icon} />} <div>{error}</div>
        </ErrorMessage>
      )}
    </>
  );
};

export default ErrorLabel;
