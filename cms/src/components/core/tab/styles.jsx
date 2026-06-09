import styled from "styled-components";

export const Title = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text.main};
  background-color: ${(props) => props.theme.colors.bg.white};
  border-bottom: 1px solid ${(props) => props.theme.colors.stroke.soft};

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  span {
    &.text-primary-base {
      color: ${(props) => props.theme.colors.primary.base};
    }
    &.text-gray-400 {
      color: ${(props) => props.theme.colors.text.sub};
    }
    &.text-gray-600 {
      color: ${(props) => props.theme.colors.text.main};
    }
  }
`;

// ... rest of the styled components ... 