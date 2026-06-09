import styled from "styled-components";
import { appTheme } from "../../project/brand/project";

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  &.vertical-menu {
    flex-direction: row;
    align-items: flex-start;
    position: relative;
    min-height: 73vh;
  }
  &.horizontal {
    > .horizontal .tab {
      /* margin: 1em 0.5em 0px; */
      max-height: 100%;
    }
    > .menu > div {
      box-shadow: none;
      border-radius: 12px;
      width: inherit !important;
      padding: 15px 20px 20px;
      margin-top: 0;
      /* white-space: nowrap !important; */
      &::after {
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0;
    &.vertical-menu {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 0;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: auto;
  margin: 0px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 0;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: auto;
  margin: 0px;
  gap: 15px;
  padding: 20px;
  border-right: 1px solid #e2e4e9;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px 2px; */
  &.vertical-menu {
    /* padding: 20px 0px 20px;
    margin: 0px 0px 0px; */
    /* box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px 2px; */
    border-radius: 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    min-width: 15em;
    height: 100%;
    max-width: 15em;
  }
  &.custom {
    margin: 0;
  }
  &.sub-menu {
    max-width: 80px;
    min-width: 80px;
    padding: 0;
  }
  &.horizontal {
    width: auto;
    max-width: 100%;
    display: flex;
    align-items: flex-end;
    -webkit-box-pack: start;
    justify-content: flex-start;
    overflow: auto;
    margin: 0px;
    gap: 10px;
    padding: 5px;
    border-right: 0px;
    /* background: ${appTheme.bg.weak}; */
    padding: 15px 20px 0.5em;
    border-radius: 0px;
  }

  @media (max-width: 768px) {
    margin: 0px 0px;
    &.vertical-menu {
      margin: 0px;
      flex-direction: row;
      flex-direction: row;
      height: 70px;
      max-width: 100%;
      padding: 0;
      gap: 0px;
      box-shadow: rgba(0, 0, 0, 0.07) 0px -3px 7px 0px;
      padding: 0px 10px 0 0px;
      align-items: center;
      z-index: 1;
      position: absolute;
      bottom: 0;
      background-color: white;
    }
    &.secondary-menu {
      padding: 0px 10px 0 20px;
      position: sticky;
      white-space: nowrap;
      height: 45px;
      top: 0;
      background-color: white;
      box-shadow: rgba(0, 0, 0, 0.07) 0px 2px 7px 0px;
      width: 100%;
    }
    &.sub-menu {
      padding: 0;
      height: 60px;
    }
    &.sub-menu.horizontal {
      padding: 5px 15px;
      height: 50px;
    }
  }
`;
export const TabContents = styled.div`
  flex: auto;
  width: 100%;
  margin-bottom: 30px;

  &.vertical-menu {
    display: flex;
    width: calc(100% - 240px);
    max-width: calc(100% - 240px);
    /* padding: 25px 25px 0; */
    height: 100%;
    left: 260px;
    overflow: auto;
    margin-bottom: 0;
    bottom: 0;
    top: 0;
    &.menu {
      width: calc(100% - 100px);
      max-width: calc(100% - 80px);
      max-height: calc(100vh - 80px);
    }
  }
  @media (max-width: 768px) {
    &.vertical-menu {
      width: calc(100%);
      max-width: calc(100%);
      padding: 0;
      &.menu {
        width: calc(100%);
        max-width: calc(100%);
        max-height: calc(100vh - 80px);
        height: calc(100vh - 80px);
      }
    }
  }
`;
export const Tab = styled.div`
  padding: 0px;
  /* border-top: 1px solid #d0d0d0; */
  display: none;
  /* box-shadow: rgb(0 0 0 / 16%) 0px 1px 4px; */
  border-radius: 10px;
  padding: 20px 20px 20px;
  flex-direction: column;
  max-width: 100%;
  overflow: auto;
  &.info {
    /* margin: -25px; */
    border: 0;
  }
  &.custom {
    margin: 10px 0px 0px;
    padding: 0px;
  }
  &.vertical-menu {
    flex: auto;
  }
  &.horizontal {
    > .data-layout {
      padding: 0em 10px !important;
    }
    &.info {
      margin: 0px;
      border: 0;
    }
    > .form-container {
      background-color: white;
      padding: 5px;
    }
  }
  ${(props) =>
    props.active &&
    `
    display: flex;
  `}
  @media (max-width: 768px) {
    padding: 15px 15px 60px;
    &.vertical-menu {
      flex: auto;
      width: 100%;
    }
  }
`;
export const InlineMenu = styled.div`
  border-left: 2px solid ${appTheme.primary.base};
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 20px;
  margin-left: 20px;
  @media (max-width: 768px) {
    flex-direction: row;
    display: content;
    white-space: nowrap;
    gap: 10px;
  }
`;
export const InlineMenuItem = styled.div`
  display: flex;
  min-height: 28px;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.006em;
  align-items: center;
  cursor: pointer;
  svg {
    width: 15px;
  }
  &:hover {
    color: ${appTheme.primary.base};
  }
  &.active {
    color: ${appTheme.primary.base};
  }
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;
export const Title = styled.div`
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0.04em;
  text-align: left;
  padding: 4px;
  color: ${appTheme.text.soft};
  margin-top: 16px;
  &:first-child {
    margin-top: 0;
  }
  @media (max-width: 768px) {
    margin-top: inherit;
    background: transparent;
    border-radius: 10px;
    padding: 8px 10px;
    height: 100%;
    color: ${appTheme.primary.base};
    font-size: 12px;
  }
`;
export const PopMenuItem = styled.div`
  cursor: pointer;
  padding: 10px 0px;
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  padding: 10px 10px;
  gap: 10px;
  font-weight: normal !important;
  align-items: center;
  display: flex;
  color: #525866;
  font-size: 14px;
  &.active::after {
    content: "";
    display: block;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px; /* Adjust size as needed */
    height: 20px; /* Adjust size as needed */
    background: white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.15s ease-in-out 0s;
  }

  &.active::before {
    content: "";
    position: absolute;
    right: 22px; /* Adjust to center within the circle */
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    border-top: 2px solid black;
    border-right: 2px solid black;
    z-index: 1;
    transition: all 0.15s ease-in-out 0s;
  }
  &.submenu.active::before {
    transform: translateY(-60%) rotate(135deg);
  }
  &.horizontal.active::after {
    left: auto;
    right: 10px;
  }
  &.horizontal.active::before {
    left: auto;
    right: 17px;
    transform: translateY(-50%) rotate(135deg);
  }
  svg {
    width: 20px;
  }
  :hover {
    color: black;
    background-color: #f6f8fa;
    /* font-weight: 500 !important; */
    svg {
      color: ${(props) => props.theme.theme};
    }
  }
  &:first-child {
    border-radius: 10px;
  }
  &:last-child {
    border-radius: 10px;
  }
  &.active {
    background-color: #f6f8fa;
    color: black;
    font-weight: 500 !important;
    svg {
      color: ${(props) => props.theme.theme};
    }
    /* font-weight: bold; */
    position: relative;
    @media (max-width: 768px) {
      font-size: 14px;
    }
    /* padding-right: 22px; */
  }
  &.horizontal.active {
    padding-right: 4%;
  }
  @media (max-width: 768px) {
    flex-direction: row;
    white-space: nowrap;
    border-radius: 0px;
    width: auto;
    &.active::before {
      display: none;
    }
    &.active::after {
      display: none;
    }
    &:first-child {
      border-radius: 0px;
    }
    &:last-child {
      border-radius: 0px;
    }
    padding: 8px 10px;
    height: 100%;
    /* overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%; */
  }
`;
export const PopIconMenuItem = styled.div`
  cursor: pointer;
  padding: 10px 0px;
  width: 100%;
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  padding: 12px 10px;
  gap: 10px;
  font-weight: normal !important;
  align-items: center;
  display: flex;
  color: #525866;
  flex-direction: column;
  font-size: 10px;
  text-align: center;
  /* width: 1000px; */

  svg {
    width: 20px;
    height: 20px;
  }
  :hover {
    color: black;
    background-color: #f6f8fa;
    font-weight: 500 !important;
    svg {
      color: ${(props) => props.theme.theme};
    }
  }

  &:first-child {
    border-radius: 0px;
  }
  &:last-child {
    border-radius: 0px;
  }
  &.active {
    background-color: #f6f8fa;
    color: black;
    font-weight: 500 !important;
    svg {
      color: ${(props) => props.theme.theme};
    }
    font-weight: bold;
    position: relative;
    @media (max-width: 768px) {
      font-size: 10px;
    }
  }
  &.horizontal {
    flex-direction: row;
    padding: 12px 10px;
    /* min-height: 50px; */
    border-radius: 12px;
    width: auto;
    background: ${appTheme.bg.white};
    color: ${appTheme.text.main};
    font-size: 14px;
    font-size: 14px;
    font-weight: 500 !important;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left;
    color: ${appTheme.text.soft};
    border: 1px solid ${appTheme.bg.weak};
    white-space: nowrap;
    &.active {
      background: ${appTheme.bg.weak};
      color: ${appTheme.primary.base};
      font-weight: 500 !important;
      box-shadow: 0px 2px 4px 0px #1b1c1d05;
    }
  }
  @media (max-width: 768px) {
    /* flex-direction: row;
    white-space: nowrap;
    padding: 8px 10px; */
    padding: 0px 10px;
    height: 100%;
    align-items: center;
    display: flex;
    place-content: center;
    gap: 5px;
    svg {
      width: 15px;
      height: 15px;
    }
  }
`;
export const TabLink = styled.div`
  cursor: pointer;
  padding: 10px 0px;
  flex: 1 1 50%;
  background-color: rgb(255, 255, 255);
  color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: bold;
  flex: inherit;
  gap: 10px;
  /* min-width: 60px;  */
  white-space: nowrap;
  border-radius: 10px;
  border: 1px solid #e2e4e9;
  transition: all 0.1s ease-in;

  :hover {
    /* transition: padding 0s ease-in; */
    /* font-weight: bold; */
    /* padding: 5px 13.1px; */
  }
  &:first-child {
    border-radius: 10px;
  }
  &:last-child {
    border-radius: 10px;
  }
  &.active {
    /* background-color: ${(props) => props.theme.pageForeground}; */
    background-color: #f6f8fa;
    color: ${(props) => props.theme.theme};
    font-weight: bold;
    position: relative;
    &.active::after {
      border: 0px solid rgb(129, 2, 129);
      content: "";
      display: block;
      height: 2px;
      width: 100%;
      bottom: 0px;
      left: 0;
      background: rgb(129, 2, 129);
      transition: all 0.15s ease-in-out 0s;
      position: absolute;
      @media (max-width: 768px) {
        bottom: 1px;
        width: 100%;
        height: 2px;
        border-radius: 10px;
      }
    }
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
  && {
    .vertical-menu & {
      width: -webkit-fill-available;
      justify-content: left;
      text-align: left;
      box-shadow: none;
      padding: 8px 13px !important;
      white-space: pre-wrap;
      border-radius: 12px !important;
      margin-right: 10px;
      svg {
        min-width: 20px;
      }
      &.active::after {
        content: "";
        display: block;
        position: absolute;
        right: 15px;
        left: auto;
        top: 50%;
        transform: translateY(-50%) rotate(45deg);
        width: 6px;
        background-color: transparent;
        height: 6px;
        border-top: 1px solid black;
        border-right: 1px solid black;
        transition: all 0.15s ease-in-out 0s;
        @media (max-width: 768px) {
          width: 100%;
          height: 2px;
          margin-left: 0;
        }
      }
    }
  }
  && {
    .vertical-menu & {
      padding: 10px 0px;
      &.active {
        box-shadow: none;
      }
      border-radius: 0;
    }
  }
  @media (max-width: 768px) {
    white-space: nowrap;
    flex: none;
    && {
      .vertical-menu & {
        width: auto;
        height: 100%;
      }
    }
  }
`;
