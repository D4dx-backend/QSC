import styled, { css } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datepicker.css";
import { appTheme } from "../../project/brand/project";
export const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  right: 0;
  top: 25px;
  padding: 0 5px;
  pointer-events: none;
`;
export const CountryCode = styled.div`
  display: flex;
  position: absolute;
  left: 1px;
  top: 21px;
  cursor: pointer;
  padding: 1px 10px;
  margin: 7px 0;
  max-height: 40px;
  height: 25px;
  font-size: 14px;
  -webkit-box-align: center;
  align-items: center;
  border-radius: 10px 0 0px 10px;
  width: 90px;
  border-right: 1px solid rgb(226, 228, 233);
  justify-content: space-between;
  .options {
    position: absolute;
    top: 45px;
    z-index: 1001;
    background: white;
    border: 1px solid ${appTheme.stroke.soft};
    transition: all 0.2s ease 0s;
    padding: 8px;
    width: max-content;
    text-align: justify;
    gap: 2px;
    display: flex;
    flex-direction: column;
    border-radius: 11px;
    left: 0;
    font-size: 14px;
    max-height: 200px;
    overflow: auto;
    .option {
      padding: 8px;
      transition: all 0.4s;
      border-radius: 12px;
      :hover {
        background: ${appTheme.bg.weak};
        padding-left: 12px;
      }
    }
    .active {
      background: ${appTheme.bg.weak};
      padding-left: 12px;
    }
    .line {
      /* border-bottom: 1px solid lightgray; */
    }
  }
