import React from "react";
import styled from "styled-components";
import { generateProfileLetters } from "./functions/index";
import { appTheme } from "../../project/brand/project";

const ProfileImageContainer = styled.div`
  width: 40px;
  height: 40px;
  max-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
  
  &.has-image {
    background-color: transparent;
    color: white;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    && {
      /* Styles to apply when parent has class shrink */
      .triple & {
        width: auto;
        height: 50px;
        align-items: baseline;
        justify-content: left;
        border-radius: 0px;
      }
    }
  }
  &.no-image {
    background-color: ${appTheme.primary.base} !important;
    color: white;
    img {
      display: none;
    }
  }
`;

const ProfileImage = ({ imageUrl, title, customProfileSource = false, onImageClick, className = "", theme }) => {
  const hasImage = imageUrl && imageUrl !== "noimage";
  const cdnUrl = import.meta.env.VITE_CDN;
  const fullImageUrl = hasImage ? (customProfileSource ? "" : cdnUrl) + imageUrl : null;

  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.parentElement.style.display = "flex";
  };

  const handleClick = (e) => {
    if (onImageClick && hasImage) {
      e.stopPropagation();
      onImageClick(e.target.src.replace("/thumbnail", ""));
    }
  };

  return (
    <ProfileImageContainer className={`profile-image ${className} ${hasImage ? "has-image" : "no-image"}`} theme={theme}>
      {hasImage ? <img src={fullImageUrl} onError={handleImageError} onClick={handleClick} alt={title || "Profile"} /> : generateProfileLetters(title)}
    </ProfileImageContainer>
  );
};

export default ProfileImage;
