import styled from "styled-components";

export const CardContainer = styled.div`
  background-color: rgb(255, 255, 255);
  border: 1px solid #e2e4e9;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: auto;
  border-radius: 12px;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;
  /* width: 100%; */
`;

export const Card = styled.div`
  background-color: rgb(255, 255, 255);
  border: 1px solid #e2e4e9;
  padding: 20px;
  margin: 0;
  display: flex;
  flex-direction: row;
  margin-bottom: auto;
  border-radius: 12px;
  -webkit-box-pack: justify;
  justify-content: flex-start;
  -webkit-box-align: center;
  align-items: center;
  /* width: 100%; */
  cursor: pointer;
`;

export const ImageBox = styled.img`
  max-height: 150px;
  object-fit: cover;
  border-radius: 50%;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

export const Description = styled.div`
  color: #555;
`;
export const Text = styled.div`
  flex-direction: column;
  width: calc(100%- 80px);
  gap: 10px;
  display: flex;
`;
export const ImageConatner = styled.div`
  color: #555;
  width: 80px;
  img {
    border-radius: 50%;
    height: 60px;
    width: 60px;
  }
  svg {
    font-size: 50px;
  }
`;
