import styled from "styled-components";
import { appTheme } from "../../project/brand/project";
export const Table = styled.div`
  border-collapse: collapse;
  display: flex;
  flex-direction: column;
  row-gap: 0px;
  margin-top: 0;
  border-top: 0px solid #d9d9d9;
  width: 100%;
  width: -webkit-fill-available;
  padding: 0;
  gap: 14px;
  &.record {
    border-top: 0px solid #d9d9d9;
    padding: 0px 0px;
  }
  &.files {
    padding: 10px 4px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 20px;
  }
  &.gallery {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(152px, 1fr));
    gap: 20px;
  }
  &.norecord {
    padding: 5px 0px;
  }
  &.double {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 0px solid #d9d9d9;
    column-gap: 20px;
    row-gap: 20px;
  }
  &.triple {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    border-bottom: 0px solid #d9d9d9;
    column-gap: 20px;
    row-gap: 20px;
    > div {
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      > div:nth-child(1) {
        background-color: transparent;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
    .profile-image {
      background-color: transparent;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .profile-image img {
      max-width: 70%;
      object-fit: contain;
      object-position: left;
      width: min-content;
      border-radius: 12px;
    }
    .dotmenu {
      position: absolute;
      top: 0px;
      right: 10px;
      height: max-content;
      display: flex;
      flex: revert;
    }
  }
  &.no-data {
    grid-template-columns: auto;
  }
  @media (max-width: 768px) {
    &.double {
      grid-template-columns: auto;
    }
    &.triple {
      grid-template-columns: auto;
      > div {
        > div {
          > img {
          }
          > div:nth-child(1) {
            > div:nth-child(2) {
            }
          }
          > div:nth-child(2) {
            flex-direction: row;
            > div {
              > span::after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  &.auto {
    width: auto;
  }
`;
export const ProfileImage = styled.div`
  min-width: 50px;
  max-width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 12px;
  background: #ececec;
  font-size: 10px;
  margin-right: 10px;
  transition: all 0.1s ease-in 0s;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &.full {
    min-width: 48px;
    min-height: 48px;
    max-width: max-content;
    width: max-content;
    max-height: 48px;
    padding: 0px 10px;
    background-color: transparent;
    border: 1px solid ${appTheme.stroke.soft};
    img {
      object-fit: contain;
      object-position: center;
    }
    @media (max-width: 768px) {
      max-width: 200px;
      width: min-content;
      max-width: 48px;
      max-height: 48px;
      border: 1px solid ${appTheme.stroke.soft};
      img {
        object-fit: contain;
        object-position: center;
      }
    }
  }
  :hover {
    /* height: 62px; */
  }
`;
export const Th = styled.th`
  text-align: left;
  padding: 15px 8px 10px;
  background-color: #ddedeb;
  white-space: nowrap;
  color: #444;
  font-weight: bolder;
  border-radius: 0px;
  :first-child {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  :last-child {
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  &.actions > div {
    gap: 10px;
    display: flex;
    justify-content: right;
    gap: 10px;
    padding-right: 20px;
  }
`;

