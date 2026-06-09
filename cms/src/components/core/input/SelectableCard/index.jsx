import React from "react";
import styled from "styled-components";
import { GetIcon } from "../../../../icons";
import { appTheme } from "../../../project/brand/project";
import FormInput from "..";

const CardWrapper = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 600px;
  width: 100%;
  padding: 16px;
  background: white;
  border: 1px solid ${(props) => (props.$checked ? appTheme.primary.base : "#E9ECEF")};
  border-radius: 12px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
  flex-grow: 1;
  flex-basis: 250px;
  max-width: 360px;
  && {
    .single & {
      flex-basis: 130px;
    }
  }
  &:hover {
    ${(props) =>
      !props.$disabled &&
      !props.$checked &&
      `
      border-color: ${appTheme.primary.base};
    `}
  }

  &:focus-visible {
    outline: 1px solid ${appTheme.primary.base};
    outline-offset: 2px;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: #f8f9fa;
  border-radius: 50%;

  svg {
    width: 25px;
    height: 25px;
    color: ${appTheme.primary.base};
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  min-width: 0;
  max-width: calc(100% - 20px);
  justify-content: left;
  text-align: left;
  gap: 5px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  color: ${appTheme.text.main};
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px;
  letter-spacing: -0.006em;
  text-align: left;
`;

const Description = styled.div`
  color: ${appTheme.text.sub};
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
`;

const StatusIndicator = styled.div`
  display: flex;
  right: 20px;
  top: 50%;
  width: 20px;
  height: 20px;
  border: 1px solid ${(props) => (props.$checked ? "#4263EB" : "#CED4DA")};
  border-radius: ${(props) => (props.type === "radio" ? "50%" : "4px")};
  background: ${(props) => (props.$checked ? "#4263EB" : "transparent")};
  transition: all 0.2s ease;

  align-items: center;
  justify-content: center;

  &.radio {
    border-radius: 50%;
  }

  &.radio::after {
    content: "";
    display: ${(props) => (props.$checked ? "block" : "none")};
    width: ${(props) => (props.type === "radio" ? "12px" : "14px")};
    height: ${(props) => (props.type === "radio" ? "12px" : "14px")};
    background: ${(props) => (props.type === "radio" ? "transparent" : "transparent")};
    border-radius: ${(props) => (props.type === "radio" ? "50%" : "0")};
    background: transparent;
    border: 4px solid white;
  }

  svg {
    display: ${(props) => (props.$checked && props.type === "checkbox" ? "flex" : "none")};
    color: white;
    width: 14px;
    height: 14px;
  }
`;
const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const SelectableCard = ({ id, type = "radio", name, value, checked = false, onChange, option, disabled = false }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onChange?.(option, id, type);
      }
    }
  };

  return (
    <CardWrapper $checked={checked} $disabled={disabled} onKeyDown={handleKeyPress} tabIndex={disabled ? -1 : 0} role={type === "radio" ? "radio" : "checkbox"} aria-checked={checked} aria-disabled={disabled}>
      <HiddenInput type={type} name={name} value={value} checked={checked} onChange={onChange} disabled={disabled} aria-hidden="true" />

      {option.icon && (
        <IconContainer>
          <GetIcon icon={option.icon} />
        </IconContainer>
      )}

      <ContentContainer>
        <Title>{option.value}</Title>
        {option.description?.length > 0 && <Description>{option.description}</Description>}
      </ContentContainer>
      {type === "toggle" ? (
        <FormInput customClass="auto" type={"toggle"} />
      ) : (
        <StatusIndicator $checked={checked} type={type} className={type}>
          {type === "checkbox" && checked && <GetIcon icon="tick" />}
        </StatusIndicator>
      )}
    </CardWrapper>
  );
};

export default SelectableCard;
