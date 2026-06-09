import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 55%;
  right: 0;
  transform: translateY(-50%);
  padding: 1.5rem;
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
`;

export const SectionTitle = styled.h4`
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
`;

export const MetricRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  color: #333;
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 0.5rem;
`;

export const Select = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 0.875rem;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

export const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  color: #fff;

  background-color: ${({ cancel }) => (cancel ? "#f5f5f5" : "#000")};
  color: ${({ cancel }) => (cancel ? "#000" : "#fff")};

  &:hover {
    background-color: ${({ cancel }) => (cancel ? "#e0e0e0" : "#333")};
  }
`;

export const ResetButton = styled(Button)`
  background-color: #fff;
  color: #000;
  border: 1px solid #ddd;
`;
