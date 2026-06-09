import ReactQuill from "react-quill";
import styled from "styled-components";

export const Editor = styled(ReactQuill)`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e4e9;
  transition: all 0.2s ease-out 0s;
  margin: 5px 2px;
  p {
  }
`;
export const Label = styled.label`
  font-size: 14px;
  margin: 10px 4px;
  font-weight: 700;
  color: #757575;
  display: flex;
  justify-content: space-between;
`;
