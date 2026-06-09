import styled from "styled-components";
export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* height: calc(100vh + 100vh); */
  padding-bottom: 50px;
  background-color: #f3f8fb;
  &.center {
    text-align: center;
    justify-content: center;
  }
  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding-bottom: 10px;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  margin-bottom: 60px;
  margin-top: 60px;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  margin: auto;
  margin: 40px auto;
  img {
    max-width: 100%;
  }
  @media screen and (max-width: 1200px) and (min-width: 768px) {
    max-width: 768px;
  }
  @media screen and (max-width: 768px) {
    flex: 1 1 100%;
    width: auto;
    padding: 10px;
    margin: 0px auto;
  }
`;
