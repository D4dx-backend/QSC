import React from "react";
import { Bar, FootNote, Label } from "../styles";

const CustomLabel = ({ type = "percentage", name, label, required, sublabel = "", error = "", className = "", percetage = false, percetageValue = "", leftContent = "", rightContent = "", description = "", footnote = "" }) => {
  const hasError = error?.length;
  const valueIsEmpty = label?.toString().length > 0;
  return valueIsEmpty && percetage ? (
    <React.Fragment>
      <Label htmlFor={name} className={`percentage ${className} ${hasError ? "error" : ""}`}>
        <span>{label}</span>
        <span>{percetageValue}%</span>
      </Label>
      <Bar>
        <div style={{ width: percetageValue + "%" }}></div>
      </Bar>
      <Label htmlFor={name} className={`percentage small ${className} ${hasError ? "error" : ""}`}>
        <span>{leftContent}</span>
        <span>{rightContent}</span>
      </Label>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <Label htmlFor={name} className={`${className} ${description ? "has-desc" : ""} ${hasError ? "error" : ""}`}>
        <div className="label">
          <span>{label}</span>
          {sublabel && <span className="sublabel">({sublabel})</span>} {required && <i>*</i>}
        </div>
        {description && <div className="description">{description}</div>}
        {footnote && <FootNote className="footnote">{footnote}</FootNote>}
      </Label>
    </React.Fragment>
  );
};

export default CustomLabel;
