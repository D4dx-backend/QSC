import styled, { keyframes } from "styled-components";
import { appTheme } from "../../../project/brand/project";
export const Form = styled.div`
  border: 1px solid rgb(224, 224, 227);
  padding: 1em;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    border: 0;
  }
`;
// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;
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
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 25px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  z-index: 1001;
  background-color: #00000033;
  &.plain {
    position: inherit;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    top: 0;
    bottom: 0;
    border-top: 1px solid rgb(224, 224, 227);
  }
`;

const slideRightToLeft = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  border-radius: 10px;
  width: 30%;
  min-width: 250px;
  max-width: 100%;
  height: auto;
  overflow: auto;
  animation: ${slideAnimation} 0.3s ease-in-out;
  &.no-animation {
    animation: none;
  }
  margin: 5vh auto auto auto;
  padding: 0em 0;
  background-color: white;
  max-height: 90%;
  box-shadow: 0px 0px 3px 1px rgb(181 181 181 / 45%);
  inset: 0px 0px 0px auto;
  &.side {
    display: flex;
    flex-direction: column;
    display: flex;
    background-color: white;
    border-radius: 0px;
    width: 30%;
    min-width: 400px;
    animation: ${slideRightToLeft} 1s ease-in-out;
    animation-duration: 0.2s;
    padding: 0em 0em 0em;
    max-height: 100%;
    left: auto;
    right: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    margin: inherit;
    position: relative;
    overflow: auto;
  }
  &.print {
    width: 70%;
  }
  &.medium {
    width: 70%;
    min-width: 250px;
    max-width: 100%;
    min-width: 250px;
    max-width: 100%;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    max-height: 100%;
    border-radius: 0;
  }
  &.medium.iframe {
    width: 800px;
    min-width: 250px;
    max-width: 100%;
  }
  &.filter {
    right: 0px;
    position: absolute;
    top: 0;
    bottom: 0;
    max-height: 100%;
    margin: 0;
    border-radius: 0;
    animation: ${slideRightToLeft} 0.3s ease-in-out;
    box-shadow: rgb(237, 237, 237) -2px -1px 11px 3px;
  }
  &.large {
    width: 80%;
    min-width: 250px;
    max-width: 100%;
    min-width: 250px;
    max-width: 100%;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    max-height: 100%;
    border-radius: 0;
  }
  &.small {
    width: 30%;
    min-width: 250px;
    max-width: 100%;
    min-width: 250px;
    max-width: 100%;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    max-height: 100%;
    border-radius: 0;
  }
  &.full-page {
    position: fixed;
    top: 0;
    bottom: 0;
    height: 100dvh;
    max-height: 100dvh;
    margin: 0;
    width: 100%;
    border-radius: 0;
  }
  &.plain {
    position: inherit;
  }
  &.full-page > .popup-data > .vertical-menu > .vertical-menu > .vertical-menu > .data-layout > {
    .horizontal.medium {
      /* max-height: calc(69vh); */
      /* min-height: calc(100% - 221px); */
    }
  }
  &.medium > .popup-data > .horizontal > .horizontal > .horizontal > .data-layout > .noshadow > .data-layout > {
    .horizontal.medium {
      max-height: calc(45vh);
      min-height: calc(45vh);
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    top: 0;
    padding: 0;
    &.medium {
      width: 100%;
      min-width: 250px;
      max-width: 100%;
      padding: 0px;
    }
    &.small {
      width: 90%;
    }
    &.medium {
      width: 100%;
    }
    &.large {
      width: 100%;
    }
    &.full-page {
      width: 100%;
    }
  }
`;
export const FormHeader = styled.div``;
export const HeaderBox = styled.div`
  display: flex;
  border-bottom: 1px solid ${appTheme.stroke.soft};
  padding: 16px 32px 16px 32px;
  width: calc(100% - 80px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  > div {
    display: flex;
    gap: 14px;
    align-items: center;
    > svg {
      width: 30px;
      font-size: 30px;
    }
    > div:first-child {
      /* margin-left: 10px; */
    }
    > div:last-child {
      display: flex;
      flex-direction: column;
      gap: 2px;

      > span:first-child {
        font-size: 18px;
        font-weight: 700;
        line-height: 24px;
        letter-spacing: -0.015em;
        text-align: left;
      }
      > span:last-child {
        color: #525866;
        font-weight: normal;
        font-size: 14px;
      }
    }
  }
  &.custom {
    > div {
      display: flex;
      gap: 14px;
      align-items: baseline;
     
    }
  }
  @media (max-width: 768px) {
    padding: 16px;
    align-items: center;
    margin-right: auto;
    overflow: hidden;
    height: 60px;
    > div {
      display: flex;
      gap: 0px;
      max-width: 80%;
      > div:last-child {
        gap: 0px;
        >div{
          font-size: 16px;
        }
        >p{
          font-size:12px;
        }
      }
    }
  }
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  
  padding: 20px 24px 20px 24px;
  position: absolute;
  height: 80px;
  width: 100%;
  top: 0px;
  top: 0;
  background-color: ${appTheme.bg.white};
  z-index: 1;
  border-bottom: 1px solid ${appTheme.stroke.soft};
  &.head-hide {
    display: none;
  }
  &.embed {
    padding: 0;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  &.checkout {
    padding-bottom: 5px !important;
    margin-bottom: 20px;
    height: auto;
  }
  &.recipe-header {
    position: initial;
    height: auto;
    align-items: center;
    padding: 0;
  }
  & > div {
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    width: 100%;
    align-items: center;

    > span {
      font-size: 18px;
      font-weight: 500;
      line-height: 19.36px;
      letter-spacing: -0.011em;
      text-align: left;
    }
  }
  &.custom > div {
    display: flex;
    gap: 14px;
    align-items: baseline;
  }
  &.embed > div > span {
    font-size: 16px;
    text-align: left;
    align-items: baseline;
    flex-direction: column;
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.011em;
    text-align: left;
  }
  > span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left;
  }
  span > bold {
    font-weight: 700;
  }
  > span svg {
    margin-right: 5px;
    font-size: 12px;
  }
  > span svg:first-child {
    margin-right: 5px;
    font-size: 16px;
  }
  .small {
    font-size: 12px;
  }
  &.plain {
    /* padding: 10px 0; */
    box-shadow: none;
    /* border-bottom: 1px solid #e9e9e9; */
    position: inherit;
    padding: 0 0 15px 0;
    height: auto;
  }
  &.parent {
    padding: 0;
    border-bottom: 0;
    border-bottom: 1px solid ${appTheme.stroke.soft};
  }
  && {
    .filter & {
      padding: 5px 10px;
    }
  }
  &.form {
    /* padding: 0.5em 0.5em; */
  }
  &.small {
    padding: 5px;
    padding: 5px;
    /* border-bottom: 1px solid rgb(243, 243, 243); */
    margin-bottom: 10px;
  }
  &.small button {
    background-color: rgb(243, 243, 243);
    height: 30px;
    padding: 5px;
    width: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.small > span {
    font-size: 12px;
  }
  &.horizontal {
    border-bottom: 1px solid ${appTheme.stroke.soft};
    .header-data {
      border: 0;
    }
  }
  /* border-bottom: 1px solid rgb(204, 204, 204); */
  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-bottom: 1px solid rgb(224, 224, 227);
    padding: 1em 1.5em;
    height: 60px;
    > span {
      display: block;
    }
    /* .profile-image {
      display: none;
    } */
    .header-data {
      border: 0;
      padding: 0px 15px 0px 15px;
    }
  }
`;
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  justify-content: center;
  @media (max-width: 768px) {
    position: sticky;
    bottom: 0;
    background: white;
    padding-bottom: 10px;
    border-top: 1px solid rgb(224, 224, 227);
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
export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 0;
  align-items: flex-end;
  height: 60px;
`;

export const Tab = styled.div`
  padding: 0px;
  background-color: white;
  display: none;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  ${(props) =>
    props.active &&
    `
    display: flex;
  `}
`;

export const TabLink = styled.div`
  cursor: pointer;
  padding: 10px;
  flex: 1 1 50%;
  background-color: #ddedeb;
  color: #77998e;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 30px;
  &:first-child {
    border-top-left-radius: 10px;
  }
  &:last-child {
    border-top-right-radius: 10px;
  }
  &.active {
    background-color: #ffffff;
    color: #77998e;
    height: 40px;
    box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    font-weight: 600;
    font-size: 16px;
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`;

export const Section = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  flex: 1 1 100%;
  box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px;
  padding: 0;
  margin-bottom: 1em;
  margin: 1em;
  border-radius: 10px;
  background: #f3f8fb;
  padding-bottom: 10px;
`;
export const PlainSection = styled.div`
  display: flex;
  flex: auto;
  flex-direction: column;
  flex: 1 1 100%;
  padding: 1em;
  margin-bottom: 1em;
`;
