import React from "react";
import styled from "styled-components";
import { GetIcon } from "../../../icons";
import { appTheme } from "../../project/brand/project";
import CustomLabel from "../input/label";

const CheckboxWrapper = styled.div`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  &:disabled {
    background: ${appTheme.bg.weak};
    color: ${appTheme.text.sub};
    cursor: not-allowed;
    border: 0;
  }
`;

const CheckboxCheckmark = styled.span`
  position: relative;
  box-shadow: 0px 2px 2px 0px #1b1c1d1f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    color: ${(props) => (props.disabled ? appTheme.bg.sub : appTheme.stroke.white)};
    font-size: 10px;
  }
  background: ${appTheme.bg.weak};
  border: ${(props) => (props.checked ? ("1px solid " + props.disabled ? appTheme.bg.sub : appTheme.stroke.soft) : "1px solid " + appTheme.stroke.soft)};
  background-color: ${(props) => (props.checked ? (props.disabled ? appTheme.bg.sub : appTheme.primary.base) : props.disabled ? appTheme.bg.sub : appTheme.bg.white)};
  &.checkbox {
    min-width: 20px;
    min-height: 20px;
    border-radius: 7px;
    padding: 0px;
  }
  &.round {
    min-width: 20px;
    min-height: 20px;
    border-radius: 50%;
    border: ${(props) => (props.checked ? "5px solid " + (props.disabled ? appTheme.stroke.sub : appTheme.primary.base) : "1px solid " + appTheme.stroke.soft)};
    background-color: ${(props) => (props.checked ? appTheme.bg.white : appTheme.bg.white)};
    box-shadow: 0px 2px 2px 0px #1b1c1d1f;
    svg {
      display: none;
    }
  }
`;

const Checkbox = ({ name, label, checked, onChange, theme, className = "", disabled, required = false, sublabel = "" }) => {
  return (
    <CheckboxWrapper>
      <CheckboxInput disabled={disabled} type="checkbox" checked={checked} onChange={!disabled && onChange} />
      <CheckboxCheckmark disabled={disabled} className={className} theme={theme} checked={checked}>
        {checked && <GetIcon icon={"checked"} />}
      </CheckboxCheckmark>
      <CustomLabel required={required} sublabel={sublabel} label={label} />
    </CheckboxWrapper>
  );
};

export default Checkbox;
