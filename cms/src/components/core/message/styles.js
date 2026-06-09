import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  width: 100%;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  &.notification {
    border-top: none;
    padding: 8px 16px;
  }

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 1;
    padding: 16px;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1001;
  padding: 20px;

  &.hidden {
    display: none;
  }

  &.notification {
    background: none;
    backdrop-filter: none;
    -webkit-box-pack: start;
    justify-content: start;
    align-items: end;
    pointer-events: none;
    padding: 16px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  animation: ${fadeIn} 0.3s ease-out;

  &.notification {
    width: auto;
    min-width: 300px;
    max-width: 350px;
    animation: ${slideIn} 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
    pointer-events: auto;
    margin-top: 16px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
  }
`;

export const Content = styled.div`
  padding: 24px;
  font-size: 16px;
  line-height: 1.5;
  color: #1a1a1a;

  &.notification {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 12px 12px 16px;
    border-radius: 8px;
    position: relative;
    min-height: 64px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    svg {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      margin-top: 2px;
    }

    .close-button {
      position: absolute;
      right: 4px;
      top: 4px;
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }

      svg {
        width: 14px;
        height: 14px;
        margin: 0;
      }
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.1);
    }

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: currentColor;
      opacity: 0.3;
      animation: ${progressBar} 6s linear;
    }
  }

  &.success {
    color: rgb(2 142 96);
    background: white;
    svg {
      color: rgb(2 142 96);
    }
    .close-button svg {
      color: rgb(2 142 96);
    }
  }

  &.error {
    color: #ef4444;
    background: white;
    svg {
      color: #ef4444;
    }
    .close-button svg {
      color: #ef4444;
    }
  }

  &.info {
    color: #3b82f6;
    background: white;
    svg {
      color: #3b82f6;
    }
    .close-button svg {
      color: #3b82f6;
    }
  }

  &.warning {
    color: #f59e0b;
    background: white;
    svg {
      color: #f59e0b;
    }
    .close-button svg {
      color: #f59e0b;
    }
  }

  div {
    margin: 0;
    font-weight: 600;
    padding-right: 20px;
    font-size: 16px;
    line-height: 1.4;
  }
`;
