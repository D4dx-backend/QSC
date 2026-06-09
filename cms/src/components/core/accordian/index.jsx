import React, { useState } from "react";
import styled from "styled-components";
import { GetIcon } from "../../../icons";
import { appTheme } from "../../project/brand/project";

const AccordionContainer = styled.div`
  margin: 0;
  max-height: 100vh;
  overflow: auto;
  padding-bottom: 79px;
  &.plain {
    overflow: initial;
    padding-bottom: 0px;
    max-height: initial;
    margin-bottom: 15px;
  }
  > div {
    border-bottom: 1px solid #e2e4e9;
  }
`;

const AccordionButton = styled.button`
  width: 100%;
  text-align: left;
  background-color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s;
  padding: 16px 12px;
  gap: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: left;

  div {
    display: flex;
    gap: 8px;
    align-items: center;

    svg {
      width: 20px;
      height: 20px;
    }
  }
  div:last-child {
    svg {
      width: 10px;
      height: 10px;
      color: ${appTheme.icon.soft};
    }
  }
  &.up {
    svg {
      color: ${appTheme.primary.base};
    }
  }
`;

const AccordionContent = styled.div`
  padding: 16px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")}; // Use props to control display
`;

const Accordion = ({ items, customClass }) => {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleAccordion = (index) => {
    // If clicking the currently open item, close it
    if (openIndices.includes(index)) {
      setOpenIndices([]);
    } else {
      // If clicking a different item, close all others and open this one
      setOpenIndices([index]);
    }
  };

  return (
    <AccordionContainer className={customClass}>
      {items.map((item, index) => (
        <div key={index}>
          <AccordionButton className={openIndices.includes(index) ? "up" : "down"} onClick={() => toggleAccordion(index)}>
            <div>
              <GetIcon icon={item.icon}></GetIcon>
              <span>{item.label}</span>
            </div>
            <div>
              <GetIcon icon={openIndices.includes(index) ? "up" : "down"}></GetIcon>
            </div>
          </AccordionButton>
          <AccordionContent isOpen={openIndices.includes(index)}>{item.content}</AccordionContent>
        </div>
      ))}
    </AccordionContainer>
  );
};

export default Accordion;
