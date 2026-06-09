import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";
export const Header = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e2e4e9;
  margin-bottom: 20px;
  padding: 20px;
  margin: 20px;
  &.hd {
    justify-content: space-between;
    align-items: center;
  }
  @media (min-width: 768px) {
    &.hd {
      display: none;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;
export const Nav = styled.nav`
  padding-top: 0em;
  display: flex;
  flex-direction: column;
  color: gray;
  padding-bottom: 1em;
  /* overflow-y: auto; */
  font-weight: 500;
  padding: 10px 8px;
  gap: 6px;
  .menu-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .menu-section + .menu-section {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #eef2f8;
  }
  .inline-submenus {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-left: 18px;
    padding-left: 12px;
    border-left: 2px solid #e6ebf3;
    margin-top: 2px;
    margin-bottom: 4px;
    .submenu-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .submenu-section + .submenu-section {
      margin-top: 6px;
      padding-top: 8px;
      border-top: 1px solid #eef2f8;
    }
  }
  a.sub {
    text-decoration: none;
    color: #627798;
    min-height: 34px;
    display: flex;
    justify-content: left;
    align-items: center;
    position: relative;
    border-radius: 10px;
    font-size: 13px;
    gap: 8px;
    padding: 4px 10px;
    transition: all 0.2s ease-in;
  }
  a.sub:hover,
  a.sub.active {
    background: linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%);
    color: ${(props) => props.theme.theme};
    box-shadow: inset 0 0 0 1px #dbe6f7;
    span {
      color: #142749;
    }
    svg {
      color: ${(props) => props.theme.theme};
    }
  }
  a.sub svg {
    margin-left: 6px;
    width: 16px;
    height: 16px;
    color: #6d7f9e;
  }
  a.main,
  .open {
    text-decoration: none;
    color: #627798;
    min-height: 40px;
    display: flex;
    justify-content: left;
    align-items: center;
    transition: all 0.02s;
    position: relative;
    margin: 0px;
    border-radius: 14px;
    font-size: 14px;
    gap: 8px;
    transition: all 0.2s ease-in;
    padding-right: 10px;
  }
  && {
    .down {
      a.main span,
      .open span {
        padding-right: 1em;
      }
    }
  }

  a.open {
    cursor: unset;
  }
  a.main.active,
  a.main:hover {
    background: linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%);
    color: ${(props) => props.theme.theme};
    box-shadow: inset 0 0 0 1px #dbe6f7;
    font-weight: normal;
    span {
      color: #142749;
    }
    opacity: 1;
  }
  a.main.active:after {
    content: "";
    display: block;
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    border-top: 1px solid #1a4993;
    border-right: 1px solid #1a4993;
    transition: all 0.02s;
  }
  a.main.active::before {
    content: "";
    display: block;
    position: absolute;
    left: 4px;
    background: ${(props) => props.theme.theme};
    width: 4px;
    height: 24px;
    border-radius: 999px;
    transition: all 0.02s;
  }
  .down a.main.active:first-child,
  .down a.main:hover:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  .down a.main.active:last-child,
  .down a.main:hover:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  a.main svg,
  .open svg {
    transition: all 0.02s;
    margin-left: 14px;
    transition: all 0.2s ease-in;
    color: #6d7f9e;
  }
  a.main.active svg,
  a.main:hover svg {
    transform: scale(1.1);
    color: ${(props) => props.theme.theme};
  }
  @media (max-width: 768px) {
    border-top: 1px solid ${appTheme.stroke.soft};
    position: fixed;
    bottom: 0;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(14px);
    left: 0;
    right: 0;
    height: 64px;
    display: flex;
    flex-direction: row;
    padding: 4px 6px;
    overflow: auto;
    box-shadow: 0 -12px 30px rgba(15, 23, 42, 0.08);
    gap: 0;
    .menu-section {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 4px;
      flex-shrink: 0;
    }
    .menu-section + .menu-section {
      margin-top: 0;
      padding-top: 0;
      padding-left: 8px;
      border-top: 0;
      position: relative;
    }
    .menu-section + .menu-section::before {
      content: "";
      display: block;
      width: 1px;
      align-self: stretch;
      background: #dfe7f2;
      border-radius: 999px;
    }
    .menu-item {
      padding: 0;
      margin: 0;
      height: 56px;
      width: auto;
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
    a.main svg,
    .open svg {
      transition: all 0.02s;
      margin-right: 0px;
      width: 30px;
      margin-left: inherit;
    }
    a.main,
    .open {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      padding: 0 4px;
      width: 70px;
      overflow: hidden;
      height: 100%;
      border-radius: 14px;
      svg {
      }
      span {
        padding: 0;
        overflow: hidden;
        font-size: 10px;
        white-space: nowrap;
        text-align: center;
        max-width: 95%;
        text-overflow: ellipsis;
      }
    }
    a.main.active:after {
      content: "";
      display: none;
    }
    a.main.active::before {
      content: "";
      display: block;
      position: absolute;
      left: 10px;
      top: 4px;
      right: 10px;
      background: ${(props) => props.theme.theme};
      width: auto;
      height: 3px;
      border-radius: 999px;
      transition: all 0.02s;
    }
  }
`;
export const SubMenuHead = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px 2px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7b879c;
  @media (max-width: 768px) {
    min-height: 34px;
    padding: 0 10px;
    border-radius: 999px;
    background: #f2f6fb;
    color: #5f6d83;
    font-size: 10px;
    letter-spacing: 0.06em;
    white-space: nowrap;
  }
`;
export const SubMenuOpen = styled.nav`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
  width: calc(20em - 90px);
  border-right: 1px solid #e6ebf3;
  background: linear-gradient(180deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.92) 100%);
  height: 100%;
  padding: 14px 12px;
  padding-top: 28px;
  gap: 6px;
  .submenu-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .submenu-section + .submenu-section {
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid #eef2f8;
  }
  a {
    padding: 11px 12px;
    text-decoration: none;
    display: flex;
    gap: 10px;
    text-decoration: none;
    display: flex;
    justify-content: left;
    align-items: center;
    transition: all 0.02s;
    position: relative;
    border-radius: 14px;
    color: #627798;
    font-size: 14px;
  }
  a:hover,
  a.active {
    background: linear-gradient(135deg, #eef4ff 0%, #f8fbff 100%);
    box-shadow: inset 0 0 0 1px #dbe6f7;
    svg {
      color: ${(props) => props.theme.theme};
      font-weight: bold;
    }
    span {
      padding-right: 15px;
      color: #142749;
    }
  }
  a.active:after {
    content: "";
    display: block;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
    transition: all 0.02s;
    @media (max-width: 768px) {
      height: 1px;
      width: 100%;
      bottom: 0;
      top: auto;
      background-color: ${appTheme.stroke.strong};
      border-radius: 0;
      right: 0;
      left: 0;
    }
  }
  a.active::before {
    content: "";
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    border-top: 2px solid #1a4993;
    border-right: 2px solid #1a4993;
    z-index: 1;
    transition: all 0.02s;
  }
  @media (max-width: 768px) {
    z-index: 100;
    left: 0;
    right: 0;
    top: 60px;
    width: 100%;
    position: fixed;
    background: white;
    display: flex;
    flex-direction: initial;
    border-bottom: 1px solid rgb(226, 228, 233);
    padding: 0;
    box-shadow: none;
    width: 100%;
    overflow: auto;
    gap: 15px;
    height: 45px;
    padding-right: 0px;
    padding-left: 15px;
    .submenu-section {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      gap: 10px;
      flex-shrink: 0;
    }
    .submenu-section + .submenu-section {
      margin-top: 0;
      padding-top: 0;
      padding-left: 10px;
      border-top: 0;
      position: relative;
    }
    .submenu-section + .submenu-section::before {
      content: "";
      display: block;
      width: 1px;
      align-self: stretch;
      background: #dfe7f2;
      border-radius: 999px;
    }
    :before {
      content: "";
      display: block;
      border-radius: 3px;
      background: #dbdbdb;
      transition: all 0.02;
      height: 1px;
      margin-left: 0;
      position: absolute;
      margin-top: 1px;
      left: 10px;
      right: 10px;
      display: none;
    }
    a {
      width: auto;
      white-space: nowrap;
      padding: 5px 0.5em;
      color: #9797bc;
      height: 43px;
    }
    a span {
      padding-right: 5px !important;
      color: black;
    }

    a:hover,
    a.active {
      color: ${(props) => props.theme.theme};
      /* font-weight: bold; */
      opacity: 1;
      background: transparent;
      box-shadow: none;
    }
    a.active::before {
      display: none;
    }
  }
`;
export const SubMenu = styled.nav`
  margin-left: 1em;
  margin-right: 1em;
  padding-left: 0em;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  background: #fff;
  &.close {
    display: none;
  }
  a {
    border-bottom: 1px solid #eef2f8;
  }
  a:last-child {
    border-bottom: 0;
  }
`;
export const MenuGroup = styled.div`
  cursor: pointer;
  transition: all 0.02s;
  svg:last-child {
    margin-left: auto;
  }
  &.active svg:last-child {
    transform: rotate(180deg) scale(1.1);
    font-weight: bold;
    opacity: 1;
  }
`;
export const MobileSubMenu = styled.div`
  z-index: 100;
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  width: 100%;
  background: white;

  flex-direction: initial;
  padding: 0px;
  overflow: auto;
  flex-direction: column;
  /* box-shadow: 0px 2px 7px 0 rgba(0, 0, 0, 0.07); */
  border-right: 1px solid #e2e4e9;
  display: none;
  @media (max-width: 768px) {
    display: flex;
    border: 0px solid #e2e4e9;
    border-bottom: 1px solid ${appTheme.stroke.soft};
  }
`;