export const Tr = styled.div`
  box-sizing: border-box;

  /* Auto layout */
  display: flex;
  flex-direction: column;
  /* align-items: flex-start; */
  padding: 16px;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e4e9;
  /* regular-shadow/x-small */
  box-shadow: 0px 1px 2px rgba(228, 229, 231, 0.24);
  border-radius: 12px;

  cursor: pointer;
  && {
    /* .popup-child & {
      box-shadow: rgb(167 167 167 / 26%) 0px 0px 12px 0px;
    } */
  }
  && {
    .show-filter & {
      /* margin: 0em 2em 0 10px; */
    }
  }
  &:hover h4 {
    color: ${(props) => props.theme.themeForegound};
  }
  /* padding: 5px 26px; */
  padding-bottom: 12px;
  &:first-child {
    /* border-top: 1px solid ${(props) => props.theme.border};
    border-top-right-radius: 0px;
    border-top-left-radius: 0px; */
  }
  &:last-child {
    /* border-bottom: 1px solid ${(props) => props.theme.border};
    border-bottom-right-radius: 12px;
    border-bottom-left-radius: 12px; */
  }
  .double.table & {
    border-radius: 0px;
    &:first-child {
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
    }
    &:nth-child(2) {
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    &:nth-child(odd) {
      border-right: 0px solid ${(props) => props.theme.border};
      margin-right: 0;
    }
    &:nth-child(even) {
      margin-left: 0;
    }
    &:last-child {
      border-bottom: 0;
    }

    &:nth-last-child(2):nth-child(odd) {
      /* Apply styles to second-to-last child in last row (odd index) */
      border-bottom: 0;
      border-bottom-left-radius: 12px;

      /* Add any additional styles here */
    }
    &:nth-last-child(1):nth-child(even) {
      border-bottom-right-radius: 12px;
    }
    &:nth-last-child(2):nth-child(even) {
      border-bottom-right-radius: 12px;
    }
    &:nth-last-child(1):nth-child(odd) {
      border-bottom-left-radius: 12px;
    }
    &:last-child {
      border-bottom-right-radius: 12px;
    }
  }
  /* &:hover {
    transform: scale(1.005);
    transition: all 0.4s;
    border-radius:12px !important;
    z-index: 1000;
  } */
  &.bulk {
    flex-flow: wrap;
    gap: 10px;
  }
  @media screen and (max-width: 768px) {
    padding: 1em 1em 0.5em;
    margin: 0em 0em 0px;

    .double.table & {
      border-radius: 0;
      &:nth-last-child(2):nth-child(odd) {
        /* Apply styles to second-to-last child in last row (odd index) */
        border-bottom: 1px solid ${(props) => props.theme.border};
        border-bottom-left-radius: 0px;

        /* Add any additional styles here */
      }
      &:nth-child(2) {
        border-top-right-radius: 0px;
      }
      &:nth-last-child(1):nth-child(even) {
        border-bottom-right-radius: 0px;
      }
      &:nth-last-child(2):nth-child(even) {
        border-bottom-right-radius: 0px;
      }
      &:nth-last-child(1):nth-child(odd) {
        border-bottom-left-radius: 0px;
      }
      &:nth-child(odd) {
        border-right: 0px solid ${(props) => props.theme.border};
        margin: 0em 1em 0px !important;
      }
      &:nth-child(even) {
        margin: 0em 1em 0px !important;
      }
      &:first-child {
        border-top: 0px solid ${(props) => props.theme.border};
        border-top-right-radius: 12px;
        border-top-left-radius: 12px;
      }
      &:last-child {
        border-bottom: 0px solid ${(props) => props.theme.border};
        border-bottom-right-radius: 12px;
        border-bottom-left-radius: 12px;
      }
    }
  }
  /* box-shadow: rgb(167 167 167 / 26%) 0px 0px 12px 0px; */
  &:hover {
    /* background-color: #ddedeb; */
    box-shadow: 0px 4px 12px 0px rgba(${(props) => props.theme.theme}, 1);

    /* border: 1px solid ${(props) => props.theme.border}; */
  }
  &.single {
    padding: 0;
    margin: 0;
    margin: 0px 2px 30px;
    box-shadow: none; //rgba(0, 0, 0, 0.1) 0px 0px 8px 2px !important;
    margin-bottom: 20px;
    border: 0;
    @media (max-width: 768px) {
      margin: 5px 10px 9px 20px !important;
    }
    && {
      .popup-data & {
        margin: 0;
        margin-bottom: 20px;
      }
    }
  }
  &.single:hover {
    /* background-color: initial; */
    box-shadow: none;
    h4 {
      color: initial;
    }
  }
`;
export const Td = styled.div`
  text-align: left;
  padding: 5px 5px 0;
  position: relative;
  font-size: 14px;
  &.disabled {
    display: none;
  }
  &.custom {
    padding: 0px 5px 5px;
  }
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
    /* margin-left: auto; */
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &.actions > div {
    display: flex;
    justify-content: right;
    overflow-wrap: normal;
    margin-left: 0;
    margin-right: 5px;
    padding: 0;
    display: flex;
    justify-content: right;
    overflow-wrap: normal;
    margin-left: auto;
    margin-right: 0px;
    padding: 0px 0px 0px 0px;
    position: sticky;
    right: 0;
    bottom: 0;
    gap: 10px;
    background: #ffffffe0;
    align-items: center;
  }
  &.right {
    text-align: right;
  }
  :last-child span:last-child::after {
    display: none;
  }
  &.bulk {
    min-width: 24%;
    max-width: 24%;
  }
  && {
    .triple && {
      display: flex;
      flex-direction: column;
      gap: 0px;
      justify-content: start;
      margin-left: 0;
      margin-right: auto;
      text-align: left;
      align-items: start;
      gap: 5px;
      span {
        padding: 0px 0px 0px 0px;
      }
    }
  }
`;

