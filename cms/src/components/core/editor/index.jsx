import React, { useEffect, useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { GetIcon } from "../../../icons";
import TiptapEditor from "./TiptapEditor";
import CustomLabel from "../input/label";
import { appTheme } from "../../project/brand/project";
import Footnote from "../input/footnote";
import SupportedVariables from "./supported";
const EditorNew = (props) => {
  const [showEditor, setShowEditor] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [editorValue, setEditorValue] = useState(props.value || "");
  // Destructure props to avoid dependency issues
  const { onChange, id, type, value: propsValue, supportedVariables = [] } = props;

  // Update editor value when props change
  useEffect(() => {
    if (propsValue !== editorValue) {
      setEditorValue(propsValue || "");
    }
  }, [propsValue, editorValue]);

  // Memoized handlers
  const handleChange = useCallback(
    (content) => {
      setEditorValue(content);
      if (onChange) {
        onChange(content, id, type);
      }
    },
    [onChange, id, type]
  );

  const toggleFullScreen = useCallback(() => {
    setShowEditor((prev) => !prev);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <EditorContainer
      className={`
        ${props.customClass ?? "full"} 
        ${props.dynamicClass || ""} 
        ${showEditor ? "open" : ""} 
        ${editorValue?.length > 0 ? "has-content" : ""}
        ${isFocused ? "is-focused" : ""}
      `}
    >
      <EditorWrapper className={showEditor ? "fullscreen" : ""}>
        {!showEditor ? (
          <ExpandButton onClick={toggleFullScreen} className="open">
            <GetIcon icon="enlarge" />
            <span>Expand Editor</span>
          </ExpandButton>
        ) : (
          <PopupHeader>
            <HeaderTitle>{props.label ?? props.placeholder}</HeaderTitle>
            <CloseButton onClick={toggleFullScreen}>
              <GetIcon icon="Close" />
              <span>Exit Fullscreen</span>
            </CloseButton>
          </PopupHeader>
        )}

        <EditorContent className={showEditor ? "fullscreen" : ""}>
          {/* {props.supportedVariables?.length > 0 && ( */}
          {/* )} */}
          <CustomLabel required={props.required} label={!showEditor ? props.label ?? props.placeholder : undefined} error={props.error} />

          <TiptapEditor value={editorValue} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} fullScreen={showEditor} placeholder={props.placeholder} />
          <SupportedVariables supportedVariables={supportedVariables} />

          <Footnote {...props} />
        </EditorContent>
      </EditorWrapper>

      {showEditor && <Overlay onClick={toggleFullScreen} />}
    </EditorContainer>
  );
};

// Prevent unnecessary re-renders
const MemoizedEditorNew = React.memo(EditorNew);

// Add displayName for better debugging
MemoizedEditorNew.displayName = "EditorNew";

export default MemoizedEditorNew;

// Styled components
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const EditorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  transition: all 0.3s ease;
  position: relative;

  &.small {
    grid-column: span 3;
  }
  &.half {
    grid-column: span 6;
  }
  &.large {
    grid-column: span 9;
  }
  &.full {
    grid-column: span 12;
  }
  &.disabled {
    display: none;
  }

  &.open {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  &.is-focused .ProseMirror {
    border-color: ${appTheme.primary.main};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 1999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 10px;
  width: 100%;
  transition: all 0.3s ease;
  height: auto;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); */
  position: relative;

  &.fullscreen {
    width: 85%;
    max-width: 1400px;
    height: auto;
    max-height: 80vh;
    z-index: 2000;
    animation: ${slideUp} 0.3s ease-out;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 1200px) {
    &.fullscreen {
      width: 95%;
    }
  }

  @media (max-width: 768px) {
    &.fullscreen {
      width: 100%;
      height: auto;
      max-height: 80vh;
      border-radius: 12px;
    }
  }
`;

const EditorContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0px;
  &.fullscreen {
    padding: 16px;
    max-height: 80vh;
    height: auto;
  }
`;

const PopupHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid ${appTheme.stroke.soft};
  border-radius: 10px 10px 0 0;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  /* color: ${appTheme.text.main}; */
`;

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  color: ${appTheme.text.soft};
  background: transparent;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${appTheme.primary.light}40;
    color: ${appTheme.primary.main};
  }
`;

const ExpandButton = styled(BaseButton)`
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px 10px;
  z-index: 1;
  background: white;
  box-shadow: none;
  background: ${appTheme.primary.light}20;
  svg {
    width: 12px;
    height: 12px;
  }
`;

const CloseButton = styled(BaseButton)`
  &:hover {
    background: rgba(255, 59, 48, 0.1);
    color: #ff3b30;
  }
`;
