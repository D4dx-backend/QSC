import React from "react";
import styled from "styled-components";
import { appTheme } from "../../project/brand/project";

const ToggleContainer = styled.label`
  background-color: ${appTheme.bg.soft}; /* Background color for OFF state */
  display: flex;
  min-width: 32px;
  width: 32px; /* Width of the toggle switch */
  height: 20px; /* Height of the toggle switch */
  position: relative;
  cursor: pointer;
  border-radius: 34px; /* Rounded edges */
  padding: 4px;
  transition: background-color 0.4s; /* Smooth transition for background color */
  margin-right: 0px;
  &.true {
    background-color: ${appTheme.primary.base}; /* Background color for ON state */
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ToggleSlider = styled.span`
  cursor: pointer;
  width: 12px; /* Width of the slider/knob */
  height: 12px; /* Height of the slider/knob */
  border-radius: 56px; /* Circular shape */
  background: white; /* Color of the knob */
  display: flex;
  position: relative;
  transition: left 0.4s; /* Smooth transition for knob movement */

  box-shadow: 0px 2px 4px 0px #1b1c1d05; /* Shadow for depth */

  &.true {
    left: 12px; /* Position of the slider when ON */
  }

  &:before {
    content: "";
    position: absolute;
    background: rgb(226, 228, 233);
    width: 4px; /* Size of the inner dot */
    height: 4px;
    top: 4px; /* Positioning of the inner dot */
    left: 4px;
    border-radius: 50%; /* Circular shape for inner dot */
    transition: background 0.4s; /* Smooth transition for inner dot color */
  }

  &.true:before {
    background: ${appTheme.primary.base}; /* Background color for inner dot when ON */
  }
`;

const OnOffToggle = ({ on, handleToggle, label, description, footnote }) => {
  return (
    <Container className={on ? "true" : ""}>
      {/* <CustomLabel className="toggle" description={description} footnote={footnote} label={label}></CustomLabel>
       */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
        <div className="text-xs text-gray-500">{footnote}</div>
      </div>
      <ToggleContainer onClick={() => handleToggle(!on)} className={on ? "true" : ""}>
        <ToggleSlider className={on ? "true" : ""} />
      </ToggleContainer>
    </Container>
  );
};

export default OnOffToggle;
