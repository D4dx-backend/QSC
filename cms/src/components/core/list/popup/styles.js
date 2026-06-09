import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";

export const CloseButton = styled.button`
  background: transparent;
  padding: 0 0.5em;
  font-size: initial;
  margin-right: 0.5em;
  outline: none;
  border: 0px solid #ddd;
  cursor: pointer;
  height: 30px;
  width: 30px;
  margin-right: 0px;
  padding: 6px;
  background: ${(props) => props.theme.secBackground};
  border-radius: 50%;
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.bgPrimary};
  }
`;

export const Logo = styled.img`
  margin-bottom: 0px;
  height: 80px;
  width: 80px;
  padding: 20px;
  object-fit: contain;
  object-position: center center;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  border-right: 1px solid rgb(226, 228, 233);
  @media screen and (max-width: 768px) {
    padding: 10px;
    margin-bottom: 0px;
    height: 60px;
    width: 64px;
    object-fit: contain;
    border-bottom: 1px solid rgb(226, 228, 233);
    border: 0;
    display: none;
  }
`;
export const Td = styled.div`
  text-align: left;
  margin: 0px;
  padding: 5px 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${appTheme.stroke.soft};
  gap: 10px;
  &.no,
  &.name {
    border: 1px solid gray;
  }
  &.has {
    border: 2px solid black;
    cursor: pointer;
  }
  &.no,
  &.has {
    text-align: center;
  }
  &.no svg {
    fill: grey;
  }
  &.name {
    text-overflow: "no-wrap";
  }
  &.actions {
    display: flex;
    justify-content: right;
    overflow-wrap: normal;
    margin-left: auto;
    margin-right: 5px;
    padding: 0;
  }
  &.textarea,
  &.htmleditor {
    flex-direction: column;
    justify-content: left;
    text-align: left;
    span {
      text-align: left;
    }
    p {
      text-align: left;
    }
  }
  &.right {
    text-align: right;
  }
  &:last-child {
    border-bottom: 0 !important;
  }
  &.span {
    grid-column: 1 / span 2;
    padding: 0px 0px;
    border-bottom: 0;
  }
  &.single {
    margin: 15px 20px 5px;
    padding: 10px 0;
    border-bottom: 1px solid lightgrey;
  }
  &.plain {
    padding: 2px 0px;
    margin: 0;
  }
  .double & {
    &:nth-child(odd) {
      /* border-right: 1px solid #ccc; */
    }
    &:last-child {
      border-bottom: 0 !important;
    }

    &:last-child,
    &:nth-last-child(2):nth-child(odd) {
      /* Apply styles to second-to-last child in last row (odd index) */
      border-bottom: 0 !important;
      /* Add any additional styles here */
    }
    &:first-child,
    &:nth-child(2) {
      /* border-top: 1px solid #d9d9d9; */
    }
  }
  @media (max-width: 768px) {
    margin: 5px 1px 5px 0px;
    &:nth-child(odd) {
      border-right: 0px solid #ccc !important;
    }
    &:last-child:nth-child(odd) {
      border-bottom: 0px solid #d9d9d9 !important;
    }
  }
`;

export const TrBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  &.double {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 20px;
  }
  @media (max-width: 768px) {
    &.double {
      display: flex;
    }
  }
`;
export const Title = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: left;
  display: flex;
  gap: 5px;
  align-items: center;
  color: ${appTheme.text.sub};
`;
export const Head = styled.span`
  font-weight: bold;
  width: "100%";
  display: flex;
  align-items: "center";
  padding: 5px 15px 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  span > svg {
    margin-right: 10px;
  }
  /* margin: 10px 20px 5px; */
  margin: 0px 0px 5px 0px;
  padding: 0px 0px 10px;
  border-bottom: 1px solid lightgrey;
  @media (max-width: 768px) {
    margin: 0px 0px 5px 0px;
  }
`;
export const DataHead = styled.span`
  margin: 10px 5px;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.theme};
  font-size: 18px;
`;
export const DataItem = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 16.94px;
  letter-spacing: -0.006em;
  text-align: right;
  img {
    width: auto;
    max-height: 90%;
  }
`;
export const DisplayInfo = styled.div`
  margin: 0px;
  &.horizontal {
    margin: 0 0px;
  }
`;
export const TabContainer = styled.div`
  border-radius: 12px;
  background-color: white;
  margin: 1.65em 1.5em 0px;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px 2px; */
  @media (max-width: 768px) {
    margin: 15px 15px 30px;
  }
  && {
    .vertical-menu & {
      margin: 0 0px 0px 0;
      max-height: calc(100vh - 115px);
      /* overflow: auto; */

      @media (max-width: 768px) {
        padding: 5px 15px 0px;
        margin-top: 5px;
      }
    }
  }
  .head {
    width: 100%;
    background-color: rgb(75, 75, 75);
    color: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
  &.page {
    justify-content: left;
    display: flex;
    flex-flow: wrap;
    gap: 5px;
    padding: 10px;
    background-color: transparent;
  }
`;
