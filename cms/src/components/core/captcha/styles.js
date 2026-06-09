import styled from "styled-components";
export const CpatchaContainer = styled.div`
  display: flex;
  justify-content: start;
  grid-column: span 12; /* 50% width */
  &.double {
    grid-column: span 6; /* 50% width */
  }
  &.quarter {
    grid-column: span 3; /* 25% width */
  }
`;
export const Canvas = styled.div`
  display: flex;
  height: 38px;
  margin-right: 10px;
  border: 1px solid lightgray;
  border-radius: 10px;

  canvas {
    border-radius: 10px;
    cursor: pointer;
  }
`;
