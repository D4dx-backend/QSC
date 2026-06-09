import styled, { keyframes } from "styled-components";
import { appTheme } from "../../../project/brand/project";
export const PageLayout = styled.div`
  display: block;
  width: 100%;
  bottom: 80px;
  top: 80px;
  position: absolute;
  overflow: auto;
  padding-bottom: 20px;
  &.tabs {
    display: flex;
    padding: 20px 0px 0 20px;
  }
  &.steps {
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
  }
  &.plain {
    position: static;
    overflow: inherit;
    display: flex;
    padding: 0;
  }

  &.iframe {
    padding-bottom: 0px;
  }
  &.accordion {
    padding-bottom: 0;
  }
  &.center {
    padding-bottom: 0;
  }
  @media (max-width: 768px) {
    position: initial;
  }
`;
export const SubPage = styled.div`
  padding: 20px;
  overflow: auto;
`;
export const Form = styled.div`
  border: 0px solid rgb(224, 224, 227);
  padding: 0.5em 0px;
  border-left: 10px;
  border-right: 0;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* height: 80px; */
  padding: 20px 24px;
  flex: 1;

  &.double {
    display: grid;
    grid-template-columns: 1 1 1 1; /* Four equal columns (25% each) */
    grid-template-columns: repeat(12, 1fr);
    gap: 16px; /* Space between items */
    flex-flow: wrap;
  }
  &.single {
    display: grid;
    grid-template-columns: 1 1; /* Four equal columns (25% each) */
    grid-template-columns: repeat(12, 1fr);
    gap: 16px; /* Space between items */
    flex-flow: wrap;
  }

  &.embed {
    padding: 20px 0px;
  }
  &.accordion {
    padding: 0;
  }
  &.checkout {
    padding: 0px 0px !important;
  }
  &.plain {
    padding: 0px 0px 20px;
  }
  &.horizontal {
    display: flex;
    margin: 0;
    padding: 0;
    justify-content: center;
  }

  &.settings {
    padding: 20px;
  }
  &.info {
    border: 1px solid ${appTheme.stroke.soft};
    padding: 16px;
    border-radius: 16px;
  }
  &.SubPage {
    padding: 20px;
    overflow: auto;
    margin-top: 0;
    margin-bottom: auto;
    grid-auto-rows: min-content;
  }
  &.steps {
    padding: 0px;
    overflow: initial;
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
    /* background-color: ${appTheme.bg.soft}; */
    padding: 0px;
    margin-bottom: 20px;
    &.horizontal.info {
      margin: 0px;
      background-color: ${appTheme.bg.white};
      border: 0;
    }
  }
  &.page {
    padding: 0px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: initial;
    background-color: white;
    border-radius: 0px;
    width: 100%;
  }
  &.center {
    padding: 30px;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    top: 0;
    bottom: 0;
    &.center {
      padding: 0px;
    }
    height: 100dvh;
    &.plain {
      height: auto;
    }
    /* border-top: 1px solid rgb(224, 224, 227); */
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
const popupAnimation = keyframes`  
  from {  
    opacity: 0;  
    scale: 0.95;  
  }  
  to {  
    opacity: 1;  
    scale: 1;  
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
  &.large {
    width: 1200px;
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
      padding-bottom: 80px;
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
  &.center {
    margin: auto;
    border-radius: 12px;
    max-height: auto;
    animation: ${popupAnimation} 0.1s ease-in-out;
  }
  &.center {
    height: auto;
    /* margin-top: 50px;
    margin-bottom: 50px; */
    overflow: initial;
    border-radius: 12px;
    /* align-self: center; */
    > div:first-child {
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    > div {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      bottom: auto;
      overflow: initial;
      width: 100%;
    }
    > div:last-child {
      margin-bottom: 10px;
    }
  }
  &.page {
    > div:first-child {
      position: initial;
      padding: 0;
      height: auto;
      > div {
        padding: 10px 0 20px;
      }
    }
    > div {
      position: initial;
      overflow: initial;
      > div {
        padding: 30px 0;
      }
    }
    > div:last-child {
      position: initial;
      padding: 0 !important;
      justify-content: right;
      > button {
        width: auto;
        margin-right: 0;
      }
      > div {
        padding: 0;
      }
    }
  }
  &.page {
    width: 100%;
    height: auto;
    overflow: initial;
    margin: 0;
    max-height: fit-content;
  }
  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    top: 0;
    padding: 0;
    &.double {
      width: 100%;
    }
    width: 100%;
    height: 100dvh;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    /* } */
    &.plain {
      position: relative;
      
    }
    &.center {
      overflow: auto;
      > div {
      position: relative;
      top: auto;
      left: auto;
      right: auto;
      bottom: auto;
      overflow: auto;
      width: 100%;
    }
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
  padding: 10px 24px !important;
  border: 1px 0px 0px 0px;
  gap: 10px;
  bottom: 0;
  width: 100%;
  height: 80px;
  border-top: 1px solid ${appTheme.stroke.soft};
  background-color: ${appTheme.bg.white};
  z-index: 1;
  position: absolute;
  bottom: 0;
  &.plain {
    box-shadow: none;
    justify-content: left;
    border-top: 0px solid #e9e9e9;
    position: inherit;
    bottom: 0;
    padding: 0;
    &.put.disabled {
      display: none;
    }
    width: 300px;
    margin-left: auto;
    margin-right: 0;
  }
  &.info {
    border-radius: 12px;
  }
  &.checkout {
  }
  && {
    .embed & {
      justify-content: left;
      padding: 0;
    }
  }
  &.landing {
    position: inherit;
    width: 300px;
    margin: auto;
  }
  &.iframe {
    position: sticky;
    bottom: 0;
    padding-bottom: 10px !important;
    border-top: 1px solid ${appTheme.stroke.soft};
    height: auto;
  }
  &.popup {
    left: 0;
    right: 0;
    position: sticky;
  }
  &.bottom {
    left: 0px;
    right: 0px;
    position: absolute;
    bottom: 0;
    top: auto;
  }
  &.center {
    width: auto;
    width: 100%;
    justify-content: end;
    button {
      width: auto;
    }
  }

  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: white;
    &.plain {
      padding-bottom: 10px !important;
    }
    &.info {
      position: relative;
      z-index: 0;
    }
  }

  .processing {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    svg {
      margin-right: 4px;
    }
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
export const Round = styled.div`
  /* Icon */

  /* Auto layout */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px;
  font-family: Inter;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  text-align: center;

  width: 20px;
  height: 20px;
  background: transparent;
  border: 1px solid ${appTheme.stroke.soft};
  color: ${appTheme.text.sub};
  &.active {
    background: #375dfb;
    color: ${appTheme.text.white};
  }
  &.done {
    background: ${appTheme.state.success};
    color: ${appTheme.text.white};
  }
  svg {
    color: white;
  }
  border-radius: 50%;
`;
export const Navigation = styled.div`
  display: flex;
  gap: 15px;
  padding: 10px 0;
  margin-bottom: 20px;
  align-items: center;
  position: sticky;
  top: -20px;
  background-color: white;
  z-index: 1;
  margin: auto;
  justify-content: center;
  left: 0;
  right: 0;
  top: 17px;
  background: transparent;
  pointer-events: none;
  &.post {
    position: absolute;
  }
  span {
    color: ${appTheme.text.sub};
    &.active {
      color: ${appTheme.text.main};
    }
  }
  svg {
    font-size: 10px;
  }
  @media screen and (max-width: 768px) {
    gap: 7px;
    font-size: 11.2px;
    font-weight: 500;
    line-height: 13.56px;
    letter-spacing: -0.006em;
    text-align: left;
    -webkit-box-pack: justify;
    justify-content: space-between;
    max-width: 360px;
    position: sticky;
    top: 0;
    background: white;
    padding: 10px 0;
    margin-bottom: 0;
    span {
      display: none;
    }
    &.post {
      position: absolute;
      justify-content: center;
      width: min-content;
      margin: auto;
      height: 58px;
      background: transparent;
      pointer-events: auto;
    }
  }
`;
