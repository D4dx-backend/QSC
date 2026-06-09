import styled, { keyframes } from "styled-components";
import { appTheme } from "../../../project/brand/project";
export const Form = styled.div`
  border: 0px solid rgb(224, 224, 227);
  padding: 0.5em 0px;
  border-left: 10px;
  border-right: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 1em 1.5em;
  &.double {
    display: flex;
    grid-template-columns: 1fr 1fr;
    flex-flow: wrap;
  }
  &.plain {
    padding: 0px;
  }

  @media (max-width: 768px) {
    border: 0;
    &.double {
      display: flex;
    }
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  display: flex;
  justify-content: right;
  align-items: flex-start;
  overflow: auto;
  z-index: 1001;
  background-color: #00000033;
  &.plain {
    position: initial;
    background: transparent;
    padding: 0px;
    width: 100%;
    justify-content: left;
    overflow: initial;
    align-items: baseline;
    margin: 0px;
    z-index: initial;
  }
  &.info {
    background-color: ${appTheme.bg.soft};
    padding: 24px;
    &.horizontal.info {
      margin: 0px;
      background-color: ${appTheme.bg.white};
      border: 0;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    top: 0;
    bottom: 0;
    border-top: 1px solid rgb(224, 224, 227);
  }
`;
const slideAnimation = keyframes`  
  from {  
    transform: translateX(100%); 
    opacity: 0;
  }  
  to {  
    transform: translateX(0); 
    opacity: 1;
  }  
`;
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  background-color: white;
  border-radius: 0px;
  width: 400px;
  min-width: 250px;
  animation: ${slideAnimation} 1s ease-in-out;
  animation-duration: 0.2s;
  padding: 0em 0em 0em;
  left: auto;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  position: relative;
  overflow: auto;
  &.double {
    width: 765px;
  }
  &.fullscreen {
    width: 100%;
  }
  &.plain {
    border: 0px solid rgb(224, 224, 227);
    height: auto;
    border-radius: 10px;
    width: 100%;
    justify-content: left;
    overflow: initial;
    animation: none;
  }
  &.info {
    border: 0px solid rgb(224, 224, 227);
    &.single {
      width: 400px;
    }
    &.double {
      width: 765px;
    }
    border-radius: 10px;
    justify-content: left;
    overflow: initial;
    animation: none;
  }
  &.bulk {
    max-width: 80%;
    width: 1800px;
  }
  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    top: 0;
    padding: 0;
    &.double {
      width: 100%;
    }
  }
`;
export const Header = styled.div`
  text-align: center;
  padding: 0.5em 0 1em;
  font-weight: 500;
  font-size: 1.3em;
  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-bottom: 1px solid rgb(224, 224, 227);
  }
`;
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  justify-content: space-between;
  padding: 20px 24px 20px 24px;
  border: 1px 0px 0px 0px;
  gap: 10px;
  bottom: 0;
  width: 100%;
  border-top: 1px solid ${appTheme.stroke.soft};
  background-color: ${appTheme.bg.white};
  z-index: 1;
  &.plain {
    box-shadow: none;
    justify-content: left;
    border-top: 1px solid #e9e9e9;
    position: sticky;
    bottom: 0;
    &.disabled {
      display: none;
    }
  }
  &.info {
    border-radius: 12px;
  }
  && {
    .embed & {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: white;
    padding-bottom: 10px;
  }
`;
export const ErrorMessage = styled.div`
  border-left: 1px solid lightgrey;
  padding-left: 10px;
  margin: 0 0;
  color: #fe7b7b;
  font-size: 12px;
  width: 100%;
  text-align: left;
  float: left;
`;
export const LnputLayout = styled.div`
  display: flex;
  &.single {
  }
  &.double {
  }
`;
export const Record = styled.div`
  display: flex;
  width: 100%;
  text-align: center;
  -webkit-box-pack: center;
  justify-content: center;
  margin-bottom: 10px;
  border-bottom: 1px dashed lightgray;
  padding-bottom: 20px;
  padding-top: 20px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  button {
    cursor: pointer;
    background-color: white;
    border: 1px solid lightgray;
    padding: 10px;
    border-radius: 10px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }
  &.recording {
    button,
    svg {
      color: red;
      font-weight: bold;
    }
  }
  .info {
    font-size: 12px;
  }
  p {
    font-size: 14px;
    span {
      font-weight: bold;
    }
  }
`;
