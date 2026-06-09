import React, { useState } from "react";
import styled from "styled-components";
import { GetIcon } from "../../../icons";
import { appTheme } from "../../project/brand/project";
import { Check } from "lucide-react";

// Styled Components
const AccordionContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid #e2e4e9;
  border-radius: 12px;
  overflow: hidden;
`;

const AccordionItemWrapper = styled.div`
  background: #ebf1ff80;
  /* background-color: red; */
  overflow: hidden;
  &.first-child {
    border-radius: 0.5rem;
  }
  &.last-child {
    border-radius: 0.5rem;
  }
  border-bottom: 1px solid #e2e4e9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const AccordionHeader = styled.div`
  width: 100%;
  padding: 1rem;
  background-color: #ebf1ff80;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  cursor: ${(props) => (props["aria-expanded"] ? "pointer" : "initial")};
  background-color: ${(props) => (props["aria-expanded"] ? "white" : "#ebf1ff80")};
  & > svg {
    height: 10px;
    width: 10px;
    margin-right: 0;
    margin-left: auto;
  }
  & div:last-child > svg:last-child {
    height: 12px;
    width: 12px;
    margin-right: 0;
    margin-left: auto;
    color: ${appTheme.primary.base};
  }
`;

const StatusCircle = styled.div`
  min-width: 40px;
  min-height: 40px;
  border-radius: 9999px;
  display: flex;
  background-color: red;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;

  ${(props) => {
    switch (props.status) {
      case "completed":
        return `
          background-color: rgb(255 255 255);
          color: rgb(55, 93, 251);
        `;
      case "current":
        return `
          background-color: #EBF1FF;
          color: #375DFB;
        `;
      case "pending":
        return `
          background-color: white;
          color: #9ca3af;
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #6b7280;
        `;
    }
  }}
`;

const TitleContent = styled.div`
  text-align: left;
`;

const Title = styled.div`
  font-weight: 500;
  color: #111827;
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ContentWrapper = styled.div`
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.1s ease-in-out;
  background: white;
`;

const Content = styled.div`
  padding: 0 1rem 1rem 1rem;
`;

// Components
function AccordionItem({ item, editable, isOpen, isDisabled, onClick, status = "", index, button1 = null }) {
  const getStatusIcon = () => {
    if (status === "completed") {
      return <Check size={18} />;
    }
    return String(index + 1).padStart(2, "0");
  };
  const [isManualOpen, setManualOpen] = useState(editable && isOpen);
  return (
    <AccordionItemWrapper>
      <AccordionHeader onClick={() => setManualOpen((prev) => (editable ? !prev : false))} aria-expanded={(isManualOpen || isOpen) && !isDisabled}>
        <StatusCircle status={status}>{getStatusIcon()}</StatusCircle>
        <div className="flex justify-between w-full">
          <TitleContent>
            <Title>{item.title}</Title>
            {item.subtitle && <Subtitle>{item.subtitle}</Subtitle>}
          </TitleContent>
          <div className="flex gap-5 items-center">
            {button1} <GetIcon icon={isManualOpen || isOpen ? "up" : "down"}></GetIcon>
          </div>
        </div>
      </AccordionHeader>
      <ContentWrapper $isOpen={isManualOpen || isOpen}>
        <Content>{item.content}</Content>
      </ContentWrapper>
    </AccordionItemWrapper>
  );
}

// Main Accordion Component
export function Accordion({ items, currentStage }) {
  return (
    <AccordionContainer>
      {items.map((item, index) => (
        <AccordionItem editable={item.editable} button1={item.button1 ?? null} key={item.id} item={item} isOpen={currentStage === index} status={currentStage === index ? "current" : currentStage > index ? "completed" : "pending"} isDisabled={currentStage < index} index={index} />
      ))}
    </AccordionContainer>
  );
}
