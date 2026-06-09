import styled from "styled-components";

export const ProfileBanner = styled.div` border-radius: 12px;
  color: white;
  margin: 20px 20px 0;
  .data {
    display: flex;
    justify-content: left;
    -webkit-box-align: center;
    align-items: center;
    padding: 10px 10px;
    gap: 10px;
  }
  .pic img {
    width: 80px !important;
    float: left;
    height: 80px !important;
    background-repeat: inherit;
    text-align: center;
    background-position: center;
    margin: auto;
    border-radius: 50%;
    border: 3px solid white;
    background-size: cover;
    margin: 10px;
    object-fit: cover;
    object-position: center;
  }
  h2 {
    width: 100%;
    float: left;
    margin: auto;
    font-weight: 600;
    font-size: 20px;
  }
  h3 {
    width: 100%;
    float: left;
    font-size: 13px;
    font-weight: normal;
    margin: auto;
    margin-top: 5px;
  }
`;
