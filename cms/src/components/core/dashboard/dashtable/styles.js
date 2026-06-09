import styled from "styled-components";
export const Table = styled.table`
  width: calc(100% + 40px);
  border-collapse: collapse;
  margin: 0 -20px;

  th {
    color: lightgray;
    font-weight: bold;
    padding: 8px;
    text-align: left;
    font-size: 12px;
  }

  tr {
    border-bottom: 1px solid lightgray;
  }
  td:first-child,
  th:first-child {
    padding-left: 20px;
  }
  td {
    padding: 8px;
    font-size: 12px;
  }

  .percentage-bar {
    position: relative;
    height: 6px;
    background-color: lightgray;
    border-radius: 8px;
    overflow: hidden;
  }

  .percentage-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  .percentage-value {
    display: inline-block;
    padding: 4px 8px;
    border: 1px solid #eaeaea;
    border-radius: 8px;
  }
`;
export const StatusBox = styled.div`
  width: 50px; /* Adjust width as needed */
  height: 20px; /* Adjust height as needed */
  border: 1px solid lightgray;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 10px;
  color: white;
  background-color: ${({ color }) => color};
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ checked, theme }) => (checked ? theme.theme : "#ccc")};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ checked }) => (checked ? "translateX(16px)" : "translateX(0)")};
  }
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + ${Slider} {
    background-color: ${({ theme }) => theme.theme};
  }

  &:focus + ${Slider} {
    box-shadow: 0 0 1px ${({ theme }) => theme.theme};
  }

  &:checked + ${Slider}:before {
    transform: translateX(16px);
  }
`;
