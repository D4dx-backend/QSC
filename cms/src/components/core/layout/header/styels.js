import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";

export const Container = styled.div`
  padding: 20px 24px;
  height: 80px;
  display: flex;
  border-bottom: 1px solid rgb(226, 228, 233);
  @media (max-width: 768px) {
    height: 60px;
    border-bottom: 1px solid rgb(226, 228, 233);
    padding: 0px 1em;
    z-index: 101;
    position: fixed;
    &.profile-open {
      z-index: 1019;
    }
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
  }
`;
export const HeaderMenu = styled.div`
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  align-items: center;
  border: 1px solid rgb(217, 217, 217);
  flex-direction: column;
  border-radius: 18px;
  height: 35px;
  padding-left: 10px;
  padding: 4px 8px 4px 0px;
  gap: 6px;
  border-radius: 10px;
  border: 1;
  opacity: 0px;

  position: relative;
  cursor: pointer;
  flex-direction: row;
  i {
    margin-right: 5px;
    font-style: normal;
    color: #555555;
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    text-align: left;
    color: ${appTheme.text.main};
  }
  img {
    /* width: 100%;
    height: 100%;
    margin: 0px;
    object-fit: cover; */
    /* border-radius: 50%; */
  }
  > span {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    padding: 3px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  h6 {
    text-align: center;
    padding: 0;
    margin: 0;
    margin-bottom: 10px;
    font-size: 15px;
  }
  > .ProfileBar {
    position: absolute;
    right: 0;
  }
  @media (max-width: 768px) {
    padding: 10px 10px 10px 0px;
    &.vertical {
      flex-direction: column;
    }
  }
`;
export const Logo = styled.img`
  height: 36px;
  max-width: 90%;
  object-fit: contain;
  width: fit-content;
  padding-left: 0em;
  padding-top: 0em;
  margin-bottom: 0px;
  transition: all 0.2s ease 0s;
  @media screen and (max-width: 768px) {
    padding-left: 0;
    padding-top: 0;
    margin-bottom: 0;
  }
`;
export const LogoContaner = styled.div`
  display: flex;
  flex: 1 1 15em;
  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 10px;
  @media screen and (max-width: 768px) {
    justify-content: right;
    padding-right: 15px;
    justify-content: space-between;
  }
`;
export const Status = styled.div`
  flex: 1 1 calc(100% - 15em);
  display: flex;
  justify-content: left;
  align-items: center;
  padding-right: 0px;
  @media screen and (max-width: 768px) {
    flex: 1 1 calc(100%);
    justify-content: space-between;
    &.hm {
      display: none;
    }
  }
`;
export const MNav = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0px;
  margin-right: 10px;
  &.navicon {
    display: none;
  }
  @media screen and (max-width: 768px) {
    margin-right: 10px;
    &.navicon {
      display: flex;
      margin-right: 0;
      padding-left: 5px;
    }
    display: flex;
    padding-left: 15px;
    font-size: 25px;

    &.navicon::after {
      content: "";
      width: 1px;
      height: 20px;
      margin-right: 0px;
      margin-left: 13px;
      background: lightgrey;
    }
  }
`;
export const Title = styled.div`
  margin-right: auto;
  font-weight: bold;
  svg {
    margin-right: 10px;
  }
  @media screen and (max-width: 768px) {
    justify-content: space-between;
    img {
      object-position: left;
      height: 25px;
    }
  }
`;
export const User = styled.div`
  margin-right: 1em;
`;
export const Logout = styled.div`
  color: black;
  cursor: pointer;
  display: flex;
  padding: 10px;
  font-size: 12px;
  justify-content: center;
  align-items: center;
  background: rgb(228, 228, 228);
  border-radius: 12px;
  a {
    text-decoration: none;
    color: black;
  }
  svg {
    margin-right: 10px;
  }
  &:hover {
    background-color: ${(props) => props.theme.theme};
    color: white;
  }
  @media screen and (max-width: 768px) {
    border-radius: 4px;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    height: 25px;
    cursor: pointer;
    text-transform: uppercase;
  }
`;

export const MNavClose = styled.div`
  margin-right: 2px;
  margin-top: 5px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  display: none;
  color: black;
  a {
    text-decoration: none;
  }
  svg {
    margin-right: 10px;
  }
  @media screen and (max-width: 768px) {
    margin-left: auto;
    display: flex;
    border: 1px solid;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 25px;
    width: 25px;
    cursor: pointer;
    text-transform: uppercase;
    svg {
      margin: auto;
    }
  }
`;
