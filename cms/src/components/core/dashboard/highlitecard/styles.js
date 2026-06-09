import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";
export const Titles = styled.div`
  font-size: 14px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const Summary = styled.div`
  font-size: 12px;
  color: grey;
`;
export const DashboardSection = styled.div`
  margin: 30px;
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 250px);
  height: auto;
  align-content: flex-start;
  @media screen and (max-width: 560px) {
    grid-template-columns: auto;
    width: auto;
  }
`;

export const Tile = styled.div`
  padding: 30px 24px 30px 24px;
  gap: 12px;
  border-radius: 16px;
  border: 1px;
  border: 1px solid ${appTheme.stroke.soft};
  display: flex;
`;

export const TitleBox = styled.div`
  margin-top: 0;
  display: flex;
  -webkit-box-pack: left;
  justify-content: baseline;
  flex-direction: column;
  gap: 4px;
`;
export const TitleHead = styled.span`
  font-size: 11px;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 0.02em;
  text-align: left;
  color: ${appTheme.text.soft};

  &.info {
    color: Blue;
  }
`;

export const Count = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const IconWrapper = styled.div`
  height: 40px;
  width: 40px;
  padding: 10px;
  gap: 10px;
  border-radius: 50%;
  border: 1px;
  opacity: 0px;
  border: 1px solid ${appTheme.stroke.soft};
  display: flex;
  align-self: center;
  justify-content: center;
  color: ${appTheme.primary.base};
  svg {
    width: 16.09px;
    height: 16.09px;
  }
`;
export const TileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 20px;
  margin-top: 10px;
  @media (max-width: 768px) and (min-width: 460px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  @media (max-width: 460px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 10px;
  }
`;
