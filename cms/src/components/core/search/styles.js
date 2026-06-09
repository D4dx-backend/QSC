import styled from "styled-components";

export const SearchInput = styled.div`
  position: relative;
  animation: ease-in-out;
  animation-duration: 0.2s;
  margin-bottom: 0px;
  margin-top: 0px;

  &.select {
    top: 0;
    z-index: 1;
    display: inherit;
    position: sticky;
    top: 5px;
  }
  input {
    box-sizing: border-box;
    outline: none !important;
    border: 1px solid #e2e4e9;
    height: 32px;
    margin: 0px 0;
    padding: 0px;
    transition: all 0.2s ease-out 0s;
    border-radius: 8px;
    width: 32px;
    padding-left: 30px;
    &:focus {
      width: 200px;
      border-radius: 10px;
      padding-left: 32px;
    }
  }

  &.sticky {
    position: sticky;
  }
  && {
    .options & {
      input {
        border: 0px solid gainsboro;
        border: 1px solid #e2e4e9;
        height: 40px;
        margin: 0px 0px 0px 0px;
        padding: 15px 10px 15px 40px;
        border-radius: 10px;
        width: 100%;
      }
      svg {
        top: 12px;
      }
    }
  }
  &.active input {
    width: 200px;
    max-width: 100%;
    border-radius: 10px;
    color: ${(props) => props.theme.foreground};
    padding-left: 32px;
  }

  svg {
    position: absolute;
    left: 8px;
    top: 8px;
    pointer-events: none;
    background-color: white;
  }
  &.menu {
    margin-left: 0;
    border: 0;
    border-bottom: 1px solid rgb(239, 237, 237);
    position: sticky;
    top: 0px;
    z-index: 1;
    margin-bottom: 0;
    box-shadow: none !important;
    border-radius: 12px
    /* margin: 20px; */
  }
  &.menu input {
    width: 100% !important;
    padding-left: 55px;
    box-shadow: none;
  }
  &.menu svg {
    left: 20px;
  }
  &.select {
    margin: 0px 0 10px 0px;
  }

  .clear-button {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    padding: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
    top: 8px;
    &:hover {
      background-color: ${(props) => props.theme?.bg?.weak ?? "#F3F4F6"};
    }

    svg {
      position: static;
      width: 14px;
      height: 14px;
      color: ${(props) => props.theme?.text?.sub ?? "#6B7280"};
      transition: color 0.2s;
    }

    &:hover svg {
      color: ${(props) => props.theme?.text?.main ?? "#111827"};
    }
  }
`;