`;
export const InputContainer = styled.div`
  position: relative;
  display: flex;
  animation: ${(props) => props.animation};
  flex-direction: column;
  gap: 4px;
  /* max-width: 370px; */
  &.checkbox {
    width: 100%;
    flex: none;
    -webkit-box-align: left;
    align-items: left;
    display: flex;
    flex-direction: row;
    /* max-width: 350px; */
    flex-direction: column;
    gap: 10px;
    row-gap: 4px;
  }
  &.auto {
    width: auto;
  }
  &.center {
    /* display: flex;
    align-self: center; */
  }
  .control {
    display: none;
  }
  &.short {
    width: 30px;
    min-width: auto;
  }
  &.small {
    width: 60px;
    min-width: auto;
  }
  &.control .control {
    display: flex;
  }
  &.control input {
    text-align: center;
  }
  &.disabled {
    display: none;
  }
  &.textarea {
    max-width: 100%;
  }
  &.direct input {
    /* background-color:transparent; */
    margin-bottom: 0;
    border-radius: 0;
  }
  grid-column: span 12; /* 50% width */
  &.double {
    grid-column: span 6; /* 50% width */
  }
  &.quarter {
    grid-column: span 3; /* 25% width */
  }
  &.third {
    grid-column: span 9; /* ~33% width - rounds to span 1.33 columns out of 4 */
  }
  &.half {
    grid-column: span 6; /* 50% width */
  }

  &.large {
    grid-column: span 9; /* 75% width */
  }
  &.full {
    grid-column: span 12; /* 100% width */
  }
  &.title {
    grid-column: span 12; /* 100% width */
  }
  &.control {
    max-width: 90px;
    grid-column: span 3; /* 100% width */
    input {
      height: 25px;
      border-radius: 5px;
      font-size: 12px;
    }
    label .label {
      font-size: 11px;
    }
    svg {
      color: ${appTheme.stroke.sub};
      width: 10px;
      height: 10px;
    }
    .checkbox svg {
      color: ${appTheme.stroke.white};
    }
  }
  && {
    /* Styles to apply when parent has class shrink */
    .popup & {
      &:nth-of-type(even) {
        margin-left: 5px;
      }
      &:nth-of-type(odd) {
        margin-right: 5px;
      }
      &.textarea {
        flex: calc(100% - 0px);
        margin-right: 0px;
      }
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  > svg {
    position: absolute;
    top: 33px;
    left: 10px;
    width: 15px;
    height: 15px;
  }
  &.badge-card {
    display: flex;
    flex-direction: row;
    background-color: #fff;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    font-weight: 500;
    margin-top: 1rem;
    box-sizing: border-box;
    position: relative;

    .icon-container {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      &.circular {
        // width: 40px;
        // height: 30px;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid lightgrey;
        margin-right: 0.75rem;
        margin-top: 4px;
      }
    }
    .badge-radio {
      padding: 8px;
    }
    .text-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 1rem;
      span {
        display: block;
        font-size: 1rem;
        color: #333;
        margin: 0;
        padding: 0;
        text-indent: 0;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        text-align: start;
        margin-left: 0;
        text-indent: 0;
      }
    }

    .right-radio {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid lightgrey;
      background-color: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      -webkit-appearance: none;
      cursor: pointer;
      outline: none;
    }

    .right-radio:checked {
      border-color: #375dfb;
      background-color: #fff;
    }

    .right-radio:checked::before {
      content: "";
      display: block;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background-color: #375dfb;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .right-radio:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .right-arrow {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1rem; /* Adjust size as needed */
      color: #666; /* Adjust color as needed */
    }
  }
  @media (max-width: 768px) {
    flex: 100%;
    margin: 0px !important;
    &.checkbox {
      flex: 1 1 100%;
      margin: 0px 5px 15px !important;
    }
  }
  ${(props) =>
    props.children &&
    css`
      & input:focus ~ .floating-label,
      textarea:focus ~ .floating-label,
      textarea:not(:focus):valid ~ .floating-label,
      input:not(:focus):valid ~ .floating-label,
      input[type="date"]:not(:focus):invalid ~ .floating-label,
      .filter input[type="date"]:not(:focus):invalid ~ .floating-label,
      input[type="datetime-local"]:not(:focus):invalid ~ .floating-label,
      .filter input[type="datetime-local"]:not(:focus):invalid ~ .floating-label {
        top: -1px;
        left: 13px;
        right: 6px;
        font-size: 11px;
        opacity: 1;
        text-align: left;
        height: 19px;
        padding: 3px 0;
      }
    `}
`;
export const FileContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0px;
  color: ${appTheme.text.soft};
  background: ${appTheme.bg.white};
  font-weight: 400;
  gap: 10px;
  padding: 0px;
  &.small {
    grid-column: span 4; /* 25% width */
  }

  &.half {
    grid-column: span 6; /* 50% width */
  }

  &.large {
    grid-column: span 9; /* 75% width */
  }
  &.full {
    grid-column: span 12; /* 100% width */
  }
  &.title {
    grid-column: span 12; /* 100% width */
  }
  > div {
    display: flex;
    gap: 20px;
  }
  > div > div:first-child {
    img {
      width: auto;
      height: 50px;
      min-height: 50px;
      min-width: 50px;
      border-radius: 8px;
      object-fit: cover;
    }
  }
  > div > div:last-child {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  > div > div {
    position: relative;
  }
  > div > div:first-child button {
    position: absolute;
    right: -10px;
    top: -10px;
  }
  &.disabled {
    display: none;
  }
`;
export const ColorInput = styled.input`
  margin-top: 0;
  padding: 2px;
  height: 40px;
  border: 1px solid rgb(226 228 232);
  border-radius: 10px;
  width: 100%;
  background: white;
`;
export const Slider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 5px;
  background: #ddd;
  border-radius: 5px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: ${appTheme.primary.base};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #4caf50;
    border-radius: 50%;
    cursor: pointer;
  }
`;
export const Bar = styled.div`
  background-color: ${appTheme.bg.soft};
  width: 100%;
  height: 5px;
  border-radius: 10px;
  div {
    background-color: ${appTheme.primary.base};
    width: 100%;
    height: 5px;
    border-radius: 10px;
    transition: width 0.3s ease; /* Add transition for width */
  }
