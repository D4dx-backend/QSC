// src/components/ImageCropper.js
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import styled from "styled-components";
import { Button } from "../elements";

// Styled components for the crop popup
const CropPopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const CropPopupContent = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  position: absolute;
`;

const ButtonContainer = styled.div`
  margin-top: 16px; /* Space between cropper and buttons */
  display: flex;
  top: auto;
  height: 50px;
  left: 0;
  gap: 10px;
  right: 0;
  bottom: 0;
  position: absolute;
  background-color: rgb(3 3 3 / 51%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ImageCropper = ({ image, onCropComplete, onClose, width = 4, height = 4 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const croppedFile = new File([blob], "croppedImage.png", { type: "image/png" });
            resolve(croppedFile);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, "image/png");
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleCrop = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      onCropComplete(croppedImage); // Call the passed function
      onClose(); // Close the crop modal
    }
  };

  return (
    <CropPopupContainer>
      <CropPopupContent>
        <Cropper
          style={{ background: "white" }}
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={width / height}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback} // Use the renamed callback
          onZoomChange={setZoom}
        />
      </CropPopupContent>
      <ButtonContainer>
        <Button type="secondary" value={"Close"} ClickEvent={onClose} />
        <Button align="landing" value={"Crop Image"} ClickEvent={handleCrop} />
      </ButtonContainer>
    </CropPopupContainer>
  );
};

export default ImageCropper;
