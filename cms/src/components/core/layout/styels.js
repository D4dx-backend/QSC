import styled from "styled-components";
import { appTheme } from "../../project/brand/project";

export const MainContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  overflow: hidden;
  &.center {
    justify-content: center;
    flex: 1;
    align-items: center;
  }
  @media (max-width: 768px) {
    position: fixed;
    z-index: 1003;
    height: calc(100vh - 60px);

  }
`;

export const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: auto;
  width: 16em;
  &.sticky {
    a span {
      display: flex;
    }
    .open span {
      display: flex;
    }
  }

  .menus {
    color: white;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    background: white;
    background-color: ${(props) => props.theme.background};
    order: 1;
    z-index: 1;
    padding: 20px 20px 16px 20px;
    /* box-shadow: rgb(237, 237, 237) 6px 0px 11px 3px; */
    border-right: 1px solid #e2e4e9;
    height: 100%;
    transition: all 0.2s ease-in;
    overflow-y: auto;
  }
  /* &.hover:hover {
     transition: all 0.2s ease 0s;
    .menus {
      width: 272px;
      
    }
    a span {
      display: initial;
    }
    .open span {
      display: initial;
    }
  } */
  &.submenu {
    width: 90px;
    .title {
      display: none;
    }
    a.main {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 0px;
      -webkit-box-pack: center;
      justify-content: center;
      text-align: center;
      padding: 0;
      padding: 7px 10px;
      height: auto;
      border-radius: 0;
    }
    a.main span {
      font-size: 10px;
      font-weight: 500;
      line-height: 16px;
    }
    svg {
      margin-right: auto !important;
      margin-left: auto !important;
      width: 18px;
      height: 18px;
    }
    .menus {
      padding: 0px;
      padding-top: 20px;
    }
    .menus > nav {
      display: flex;
      gap: 10px;
    }
    a::after {
      display: none !important;
    }
    a::before {
      display: none !important;
    }
    .header {
      padding: 0;
    }
  }
  @media screen and (max-width: 768px) {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    visibility: collapse;
    min-height: 60%;
    max-height: 100%;
    z-index: 1001;
    box-shadow: none;
    &.active {
      visibility: visible;
    }
  }
`;

export const Container = styled.div`
  display: flex;
  flex: 1 1 100%;
  overflow: auto;
  /* box-shadow: inset rgb(0 0 0 / 6%) 0px 0px 8px 7px; */
  max-width: 100%;
  width: 100%;
  &.noshadow {
    box-shadow: none;
    overflow: initial;
  }
  &.nopadding {
    padding: 0;
  }
  /* background: ${(props) => props.theme.pageBackground}; */
  @media screen and (max-width: 768px) {
    /* padding-bottom: 20px; */
    display: block;
  }
`;
export const ProfileStatus = styled.span`
  font-size: 10px;
  position: absolute;
  right: -2px;
  bottom: -4px;
  margin: 0px !important;
  background: ${(props) => props.color};
  width: 10px;
  height: 10px;
  padding: 2px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  display: flex;
  svg {
    color: white;
  }
`;

export const ProfileIcon = styled.div`
  position: relative;
  background-color: rgb(255, 255, 255);
  color: rgb(255, 255, 255);
  width: 35px;
  height: 35px;
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: -15px;
  margin: auto;
  img {
    border: 5px solid white;
  }
`;
export const Popbar = styled.div`
  position: fixed;
  right: 28px;
  top: 0px;
  border-radius: 10px;
  bottom: auto;
  border: 1px solid ${appTheme.stroke.soft};
  padding: 0px;
  white-space: nowrap;
  z-index: 1001;
  background: white;
  display: flex;
  flex-direction: column;
  -webkit-box-pack: justify;
  justify-content: space-between;
  align-items: flex-start;
  width: 300px;
  min-height: 200px;
  .main {
    font-size: 18px;
    margin-top: 30px;
    font-weight: 600;
    text-align: center;
  }
  .sub {
    font-size: 12px;
    text-align: center;
    margin-top: 0px;
  }
`;
export const Top = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: calc(100% - 20px);
  box-sizing: border-box;
  .banner {
    height: 100px;
    margin: 0px;
    /* background: ${(props) => props.theme.gradient}; */
    background: -webkit-linear-gradient(302deg, ${appTheme.primary.base}, rgb(90, 169, 230) 100%);
    position: relative;
    padding: 10px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
  }
`;
export const Bottom = styled.div`
  display: flex;
  border-radius: 12px;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;
export const ToggleInput = styled.input`
  opacity: 0;
  width: 100%;
  height: 25px;
  cu span {
    box-shadow: 0 0 1px #2196f3;
  }
`;
export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e7f2f9;
  transition: 0.4s;
  box-shadow: 0 0 1px #2196f3;
  border-radius: 34px;
  &:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    background-color: ${({ disable }) => disable || "white"};
  }

  ${ToggleInput}:checked + &::before {
    transform: translateX(18px);
    background-color: ${({ enable }) => enable || "green"};
  }
`;
export const ToggleSwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  border: 0;
  outline: none;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  min-height: 40px;
  height: 40px;
  width: 70px;
  border-radius: 10px;
  margin: 4px 0px;
  background: white;
  transition: all 1s ease 0s;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  cursor: pointer;
  font-weight: bold;
  &.list {
    margin-right: 0;
  }
`;
export const ToggleSwitch = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.1s;
  border-radius: 10px;
  color: ${({ disable, enable, checked }) => (checked ? (enable ? enable : "green") : disable ? disable : "red")};
  justify-content: center;
  background-color: ${({ checked }) => (checked ? "rgb(204, 204, 204)" : "white")};
  align-items: center;
  display: flex;
  font-size: ${({ checked }) => (checked ? "20px" : "18px")};
  svg {
    left: 4px;
    bottom: 3px;
    transition: 0.4s;
    border-radius: 50%;
  }
`;
