import styled from "styled-components";
import { appTheme } from "../../project/brand/project";
export const Container = styled.div`
  display: flex;
  gap: 10px;
  &.left {
    justify-content: flex-start;
  }
  &.right {
    justify-content: flex-end;
  }
  &.center {
    justify-content: center;
  }
`;
export const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: sticky;
  top: 0;
  height: 40px;
  background: ${appTheme.bg.weak};
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px;
  letter-spacing: -0.006em;
  text-align: left;
  border-radius: 10px;
  padding: 4px;
  > label {
    padding: 6px 8px 4px 8px;
    gap: 6px;
    min-height: 26px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.04em;
    text-align: left;
    color: ${appTheme.text.soft};
  }
  &.custom {
    width: max-content;
    margin: 0px 0;
  }
  &.tab-menu,
  &.tab-menu1 {
    flex-direction: column;
    position: sticky;
    padding: 10px;
    height: auto;
    gap: 8px;
    background-color: transparent;
    border: 1px solid ${appTheme.stroke.soft};
    align-self: baseline;
    margin-top: 15px;
    min-width: 350px;
  }
  &.left {
    margin: 0;
    margin-right: auto;
  }
  &.right {
    margin: 0;
    margin-left: auto;
  }
  &.center {
    margin: 0;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const TabButton = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  gap: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px;
  letter-spacing: -0.006em;
  text-align: left;
  svg {
    width: 20px;
    height: 20px;
    padding: 2px;
  }
  &.true {
    background-color: #ccc;
    font-weight: 500;
    border: 0px solid #e2e4e9;
    background-color: ${appTheme.bg.white};
    color: ${appTheme.text.main};
    border-radius: 10px;
  }
  &.tab-menu {
    font-size: 14px;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    text-align: center;
    border-width: 0px solid transparent;
    padding: 8px;
    margin: 0px;
  }
  &.tab-menu.true {
    background-color: ${appTheme.bg.weak};
    color: ${appTheme.text.main};

    svg {
      color: ${appTheme.primary.base};
    }
  }
  border: none;
  font-size: 14px;
  margin-bottom: 0px;
  border-radius: 10px;
  &.nomargin {
    margin: 0;
  }
  cursor: pointer;
  /* &:first-child {
    border-radius: 10px 0 0 10px;
  }
  &:last-child {
    border-radius: 0 10px 10px 0;
  } */
`;
export const SwitchButton = styled.div`
  border: 0;
  outline: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 32px;
  height: 30px;
  width: 50px;
  min-width: 32px;
  border-radius: 10px;
  margin: 4px 0px;
  transition: all 1s ease 0s;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  cursor: pointer;
  font-weight: bold;
  text-wrap: nowrap;
  position: relative;
  border: 1px solid #e2e4e9;
  &.custom {
    margin: 0;
    margin-right: 0px;
  }
  &.left {
    margin: 0;
    margin-right: auto;
  }
  &.right {
    margin: 0;
    margin-left: auto;
  }
  &.center {
    margin: 0;
    margin-left: auto;
    margin-right: auto;
  }
  span {
    transition: all 1s ease 0s;
    background: white;
    color: black;
    padding: 0px;
    border-radius: 10px;
    top: 45px;
    z-index: 100;
    font-size: 12px;
  }
  background-color: ${({ active, enableBg }) => (active ? enableBg ?? "green" : "white")};
  color: ${({ active, enableColor }) => (active ? enableColor ?? "white" : "grey")};
  svg {
    font-size: 16px;
    /* transform: ${({ active }) => (active ? "scale(1.2)" : "scale(1)")}; */
  }

  &:hover span {
    display: flex;
    width: auto;
  }
`;