export const TrBody = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 10px;
  &.small {
    font-size: 13px;
  }
  &.single {
    margin: 0px 0px 5px;
    padding: 10px 0;
    border-bottom: 1px solid lightgrey;
  }
  &.actions {
    display: flex;
    justify-content: right;
    margin: 5px;
  }
  && {
    .triple && {
      display: flex;
      flex-direction: column;
      gap: 0px;
    }
  }
  @media (max-width: 768px) {
    &.nowrap {
      flex-flow: initial;
      margin-bottom: 5px;
    }
    &.actions {
      display: flex;
      justify-content: left;
      margin-top: 5px;
    }
  }
`;
export const Title = styled.span`
  margin-right: 5px;
  margin-bottom: 5px;
  color: #838894;
  font-size: 13px;
  &:after {
    content: " :";
  }
`;
export const Head = styled.h4`
  font-weight: bold;
  width: "100%";
  display: flex;
  align-items: start;
  margin: 0;
  padding: 0;

  &.single span,
  &.single {
    font-size: 16px;
    color: ${(props) => props.theme.theme};
    svg {
      color: ${(props) => props.theme.theme};
    }
  }
  span {
    font-size: 15px;
    /* font-weight: 700; */
    line-height: 24px;
    letter-spacing: -0.015em;
    text-align: left;
  }
  cursor: pointer;
  svg {
    margin-right: 10px;
    min-width: 14px;
    min-height: 14px;
    max-width: 14px;
    max-height: 14px;
    margin-top: 4px;
  }
