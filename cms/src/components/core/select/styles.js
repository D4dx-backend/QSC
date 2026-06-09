import styled from "styled-components";
import { appTheme } from "../../project/brand/project";
export const Tabs = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  flex: 1 1 100%;
  padding: 4px;
  border-radius: 10px;
  background: ${appTheme.bg.weak};
  row-gap: 6px;
  .tab {
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    height: 25px;
    text-align: center;
    padding: 4px 6px;
    min-width: 6px;
    border-radius: 6px;
    border: 1px;
    min-width: 100px;
    color: ${appTheme.text.soft};
    cursor: pointer;
    &.active {
      color: ${appTheme.text.main};
      background: ${appTheme.bg.white};
    }
  }
`;
export const SelectBox = styled.div`
  position: relative;
  width: 100%;
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  /* max-width: 350px; */
  &.half {
    width: 40%;
  }
  &.small button {
    width: 80px;
    margin: 0;
  }
  grid-column: span 12; /* 50% width */
  &.double {
    grid-column: span 6; /* 50% width */
    width: auto;
  }
  &.quarter {
    grid-column: span 3; /* 25% width */
    width: auto;
  }
  &.third {
    grid-column: span 4; /* ~33% width - rounds to span 1.33 columns out of 4 */
  }
  &.half {
    grid-column: span 6; /* 50% width */
    width: auto;
  }

  &.large {
    grid-column: span 9; /* 75% width */
    width: auto;
  }
  &.full {
    grid-column: span 12; /* 100% width */
  }
  &.control {
    max-width: 90px;
    grid-column: span 3; /* 100% width */
    flex: auto;
    .options li {
      padding: 2px;
    }

    button {
      min-width: 90px !important;
      min-height: 25px !important;
      height: 25px;
      border-radius: 5px;
      font-size: 12px;
      svg {
        display: none;
      }
      > svg {
        display: block;
        margin-right: 0em;
      }
      span {
        max-width: 90px;
        white-space: normal;
      }
    }
    label .label {
      font-size: 11px;
    }
  }
  &.table {
    max-width: 150px;
    width: 150px;
  }
  .select {
    display: none;
  }
  &.list-box button {
    display: none;
  }
  &.list-box {
    max-height: none;
    height: auto;
  }
  &.auto {
    width: auto;
    min-width: 200px;
  }
  &.list-box .options {
    display: block;
    position: inherit;
    top: 0px;
    height: calc(100vh - 120px);
    max-height: inherit;
    padding-top: 0;
    margin-top: 0;
  }
  &.disabled {
    display: none;
  }
  &.half:nth-child(even) {
    /* width: calc(50% - 5px);
    margin-right: 5px; */
  }
  flex: calc(50% - 10px);

  && {
    /* Styles to apply when parent has class shrink */
    .nowrap & {
      margin-right: 10px;
      margin-left: 0;
    }
  }
  button {
    outline: none !important;
    width: 100%;
    -webkit-transition: all 0.2s ease-out 0s;
    transition: all 0.2s ease-out 0s;
    text-align: left;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 0px 0px 0;
    white-space: nowrap;
    /* overflow: hidden; */
    text-overflow: ellipsis;
    position: relative;
    box-sizing: border-box;
    padding: 10px 10px 10px 12px;
    outline: none !important;
    width: 100%;
    border-radius: 10px;
    border: 1px solid ${appTheme.stroke.soft};
    color: ${appTheme.text.soft};
    background: ${appTheme.bg.white};
    height: auto;
    min-height: 40px;
    max-height: 100px;
    font-weight: 400;
    transition: all 0.2s ease-out 0s;
    
    position: relative;
    font-size: 14px;
    span {
      white-space: wrap;
      max-width: calc(100% - 30px);
      text-overflow: ellipsis;
      overflow: hidden;
    }
    li span {
      white-space: wrap;
      max-width: calc(100% - 30px);
      text-overflow: ellipsis;
      overflow: hidden;
    }
    svg {
      margin-right: 0;
    }
  }
  &.filter > button > span {
    white-space: nowrap;
  }
  &.custom {
    /* max-width: 200px; */
    display: flex;
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
  &.custom button {
    min-height: 40px;
    min-width: 150px;
    font-weight: normal;
    background: ${(props) => props.theme.background};
  }
  &.filter button {
    min-height: 32px;
    height: 32px;
    margin: 0px 0;
    min-width: 150px;
    background: ${(props) => props.theme.background};
  }
  &.small button {
    height: 25px;
    min-height: 25px;
    margin: 4px 0px;
    min-width: 125px;
    padding: 5px 0 5px 5px;
    background: ${(props) => props.theme.background};
    box-shadow: none;
    border: 1px solid #dedede;
    border-radius: 5px;
  }
  &.form {
    max-width: 100%;
    display: flex;
    button {
      font-weight: 700;
    }
  }
  &.filter {
    margin: 0px;
    flex: 1 1 250px; /* flex-grow, flex-shrink, flex-basis */
    max-width: 250px; /* Maximum width for flexibility */
  }
  &.small {
    margin: 0px;
    flex: inherit;
    width: initial;
    margin-left: auto;
  }
  &.single {
    margin-right: 0em;
  }
  button label {
    display: none;
  }
  button label svg {
    color: green !important;
    transform: rotate(0deg) !important;
  }
  button.has {
    /* padding-top: 15px; */
    color: ${appTheme.text.main};
  }

  &.small button.has {
    padding-top: 5px;
  }
  &.small button.has label {
    display: none;
  }
  button.has label {
    position: absolute;
    display: block;
    font-weight: normal;
    top: 5px;
    left: 13px;
    font-size: 10px;
  }
  button.has svg:first-child {
    margin-right: 5px;
  }
  &.filter button.has label {
    font-size: 10px;
    top: 5px;
  }
  &.filter .options {
    top: 38px;
    /* position: initial; */
    margin: 0;
  }
  &.single .options {
    top: 47px;
    position: absolute;
    margin: 0px;
  }
  &.control .options {
    border-radius: 5px;
    top: 30px;
    position: absolute;
    margin: 0px;
  }
  &.open svg.down {
    transition: all 0.2s ease-out 0s;
    transform: rotate(180deg);
    color: black;
  }
  &.open .options {
    //border: 1px solid rgb(224, 224, 227);
    border: 1px solid #e2e4e9;
    z-index: 1004;
  }
  &.open .select {
    display: inherit;
  }
  button svg {
    /* margin-left: auto;
    margin-right: 1em; */
  }
  .options {
    opacity: 1;
    pointer-events: auto;
    -webkit-transform: scale(1) translateY(0);
    -ms-transform: scale(1) translateY(0);
    transform: scale(1) translateY(0);
    max-height: 250px;
    overflow-y: auto;
    min-width: 100%;
    background-color: white;
    border-color: rgb(224, 224, 227);
    border-radius: 12px;
    list-style: none;
    padding: inherit;
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 1004;
    margin: 0;
    left: 0;
    top: calc(100% + 10px);
    transition: all 1s ease-out 0s;
    padding: 0;
    box-shadow: 0px 16px 40px -8px #585c5f29;
    padding: 8px;
    gap: 4px;
    border-radius: 16px;
    opacity: 0px;
    &.up {
      bottom: calc(100% + 10px);
      top: auto;
    }
  }
  .options.hide {
    display: none;
  }
  &.open > button {
    border: 1px solid ${appTheme.stroke.strong};
    box-shadow: 0px 0px 0px 4px #e4e5e7;
  }
  .options li {
    cursor: pointer;
    /* border-bottom: 1px solid rgb(224, 224, 227); */
    padding: 8px;
    gap: 8px;
    border-radius: 8px;
    color: ${appTheme.text.main};
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left;
    transition: all 0.1s ease;
    position: relative;
    > svg {
      position: absolute;
      right: 0px;
      top: 10px;
    }
  }
  .options li.selected {
    /* background: ${(props) => props.theme.themeLight};
    color: ${(props) => props.theme.theme}; */
    font-weight: bold;
    cursor: pointer;
    background: ${appTheme.bg.weak};
    color: ${appTheme.bg.main};
    padding-left: 12px;
  }

  .options li svg {
    color: ${(props) => props.theme.lightSecForeground};
    margin-left: 0px;
    transform: rotate(0deg);
    width: 15px;
    height: 15px;
  }
  .options li:last-child {
    border-bottom: 0px solid rgb(224, 224, 227);
  }
  .options li:hover {
    /* background: ${(props) => props.theme.themeLight};
    color: ${(props) => props.theme.theme}; */
    transform: scale(1.005);

    cursor: pointer;
    background: ${appTheme.bg.weak};
    padding-left: 12px;
    transition: all 0.4s;
  }
  &.small .options {
    top: 32px;
    border-radius: 5px;

    li {
      font-size: 14px;
      padding: 5px;
    }
  }
  button:disabled {
    background: ${appTheme.bg.weak};
    color: ${appTheme.text.sub};
    cursor: not-allowed;
    border: 0;
  }
  @media screen and (max-width: 768px) {
    &.half:nth-child(odd) {
      width: 100%;
      margin-left: 0px;
    }
    &.half:nth-child(even) {
      width: 100%;
      margin-right: 0px;
    }
    &.filter {
      flex: 1 1 100%; /* flex-grow, flex-shrink, flex-basis */
      max-width: 200px; /* Maximum width for flexibility */
    }
  }
`;
// export const Label = styled.label`
//   pointer-events: none;
//   top: 12px;
//   left: 14px;
//   font-size: 14px;
//   transition: all 0.1s ease;
//   color: ${(props) => props.theme.foreground};
//   background-color: white;
//   /* &.shrink {
//     display: none;
//   } */
// `;
export const Tag = styled.span`
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
`;
export const TagTitle = styled.span`
  display: flex;
  margin-right: 5px;
  margin-bottom: 5px;
  color: rgb(131, 136, 148);
  /* &:after {
    content: " :";
  } */
`;
export const TagItem = styled.span`
  padding: 0px;
  border-radius: 10px;
  font-weight: 500;
  margin-right: 10px;
  &.image {
    padding: 0;
  }
  &.title {
    font-weight: bold;
    font-size: 14px;
  }
`;
export const TagList = styled.div`
  display: flex;
  margin-top: 5px;
  flex-wrap: wrap;
`;
export const TagBox = styled.div`
  display: flex;
  font-size: 14px;
  flex-direction: row;
  margin-top: 10px;
  text-wrap: wrap;
  cursor: pointer;
  &.column {
    flex-direction: column;
    row-gap: 5px;
  }
`;
export const TagData = styled.div`
  display: flex;
  font-size: 14px;
  flex-wrap: wrap;
`;
export const ImgBox = styled.img`
  min-width: 50px;
  max-width: 50px;
  min-height: 50px;
  max-height: 50px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 10px;
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
`;
export const Button = styled.div`
  border: none;
  padding: 6px 6px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 14px;
  /* white-space: nowrap; */
  border: 1px solid lightgray;
  margin-top: 10px;
  width: fit-content;
  border-radius: 10px;
  &:hover {
    background: white;
  }
`;

export const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
