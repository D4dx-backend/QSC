// styles.js
import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";

export const DropArea = styled.div`
  border: 1px dashed ${appTheme.stroke.soft};
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  transition: background-color 0.2s;
  align-items: center;
  gap: 10px;

  svg {
    font-size: 30px;
  }
  &:hover {
    /* background-color: #edf2f7; */
  }
`;

export const UploadText = styled.div`
  display: flex;
  flex-direction: column;
  div:first-child {
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    text-align: center;
    color: ${appTheme.text.main};
  }
  div:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
    color: ${appTheme.text.soft};
  }
`;

export const BrowseButton = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #ffffff;
  background-color: #3182ce;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #2b6cb0;
  }
`;

export const ImageGrid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
`;

export const ImageItem = styled.div`
  /* border: 1px solid #e2e8f0; */
  border-radius: 0px;
  padding: 0px;
  background-color: #ffffff;
  /* box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); */
  position: relative;
  height: 100px;
  width: 152px;
  cursor: pointer;
  &:hover {
    background: black;
  }
  img {
    height: 100px;
    object-fit: cover;
    width: 100%;
  }
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: last baseline;
    gap: 10px;
    display: none;
    justify-content: flex-end;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    span {
      display: none;
      font-size: 14px;
      font-weight: 500;
      line-height: 16.94px;
      letter-spacing: -0.006em;
      text-align: left;
      color: white;
    }
    button {
      display: none !important;
    }
  }
  &:hover div {
    display: flex;
    background: #00000059;
    span,
    button {
      display: block !important;
    }
  }
`;
export const PhotoLimit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
export const Progess = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 1px solid ${appTheme.stroke.soft};
  padding: 16px 16px 16px 14px;
  border-radius: 12px;
  .info {
    flex-direction: column;
    display: flex;
    flex: 1;
    gap: 4px;
  }
  .buttons {
    display: flex;
  }
  .count {
    font-size: 14px;
    font-weight: 500;
    line-height: 16.94px;
    letter-spacing: -0.006em;
    text-align: left;
    color: ${appTheme.text.main};
  }
  .status {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    text-align: left;
    color: ${appTheme.text.sub};
    display: flex;
    gap: 5px;
    align-items: center;
    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    span::before {
      content: "•";
    }
    .green {
      color: ${appTheme.state.success};
    }
    .red {
      color: ${appTheme.state.error};
    }
  }
  .side .status {
    align-items: baseline;
    span::before {
      display: none;
    }
  }
`;
export const Status = styled.div`
  position: absolute;
  bottom: 0;
  padding: 5px;
  div {
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.04em;
    text-align: left;
  }
`;
export const UploadStatus = styled.span`
  margin-left: 8px;
  color: ${(props) => {
    switch (props.status) {
      case "pending":
        return "orange";
      case "uploading":
        return "blue";
      case "uploaded":
        return "green";
      case "failed":
        return "red";
      default:
        return "black";
    }
  }};
`;