`;
export const DataItem = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  font-size: 10px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  &.highlight {
    padding: 4px 12px 4px 12px;
    gap: 0px;
    border-radius: 999px;
    border: 1px;
    background: #cbf5e5;
  }
  &.box {
    padding: 4px 12px 4px 12px;
    gap: 0px;
    border-radius: 999px;
    border: 1px solid #e2e4e9;
    background: transparent;
  }
  && {
    .triple && {
      padding: 4px 12px 4px 12px;
      gap: 0px;
      border-radius: 999px;
      border: 0px solid #e2e4e9;
      background: transparent;
    }
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left;
  }
  p {
    text-align: center;
    white-space: pre-line;
    display: contents;
  }
  /* &:after {
    content: " |";
    margin-left: 5px;
    color: #bcbcbc;
  } */
  svg {
    margin-right: 5px;
  }
`;
export const Button = styled.button`
  color: ${(props) => props.theme.pageForeground};
  border: none;
  padding: 6px 12px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  &.add {
    background-color: #4caf50;
  }
  &.menu {
    /* padding: 10px; */
    margin-right: 0;
    text-align: left;
  }
  &.menu:last-child {
    margin-bottom: 0px;
  }
  &.edit {
    background-color: ${(props) => props.theme.pageBackground};
  }
  &.delete {
    background-color: red;
    color: white;
  }
  &:hover {
    transform: scale(1.01);
    transition: 0.2s ease-in-out;
  }
  svg {
    fill: white;
    margin-right: 5px;
    height: 0.9em;
  }
  &.button {
    background: #ffffff;
    border: 1px solid #e2e4e9;
    /* button-shadow/stroke/important */
    box-shadow: 0px 1px 2px rgba(82, 88, 102, 0.06);
    border-radius: 8px;
  }
  @media (max-width: 768px) {
    svg {
      margin-left: 0px;
    }
  }
`;
export const Count = styled.div`
  padding: 1em 0em;
  @media screen and (max-width: 768px) {
    padding: 1em 1em 0.5em;
  }
  text-align: right;
  justify-content: flex-end;
  display: flex;
  text-wrap: nowrap;
  align-items: center;
  position: sticky;
  bottom: 0;
  background: white;
  z-index: 1001;
`;
export const ArrowButton = styled.button`
  border: 0;
  border: 1px solid #e2e4e9;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  text-wrap: nowrap;
  position: relative;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  transition: all 1s ease 0s;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  padding: 0 15px;
  min-height: 40px;
  height: 40px;
  width: 50px;
  border-radius: 10px;
  margin: 4px 0px;
  background-color: ${(props) => props.theme.pageBackground};
  &:hover {
    color: ${(props) => props.theme.bgPrimary};
  }
`;
export const ArrowPagination = styled.button`
  border: 0;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  text-wrap: nowrap;
  position: relative;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  &.button {
    border-left: 1px solid lightgray;
    border-radius: 0;
    padding: 0px 10px;
    background-color: #ffffff00;
  }
  &.button:last-child {
    margin-left: 10px;
  }
  svg {
    margin-left: 5px;
  }
  &:hover {
    color: ${(props) => props.theme.bgPrimary};
  }
`;
export const ButtonPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0em;
  z-index: 100;
  /* height: 50px; */
  position: sticky;
  top: 0;
  background-color: white;
  padding: ${(props) => (props.scrolled ? "16px 24px" : "0px")};
  border-bottom: ${(props) => (props.scrolled ? "1px solid #E2E8F0" : "none")};
  box-shadow: ${(props) => (props.scrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none")};
  transform: ${(props) => (props.scrolled ? "translateY(0)" : "translateY(-1px)")};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  flex-wrap: wrap;
  gap: 10px;
  &.scrolled {
    margin: 0 -30px;
    padding: 10px 30px;
    border-bottom: 1px solid #e2e8f0;
    /* box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px; */
  }
  &.toolbar-theme-district {
    margin: 0;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #e6ebf3;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
    transform: none;
    border-bottom: 1px solid #e6ebf3;

    .left,
    .right {
      align-items: center;
    }

    input,
    select {
      border-radius: 12px;
      border: 1px solid #d9e2ef;
      background: #f9fbff;
    }
  }
  &.toolbar-theme-district.scrolled {
    margin: 0;
    padding: 14px 16px;
    border-bottom: 1px solid #e6ebf3;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  }
  svg {
    background-color: transparent;
  }
  && {
    .popup-data && {
      &.subList,
      &.table,
      &.files,
      &.gallery,
      &.list {
        top: -25px;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 0;
    /* margin-top: 60px; */
    && {
      .popup-data & {
        margin-top: 10px;
      }
    }
    &.scrolled {
      margin: 0 0px;
      padding: 10px 0px;
      border-bottom: 1px solid #e2e8f0;
      /* box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px; */
    }
  }
`;
export const AddButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background: ${appTheme.primary.base};
  color: ${appTheme.text.white};
  outline: 0px;
  border: 0px solid rgb(221, 221, 221);
  margin: 0px;
  cursor: pointer;
  letter-spacing: inherit;
  padding: 12px;
  font-size: 14px;
  margin-right: 0em;
  outline: none;
  height: 32px;
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px 2px; */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 5px;
  span {
    max-width: 200px;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 16px;
    white-space: nowrap;
  }
  &.skip {
    border: 0px solid #8b8989;
    padding: 5px 20px;
    height: 35px;
    justify-content: center;
    align-items: center;
    display: flex;
    background-color: ${(props) => props.theme.pageBackground};
  }
  &.small {
    padding: 10px;
    gap: 8px;
    border-radius: 8px;
    display: flex;
  }
  &.skip svg {
    margin: 0px;
  }
  &.add {
  }
  && {
    /* .popup-child & {
      color: ${(props) => props.theme.secForeground};
      background: ${(props) => props.theme.secBackground};
    } */
  }
  &:hover {
    color: ${(props) => props.theme.themeForeground};
    background-color: ${(props) => props.theme.theme};
  }
  .toolbar-theme-district & {
    border-radius: 12px;
    min-height: 42px;
    height: 42px;
    padding: 0 14px;
    box-shadow: none;
  }
  & > svg {
    /* margin-right: 10px; */
  }
  @media (max-width: 768px) {
    margin-right: 0px;
    justify-content: center;
    align-items: center;
    span {
      display: none;
    }
    & > svg {
      margin-right: 0px;
    }
  }
`;
export const FilterBox = styled.div`
  flex-direction: row;
  display: flex;
  gap: 10px;
  &.menu {
    width: 100%;
    position: sticky;
    top: 0px;
    background: white;
    flex-wrap: wrap;
    column-gap: 0;
    margin: 0;
    padding: 0 0 10px;
  }
  &.gap {
    gap: 10px;
  }
  .filter {
    margin-right: 0;
  }
`;
export const Filter = styled.button`
  background: transparent;
  font-size: initial;
  outline: none;
  border: 1px solid #e2e4e9;
  cursor: pointer;
  min-width: 32px;
  height: 32px;
  padding: 6px;
  gap: 6px;
  border-radius: 8px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.foreground};
  cursor: pointer;
  transition: 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 15px;
    height: 15px;
  }
  &.single {
    padding: 0 0.5em;
    margin-top: 0;
    height: auto;
  }
  &.custom {
    margin: 0;
  }
  &.auto {
    margin: auto;
  }
  &.error {
    color: ${appTheme.state.error};
    border-color: transparent;
  }
  :hover {
    color: black;
  }
  &.desc svg {
    color: red;
  }
  &.asc svg {
    color: green;
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
  &.small {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 4px;
    svg {
      font-size: 15px;
    }
  }
  &.plain {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border-radius: 4px;
    border: none;
    background: transparent;
    pointer-events: all;
    svg {
      font-size: 15px;
    }
  }
  &.inner-long {
    width: auto;
    text-wrap: nowrap;
    margin-left: 0;
    display: flex;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    gap: 10px;
    height: auto;
    margin: 0;
    width: auto;
    padding: 7px 15px;
    font-size: 12px;
    margin-right: 0;
    margin-left: auto;
  }
  &:hover {
    color: ${(props) => props.theme.theme};
    svg {
      transition: 0.2s ease-in-out;
      transform: scale(1.1);
    }
  }
  &.active {
    color: ${(props) => props.theme.theme};
    svg {
      transition: 0.2s ease-in-out;
      transform: scale(1.1);
    }
  }
  &.error:hover {
    color: ${appTheme.state.error};
    border-color: transparent;
  }
  &.open {
    color: green;
  }
  &.imageedit {
    background-color: transparent;
    width: 21px;
    height: 21px;
    max-width: 21px;
    max-height: 21px;
    min-width: 21px;
    min-height: 21px;
    background: var(--state-information, #375dfb);
    color: white;
    border-radius: 50%;
    border: 3px solid;
    top: 10px;
    right:  10px;
    svg {
      font-size: 12px;
      z-index: 10;
      top: 0;
      margin-top: 3px;
      position: inherit;
      width: 9px;
      height: 9px;
    }
  }
  &.normal {
    height: 40px;
    width: 40px;
  }
  &.filter-button {
    flex: none;
  }
  .toolbar-theme-district & {
    border-radius: 12px;
    min-height: 42px;
    height: 42px;
    border-color: #d9e2ef;
    background: #f9fbff;
  }
  .toolbar-theme-district &:hover,
  .toolbar-theme-district &.active {
    background: #eef4ff;
  }
  && {
    /* .popup-child & {
      color: ${(props) => props.theme.secForeground};
      background: ${(props) => props.theme.secBackground};
    } */
  }
`;
export const Filters = styled.div`
  /* display: flex;
  margin: 0;
  flex-flow: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 10px; */
  display: none;
  /* margin-left: auto; */
  &.center {
    margin-left: auto;
  }

  &.show-filter {
    display: flex;
    border-right: 0px solid lightgrey;
    padding: 0px 10px 0px 0px;
    margin: 0 0;
    border-radius: 0px;
    max-width: 100%;
    width: auto;
    top: 0px;
    gap: 10px;
    align-self: baseline;
    /* position: sticky; */
    top: 65px;
  }
  &.toolbar-theme-district.show-filter {
    padding: 0;
    margin: 0;
    border-right: 0;
  }

  @media (max-width: 768px) {
    flex-flow: wrap;
    max-width: 100%;
    margin-bottom: 10px;
    && {
      .show-filter & {
        position: absolute;
        background-color: lightgray;
        z-index: 1001;
        margin: auto 0;
        width: 200px;
        margin: 0px 1em;
        padding: 10px;
        border-radius: 10px;
        top: auto;
      }
    }
  }
`;
export const ToggleContainer = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  width: 50px;
  height: 30px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  span {
    box-shadow: 0 0 1px #2196f3;
  }
`;
export const NoData = styled.div`
  margin: 10px;
  width: -webkit-fill-available;
  /* border: 1px solid #ddedeb; */
  justify-content: center;
  display: flex;
  align-items: center;
  height: 100px;
  flex-direction: column;
  /* border: 1px solid #e2e4e9; */
  &.small {
    height: auto;
  }
  &.noborder {
    border: 0;
    height: auto;
  }
  &.noshadow {
    box-shadow: none;
  }
  &.margin {
    margin: 30px 30px 0;
    border-radius: 10px;
  }
  &.white-list {
    margin: 0em 2px 0px;
    border-radius: 10px;
  }
  &.empty-theme-district {
    margin: 0;
    border-radius: 18px;
    border: 1px dashed #d4ddeb;
    background: #fff;
  }
  &.card {
    height: auto;
    border: 1px solid rgb(226, 228, 233);
    border-radius: 12px;
    margin: 0;
    text-align: left;
    justify-content: left;
    padding: 10px;
    font-size: 12px;
    display: flex;
    flex-direction: row;
  }
  @media screen and (max-width: 768px) {
    &.white-list {
      margin: 0em 1em 0px;
      border-radius: 10px;
    }
  }
  &.white {
    border-radius: 10px;
    padding: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: inherit;
    gap: 10px;
    margin: 5px 0;
  }
  svg {
    margin: auto;
    font-size: 30px;
  }
  button {
    padding: 10px;
    font-size: 12px;
  }
  button svg {
    font-size: 15px;
  }
`;
export const Img = styled.img`
  height: 50px;
  object-fit: cover;
  width: 100px;
  &.contain {
    object-fit: contain;
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
    background-color: red;
  }

  ${ToggleInput}:checked + &::before {
    transform: translateX(18px);
    background-color: green;
  }
`;
export const More = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Default three-dot icon styling */
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  margin: 0;
  padding: 0;

  svg {
    width: 18px;
    height: 18px;
    color: #64748b;
    transition: all 0.2s ease;
    margin: 0;
  }

  &:hover {
    background: #f8fafc;
    svg {
      color: ${(props) => props.theme.theme || "#0f172a"};
    }
  }

  &.active {
    background: #f1f5f9;
    svg {
      color: ${(props) => props.theme.theme || "#0f172a"};
    }
  }

  /* Callback button styling */
  &.callBack {
    width: auto;
    min-height: 32px;
    padding: 5px 12px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #475569;

    svg {
      width: 14px;
      height: 14px;
      color: #475569;
    }

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      color: ${(props) => props.theme.theme || "#1e293b"};

      svg {
        color: ${(props) => props.theme.theme || "#1e293b"};
      }
    }

    &.active {
      background: #f1f5f9;
      border-color: ${(props) => props.theme.theme || "#cbd5e1"};
      color: ${(props) => props.theme.theme || "#1e293b"};

      svg {
        color: ${(props) => props.theme.theme || "#1e293b"};
      }
    }
  }

  @media screen and (max-width: 768px) {
    &.callBack {
      padding: 0 10px;
      font-size: 12px;

      span {
        display: inline-block; // Keep text visible on mobile
      }
    }
  }
`;
export const Actions = styled.div`
  display: flex;
  margin-left: auto;
  flex-direction: column;
  border-radius: 10px;
  div {
    margin: 0px 0px 5px 0;
    margin-right: 10px;
    text-decoration: none;
    cursor: pointer;
    opacity: 0.5;
  }

  div:last-child {
    margin-right: 0px;
  }
  div.active {
    margin-right: 10px;
    text-decoration: none;
    cursor: pointer;
    opacity: 1;
  }
  @media screen and (max-width: 768px) {
    div {
      color: black;
    }
    div.active {
      color: #198ad6;
    }
  }
`;

export const ToolTipContainer = styled.div`
  display: flex;
`;
export const IconBox = styled.span`
  padding-top: 5px;
  &.display {
    padding-top: 0px;
    border: 1px solid;
    display: flex;
    height: 15px;
    width: 15px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
  }
`;
export const TableContaner = styled.div`
  margin: 0%;
  padding: 0em 0em 0em;
  background-color: white;
  border-radius: 10px;
  width: -webkit-fill-available;
  background: white;
  && {
    .show-filter & {
      margin: 0em 2em 0 10px;
    }
  }
  &.table-theme-district {
    margin: 0;
    padding: 0;
    overflow: auto;
    border-radius: 0;
    background: transparent;
  }
  @media screen and (max-width: 768px) {
    margin: 0 0em 1em 0px;
    /* height: calc(100vh - 180px); */
  }
`;

export const TableView = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 0 auto;
  margin-bottom: auto;
  thead > tr {
    /* background-color: white; */
    border: 0px;
    background-color: ${appTheme.bg.weak};
    z-index: 100;
    gap: 0px;
    border-radius: 8px;
    opacity: 0px;
  }
  th {
    background-color: ${appTheme.bg.weak};
    font-size: 14px;
    font-weight: 400;
    letter-spacing: -0.006em;
    text-align: left;
    padding: 8px 12px 8px 12px;
    border: 0px 1px 0px 0px;
  }
  &.small th {
    padding: 4px 10px;
    line-height: 14px;
  }
  tr:hover {
    color: ${(props) => props.theme.theme};
    /* border: 0; */
  }
  &.auto {
    width: auto;
  }
  &&.plain {
    tr {
      border: 1px solid;
    }
  }
  .table-theme-district & {
    min-width: 100%;
  }
`;
export const ThView = styled.th`
  text-align: left;
  padding: 20px 8px 15px;
  top: 0;
  z-index: 30;
  background: white;
  font-weight: bolder;
  border-radius: 0px;
  color: #626262;
  :first-child {
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }
  :last-child {
    border-top-right-radius: 12px;
    border-right: 0px solid rgb(238 238 238);
  }
  div {
    display: flex;
    gap: 10px;
    align-items: center;
    white-space: nowrap;
  }
  && {
    .plain & {
      background-color: transparent;
    }
  }
  &.true {
    position: sticky;
    left: 0px;
    z-index: 10;
  }
  &.bulk {
    max-width: 200px;
  }
  &.actions {
    display: flex;
    justify-content: right;
    padding-right: 20px;
  }
  .table-theme-district & {
    background: #f8faff;
    color: #607292;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding-top: 14px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e6ebf3;
  }
  @media screen and (max-width: 768px) {
    &.true {
      position: inherit;
      left: 0px;
      z-index: unset;
    }
  }
`;

export const TrView = styled.tr`
  border-bottom: 1px solid rgb(241 241 241);
  cursor: pointer;
  /* &:hover {
    background-color: #eaeaea;
    border-radius: 12px;
  } */

  &:last-child td:first-child {
    border-bottom-left-radius: 12px;
  }
  &:last-child td:last-child {
    border-bottom-right-radius: 12px;
  }
  &:last-child {
    border-bottom: 0;
  }
  &.bulk {
    max-width: 150px;
  }
  .table-theme-district &:hover {
    background: #fbfcff;
  }
`;
export const CoutSelector = styled.td`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10001;
  background: white;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 10px;
`;
export const TdView = styled.td`
  padding: 12px 10px 12px 10px;
  gap: 10px;
  opacity: 0px;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: -0.006em;
  text-align: left;
  color: ${appTheme.text.main};
  position: relative;
  &.true {
    position: sticky;
    left: 0px;
    background: white;
    z-index: 1;
  }
  @media screen and (max-width: 768px) {
    &.true {
      position: inherit;
      left: 0px;
      z-index: unset;
    }
  }
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
    justify-content: right;
    overflow-wrap: normal;
    position: sticky;
    right: 0px;
    background: white;
    border-left: 1px solid;
    /* box-shadow: 0px 2px 2px 0px #1b1c1d1f; */
    padding: 0;
    padding-left: 10px;
  }
  @media screen and (max-width: 768px) {
    &.actions {
      position: inherit;
      right: 0px;
      z-index: unset;
      overflow-wrap: break-word;
      flex-wrap: wrap;
    }
  }
  &.actions > div {
    display: flex;
    justify-content: right;
    overflow-wrap: normal;
    position: sticky;
    right: 0px;
    background: white;
    gap: 10px;
    .buttons {
      display: flex;
      flex-wrap: nowrap;
      /* max-width: 200px; */
      gap: 5px;
      align-self: center;
      /* margin: 5px; */
    }
  }
  .table-theme-district & {
    background: transparent;
    border-bottom: 1px solid #eef2f8;
  }
  .table-theme-district &:last-child td {
    border-bottom: 0;
  }
  &.right {
    text-align: right;
  }
  &.bulk {
    padding: 4px 10px;
    line-height: 14px;
  }
  > span {
    margin-right: 10px;
  }
`;
export const DescRow = styled.div`
  display: flex;
  margin-top: 4px;
`;
export const ImageRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 0px 0;
  align-items: center;
  img {
    max-width: 40px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 4px;
    border-radius: 50%;
  }

  div {
    flex: 1;
    gap: 4px;
    display: flex;
    flex-direction: column;
    div:first-child {
      font-weight: 500;
      margin-bottom: 0px;
    }

    div:last-child {
      font-size: 0.9em;
      color: ${appTheme.text.sub};
    }
  }

  @media (max-width: 768px) {
    img {
      max-width: 80px;
    }
  }
`;
export const TrBodyView = styled.tbody``;
export const ListContainer = styled.div`
  display: flex;
  max-width: 100%;
  overflow: auto;
  &.initial {
    overflow: initial;
  }
  &.list-theme-district {
    padding: 0;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid #e6ebf3;
    background: #fff;
    box-shadow: 0 18px 45px rgba(11, 24, 52, 0.06);
  }
  /* display: flex;
  max-height: calc(100vh);
  min-height: calc(100vh - 330px); */
  /* && {
    .popup-child & {
      &.horizontal.medium {
        max-height: calc(45vh);
        min-height: calc(45vh);
      }
    }
  } */
  @media screen and (max-width: 768px) {
    min-height: auto;
  }
  /* overflow: auto; */
`;
export const ListContainerData = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100%;
`;

export const PageNumber = styled.button`
  padding: 10px 5px;
  background-color: white;
  font-weight: bold;
  border: none;
  font-size: 14px;
  margin-bottom: 0px;
  cursor: pointer;
  border-radius: 10px;
  min-width: 40px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px 2px;
  &.true {
    background-color: ${(props) => props.theme.theme};
    color: ${(props) => props.theme.themeForeground};
    font-weight: normal;
  }
`;
export const ListContainerBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

export const ScrollContainerLayout = styled.div`
  padding: 1em;
  margin: 0em 2em 0px;
  width: calc(100% - 2em);
  background-color: white;
  border-radius: 10px;
  padding-bottom: 0em;
`;
export const ScrollLayout = styled.div`
  display: flex;
  flex: 1 1 100%;
  max-width: 100%;
  width: calc(100% - 0em);
  padding-bottom: 1em;
  flex-direction: column;
  min-height: calc(100vh - 14em);
  max-height: calc(100vh - 14em);
  .sub-page & {
    position: inherit;
    height: auto;
    flex-direction: column;
    min-height: 250px;
    max-height: calc(100vh - 12em);
  }
  .popup-child & {
    position: inherit;
    height: auto;
    flex-direction: column;
    min-height: 250px;
    max-height: calc(100vh - 20em);
  }
  .profile & {
    position: inherit;
    height: auto;
    flex-direction: column;
    min-height: 250px;
    max-height: calc(100vh - 20em);
  }
  && {
    .tab & {
      min-height: calc(100vh - 20em);
      max-height: calc(100vh - 20em);
    }
  }
  @media screen and (max-width: 768px) {
    min-height: calc(100% - 12em);
    max-height: calc(100% - 12em);
    min-height: inherit;
    position: fixed;
    top: 120px;
    left: 20px;
    right: 20px;
    width: auto;
    overflow: auto;
    && {
      .tab & {
        position: absolute;
        margin-top: 20px;
        height: calc(100% - 190px);
      }
      .sub-page & {
        position: inherit;
        height: auto;
        flex-direction: column;
        min-height: auto;
        max-height: calc(100vh - 12em);
        left: 0;
        top: 0;
        margin-top: 50px;
      }
    }
  }
`;
export const FileButton = styled.input`
  background: ${appTheme.bg.soft};
  padding: 4px 5px;
  border-radius: 10px;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  padding: 10px;
  outline: none;
  border: 0px solid #ddd;
  cursor: pointer;
  outline: none;
  border: 0px solid #ddd;
  cursor: pointer;
  &.red {
    background-color: red;
    color: white;
  }
  &.green {
    background-color: green;
    color: white;
  }
  &:hover {
    color: ${(props) => props.theme.bgPrimary};
    transform: scale(1.03);
  }
  & > svg {
    margin-right: 10px;
  }
  &.more > svg {
    margin-right: 0px;
  }
  &.more {
    position: relative;
  }
  &.more:hover div {
    display: flex !important;
    position: absolute;
    right: 0;
    top: 0px;
    z-index: 2005;
    white-space: nowrap;
    background-color: #f3f8fb;
    border-radius: 10px;
  }
  @media (max-width: 768px) {
    justify-content: center;
    white-space: nowrap;
    span {
      display: none;
    }
    svg {
      margin-right: 5px;
    }
  }
`;