`;
export const Label = styled.label`
  pointer-events: none;
  font-size: 10px;
  transition: all 0.1s ease;
  color: ${appTheme.text.main};
  background-color: transparent;
  text-align: left;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  align-items: center;
  letter-spacing: -0.006em;
  gap: 4px;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  grid-column: span 4;
  .label {
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    text-align: left;
  }
  &.has-desc .label {
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.011em;
    text-align: left;
  }
  & .description {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left;
    color: ${appTheme.text.sub};
  }
  &.toggle .description {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
  }
  &.disabled {
    display: none;
  }
  &.phone2 {
    left: 70px;
  }
  &.phone3 {
    left: 75px;
  }
  &.percentage {
    display: flex;
    justify-content: space-between;
  }
  .sublabel {
    font-weight: 400;
    color: ${appTheme.text.sub};
    margin-left: 5px;
  }
  &.small {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: right;
    color: ${appTheme.text.sub};
  }
  &.double {
    grid-column: span 6; /* 100% width */
  }
  &.single {
    grid-column: span 12; /* 25% width */
  }
  i {
    font-weight: 400;
    color: ${appTheme.primary.base};
    margin-left: 5px;
  }
  /* &.shrink {
    display: none;
    color: black;
    &.phone2 {
      left: 20px;
    }
    &.phone3 {
      left: 25px;
    }
  } */
  /* &.error {
    color: red;
    color: red;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 93%;
  } */
  &.checkbox {
    position: initial;
    pointer-events: initial;
    display: flex;
    align-items: baseline;
  }
  && {
    /* Styles to apply when parent has class shrink */
    .filter & {
      top: 10px;
      font-size: 10px;
    }
    .form & {
      font-size: 14px;
    }
  }
`;

export const CheckBox = styled.input`
  margin: 0;
  margin-right: 5px;
  & ~ .checkmark {
    background-color: #ccc;
  }

  &:checked ~ .checkmark {
    background-color: #2196f3;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  &:checked ~ .checkmark:after {
    display: block;
  }

  .container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;
