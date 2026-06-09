import styled from "styled-components";

export const DashBox = styled.div`
  border: 1px solid #e2e4e9;
  border-radius: 12px;
  width: 100%;
  /* width: calc(${({ width }) => width} - 10px); */
  min-height: 100px;
  overflow: auto;
  box-sizing: border-box;
  grid-column: span ${({ column }) => column};
  &.noborder {
    border: 0px solid #e2e4e9;
    border-radius: 0px;
  }

  &.half {
    grid-column: span 2; /* 50% width */
  }

  &.quarter {
    grid-column: span 1; /* 25% width */
  }

  &.threequarter {
    grid-column: span 3; /* 75% width */
  }

  &.full {
    grid-column: span 4; /* 100% width */
  }
`;
