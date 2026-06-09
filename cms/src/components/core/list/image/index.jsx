import React from "react";
import styled, { keyframes } from "styled-components";
import { noimage } from "../../../../images";

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000033;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
const zoomAnimation = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;
const PopupContainer = styled.div`
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  animation: ${zoomAnimation} 0.3s ease-in-out;
`;

const PopupImage = styled.img`
  max-width: 90%;
  border: 1px solid #e2e4e9;
  max-height: 90vh;
  object-fit: contain;
  background-color: white;
  border-radius: 12px;
`;

const ImageContainer = styled.div`
  cursor: pointer;
`;

const ImagePopup = ({ src, alt, onClose }) => {
  return (
    <ImageContainer
      onClick={() => {
        onClose();
      }}
    >
      <PopupOverlay>
        <PopupContainer>
          <PopupImage
            onError={(e) => {
              e.target.src = noimage; // Hide the image on error
            }}
            src={src}
            alt={alt}
          />
        </PopupContainer>
      </PopupOverlay>
    </ImageContainer>
  );
};

export default ImagePopup;