export const Input = styled.input`
  box-sizing: border-box;
  padding: 10px 10px 10px 12px;
  outline: none !important;
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${appTheme.stroke.soft};
  height: 40px;
  font-weight: 400;
  transition: all 0.2s ease-out 0s;
  color: ${appTheme.text.soft};
  background: ${appTheme.bg.white};
  font-size: 14px;
  &.phone2,
  &.phone1,
  &.phone3 {
    padding-left: 100px;
    color: black;
  }
  &.shrink {
    /* padding: 1.2em 13px 0; */
    color: ${appTheme.text.main};
    &.phone2 {
      padding-left: 65px;
    }
    &.phone3 {
      padding-left: 80px;
    }
  }
  &.has-icon {
    padding-left: 30px;
  }
  &.buttonText {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right-width: 0;
  }
  appearance: none;
  &:disabled {
    background: ${appTheme.bg.weak};
    color: ${appTheme.text.sub};
    cursor: not-allowed;
    border: 0;
  }
  &.short {
    text-align: center;
  }
  &:focus {
    border: 1px solid ${appTheme.stroke.strong};
    box-shadow: 0px 0px 0px 4px #e4e5e7;
  }
  &:focus ~ .country {
    border-color: ${appTheme.stroke.strong};
  }
`;
export const DatetimeInput = styled(DatePicker)`
  box-sizing: border-box;
  padding: 10px 10px 10px 12px;
  outline: none !important;
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${appTheme.stroke.soft};
  height: 40px;
  font-weight: 400;
  transition: all 0.2s ease-out 0s;
  color: ${appTheme.text.soft};
  background: ${appTheme.bg.white};
  font-size: 14px;
  &.shrink {
    /* padding: 1.2em 13px 0px; */
    color: black;
  }
  &.has-icon {
    padding-left: 30px;
  }
  &:disabled {
    background: ${appTheme.bg.weak};
    color: ${appTheme.text.sub};
    cursor: not-allowed;
    border: 0;
  }
  && {
    /* Styles to apply when parent has class shrink */
    .filter & {
      padding: -0.6em 13px 0px;
      margin: 0px 0px 0px;
      background-color: white;
      height: 32px;
    }
  }
`;
export const DatetimeInputDirectOrder = styled(DatePicker)`
  box-sizing: border-box;
  padding: 10px 10px 10px 12px;
  outline: none !important;
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${appTheme.stroke.soft};
  height: 40px;
  font-weight: 400;
  transition: all 0.2s ease-out 0s;
  color: ${appTheme.text.soft};
  background: ${appTheme.bg.white};
  &.shrink {
    padding: 1.6em 13px 0;
    color: black;
  }
`;
export const Button = styled.button`
  height: 40px;
  border-radius: 8px;
  background: ${appTheme.primary.base};
  color: ${appTheme.text.white};
  font-size: 14px;
  font-weight: 500;
  padding: 0px 4px 0px 4px;
  align-items: center;
  display: flex;
  justify-content: center;
  gap: 8px;
  opacity: 0px;
  &.red {
    background: rgb(229, 49, 33) !important;
    color: white !important;
  }
  border: 1px solid #e2e4e9;
  transition: all 0.5s ease;
  margin-top: 10px;
  /* max-width: 370px; */
  padding: 10px 15px;
  width: 100%;
  border-color: ${(props) => props.theme.border};
  cursor: pointer;
  border-width: 0;
  justify-content: center;
  &.close {
    background: ${appTheme.bg.white};
    color: ${appTheme.text.sub};
    border: 1px solid ${appTheme.stroke.soft};
  }
  &.marginless {
    margin-top: 0;
  }
  &.theme {
    background: ${appTheme.primary.base};
    color: ${appTheme.text.white};
  }

  &.transparent {
    color: ${appTheme.primary.base};
    background: ${appTheme.text.white};
  }
  &.widges {
    background: ${appTheme.bg.plain};
    color: ${appTheme.text.sub};
    border: 1px solid ${appTheme.stroke.soft};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin: 0px;
    width: 90px;
    height: 72px;
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;

    transition: background 0.3s, color 0.3s, border-color 0.3s;
    svg {
      width: 15px;
      height: 15px;
    }
    &:hover {
      background: ${appTheme.bg.white};
      color: ${appTheme.text.main};
      border-color: ${appTheme.stroke.main};
    }
  }
  &.content-card {
  }
  &.custom {
    margin: 0;
    gap: 5px;
    display: flex;
    align-items: center;
    text-wrap: nowrap;
    width: fit-content;
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
  &.secondary {
    background: ${appTheme.bg.white};
    color: ${appTheme.text.sub};
    border: 1px solid ${appTheme.stroke.soft};
  }
  &.error {
    background: ${appTheme.bg.white};
    color: ${appTheme.state.error};
    border: 1px solid ${appTheme.state.error};
  }
  &.margin-top {
    margin-top: 10px;
  }
  &.full-width,
  &.embed {
    width: 100%;
    background: ${appTheme.primary.base};
    color: ${appTheme.text.white};
  }

  &.landing {
    color: ${(props) => props.theme.themeForeground};
    background: ${(props) => props.theme.themeBackground};
    ${(props) =>
      props.colors &&
      css`
        background: ${props.colors.primaryColour};
        color: white;
      `}
  }

  &.buttonText {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border: 1px solid ${appTheme.stroke.soft};
  }
  &.buttonText.active {
    background-color: transparent;
    color: #df1c41;
  }
  &.linkbutton {
    background-color: transparent;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: right;
    color: ${appTheme.text.main};
    border-bottom: 1px solid;
    height: 30px;
    padding: 0;
    border-radius: 0;
    margin-top: 0;
  }
  &.no-line {
    border: none;
  }
  &:disabled {
    background-color: ${(props) => props.theme.disabledBackground};
    color: ${(props) => props.theme.disabledForeground};
    cursor: not-allowed;
  }
`;
export const InputBox = styled.div`
  display: flex;
`;
export const TextArea = styled.textarea`
  box-sizing: border-box;
  padding: 10px 10px 10px 12px;
  outline: none !important;
  width: 100%;
  border-radius: 10px;
  border: 1px solid ${appTheme.stroke.soft};
  font-weight: 400;
  font-size: 14px;
  transition: all 0.2s ease-out 0s;
  color: ${appTheme.text.soft};
  background: ${appTheme.bg.white};
  resize: none;
  min-height: 70px;
  &:focus {
    border: 1px solid ${appTheme.stroke.strong};
    box-shadow: 0px 0px 0px 4px #e4e5e7;
  }
  &.medium {
    height: 150px;
  }
  &.large {
    height: 230px;
  }
  &.shrink {
    /* padding: 1.5em 13px 0px; */
    color: black;
  }
  &:disabled {
    background: ${appTheme.bg.weak};
    color: ${appTheme.text.sub};
    cursor: not-allowed;
    border: 0;
  }
`;
export const Info = styled.div`
  padding-left: 0px;
  font-size: 14px;
  width: 100%;
  margin: 5px;
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 5px;
  &.disabled {
    display: none;
  }
  &.title {
    font-size: 16px;
    padding: 5px;
    margin-bottom: 10px;
    border-bottom: 1px solid #d9d9d9;
  }
  svg {
    min-width: 14px;
    margin-right: 5px;
    margin-top: 2px;
    align-items: baseline;
    display: flex;
    align-self: baseline;
  }
  grid-column: span 12; /* 50% width */
  &.double {
    grid-column: span 6; /* 50% width */
  }
  &.quarter {
    grid-column: span 3; /* 25% width */
  }
  &.third {
    grid-column: span 9; /* ~33% width - rounds to span 1.33 columns out of 4 */
  }
  &.half {
    grid-column: span 6; /* 50% width */
  }

  &.large {
    grid-column: span 9; /* 75% width */
  }
  &.full {
    grid-column: span 12; /* 100% width */
  }
`;
export const Line = styled.div`
  width: 100%;
  height: 1px;
  gap: 0px;
  opacity: 0px;
  background: ${appTheme.stroke.soft};
  grid-column: span 12; /* 50% width */
  &.disabled {
    display: none;
  }
`;
export const SubHead = styled.div`
  margin-top: 0px;
  margin-bottom: 0px;
  font-weight: 600;
  width: 100%;
  display: flex;
  -webkit-box-pack: start;
  justify-content: flex-start;
  align-self: flex-start;
  flex-direction: column;
  align-items: baseline;
  gap: 4px;
  font-size: 18px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 5px;
  &.disabled {
    display: none;
  }
  > div {
    gap: 10px;
    display: flex;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: -0.015em;
    text-align: left;
  }
  &.sub > div {
    font-size: 16px;
    font-weight: 500;
    line-height: 19.36px;
    letter-spacing: -0.011em;
    text-align: left;
  }
  &::after {
    content: "";
    height: 1px;
    font-size: 20px;
    background: transparent;
    opacity: 0.6;
    width: 100%;
  }
  &.line::after {
    content: "";
    background: ${appTheme.stroke.soft};
  }
  &.custom {
    margin: 0px 0px;
  }
  &.width70 {
    width: 70%;
  }
  &.title {
    grid-column: span 12; /* 100% width */
  }
  &.nowrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: -webkit-fill-available;
    overflow: hidden;
  }
  p {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: left !important;
    color: ${appTheme.text.sub};
    margin: 0;
  }
  @media (max-width: 768px) {
    margin-top: 0;
    margin-bottom: 0;
  }
`;
export const CloseButton = styled.span`
  width: 10px;
  height: 10px;
  position: absolute;
  right: 15px;
  top: -3px;
  left: auto;
  z-index: 1;
  color: #868686;
  cursor: pointer;
  &.info-select {
    right: 45px;
  }
`;
export const InfoBox = styled.div`
  position: absolute;
  right: 0px;
  top: 20px;
  left: auto;
  z-index: 10;
  cursor: pointer;
  background: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  max-width: 100%;
  border: 1px solid #e2e4e9;
  text-align: left;
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    right: 12px;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent white transparent;
  }
  bold {
    font-weight: bold;
  }
  i {
    font-style: italic;
  }
`;

export const FootNote = styled.div`
  display: flex;

  color: ${appTheme.text.sub};
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: left;
  &.checkbox {
    margin-left: 27px;
  }
  svg {
    width: 22px;
    margin-right: 5px;
    font-size: 12px;
  }
  &.consent {
    padding-left: 10px;
    margin-bottom: 15px;
    border-left: 1px solid lightgray;
  }
`;
