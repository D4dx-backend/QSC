import styled from "styled-components";

export const TitleHead = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: grey;
  display: flex;
  align-items: baseline;
  gap: 0px;
  flex-direction: column;
`;
export const Amount = styled.div`
  font-size: 15px;
  font-weight: bold;
  text-align: left;
  padding-left: 0px;
`;
export const Legend = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 0;
  flex-direction: row;
  display: flex;
  gap: 5px;
  align-items: center;
  span {
    font-size: 12px;
    white-space: nowrap;
  }
  &.right {
    text-align: right;
  }
  svg {
    justify-content: center;
    align-items: center;
    margin: 5px;
    background: #e8e8e8;
    padding: 10px;
    border-radius: 10px;
  }
`;
export const Line = styled.div`
  height: 30px;
  width: 1px;
  background-color: #dedbdb;
`;
export const HLine = styled.div`
  width: 50%;
  background-color: rgb(222, 219, 219);
  margin: auto;
  display: flex;
  border-top: 1px solid rgb(222, 219, 219);
  margin-bottom: 10px;
  margin-top: 0;
  position: sticky;
  top: 0;
  &.horizontal {
    display: none;
  }
`;
// export const Title = styled.div`
//   font-size: 14px;
//   font-weight: bold;
//   margin-bottom: 10px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-left:20px;
//   margin-top:20px;
// `;

export const Title = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%; /* Ensure title spans full width */
  position: relative;
  padding-right: 10px; /* Optional padding to prevent text overflow */
  margin-top: 0px;
  padding: 10px 0;
  /* Full-width line under the Title */
  &::after {
    content: "";
    position: absolute;
    bottom: -5px; /* Adjust this to control spacing between text and the line */
    left: 0;
    right: 0; /* Ensures the line spans the full width */
    height: 1px; /* Thickness of the line */
    background-color: #dedbdb; /* Color of the line */
    margin-top: 13px;
  }
`;
export const TitleContainer = styled.div`
  display: flex;
  align-items: center; /* Vertically center the icon and title */
  gap: 5px; /* Space between the icon and title */
`;

export const IconWrapper = styled.div`
  height: 24px; /* Adjusted height */
  width: 24px; /* Adjusted width */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-left: 20px;

  svg {
    width: 80%; /* Make the SVG fill the container */
    height: 80%;
  }
`;
