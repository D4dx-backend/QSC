// src/components/ImageUploader.js
import React, { useRef, useState } from "react";
import { FileContainer, Input } from "./styles";
import CustomLabel from "./label";
import { noimage, doc } from "../../../images";
import { IconButton } from "../elements";
import InfoBoxItem from "./info";
import { SubPageHeader } from "./heading";
import Footnote from "./footnote";
import ErrorLabel from "./error";
import ImageCropper from "./imageCroper";
import { GetIcon } from "../../../icons";
import { Upload } from "lucide-react";
const ImageUploader = (props) => {
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  function formatSize(sizeInBytes) {
    if (sizeInBytes < 1024) {
      return sizeInBytes + " bytes";
    } else if (sizeInBytes < 1024 * 1024) {
      return (sizeInBytes / 1024).toFixed(2) + " KB";
    } else {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  }
  const size = formatSize(props.value?.[0] ? props.value[0].size : 0);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const image = props.formValues?.["old_" + props.name] ?? "";
  const handlePreviewClick = () => {
    setIsCropModalOpen(true);
  };

  const closeCropModal = () => {
    setIsCropModalOpen(false);
  };

  const handleCropComplete = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    const customEvent = {
      target: {
        files: [file],
      },
    };
    props.onChange(customEvent, props.id, props.type); // Pass cropped image as a custom event to parent
  };

  const onchange = (event) => {
    const file = event.target.files[0];
    if (props.type === "image") {
      if (file) {
        // Create a FileReader to read the file as a Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target.result); // Set the preview image to the Data URL
        };
        reader.readAsDataURL(file); // Read the file as a Data URL
      }
    }
    props.onChange(event, props.id, props.type);
  };
  return (
    <FileContainer className={`${props.customClass ?? "full"} ${props.dynamicClass ?? ""}`}>
      <CustomLabel name={props.name} className={`${props.dynamicClass ?? ""}`} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <div className="border border-dashed border-gray-300 rounded-md p-2">
        <div>
          {image ? (
            <div className="flex items-center justify-center  cursor-pointer w-[70px] h-[50px] border border-dashed border-gray-300 rounded-md" onClick={handleButtonClick}>
            
            <img
              alt="upload"
              className="contain"
              onClick={(e) => {
                handlePreviewClick();
              }}
              src={previewImage ? previewImage : image ? import.meta.env.VITE_CDN + image : props.type === "image" ? noimage : doc}
            /></div>
          ) : previewImage ? (<div className="flex items-center justify-center  cursor-pointer w-[70px] h-[50px] border border-dashed border-gray-300 rounded-md" onClick={handleButtonClick}>
            
            <img
              alt="upload"
              className="contain"
              onClick={(e) => {
                handleButtonClick();
              }}
                src={previewImage ? previewImage : props.type === "image" ? noimage : doc}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center  cursor-pointer w-[70px] h-[50px] border border-dashed border-gray-300 rounded-md" onClick={handleButtonClick}>
              <Upload className="w-6 h-6 text-gray-500" />
            </div>
          )}
          {props.update && props.formType === "put" && <IconButton ClickEvent={handleButtonClick} align="imageedit" icon="pen"></IconButton>}
          {/* {!props.disabled && !image && <IconButton ClickEvent={handleButtonClick} align="imageedit" icon="add"></IconButton>} */}
          {props.type === "image" && previewImage && (
            <div className="flex items-center gap-2 rounded-md px-2 py-1 text-xs cursor-pointer  text-gray-500 border border-gray-200 transition-all duration-300 &>svg:text-primary-base" onClick={handlePreviewClick}>
              <GetIcon icon={"crop"} /> <span>Crop</span>
            </div>
          )}
        </div>
        <div>
          <InfoBoxItem info={props.info} />
          <SubPageHeader dynamicClass="custom" line={false} description={props.value?.length > 0 ? `File size: ${size} <br /> Supported file types: ${props.type === "image" ? "JPG, JPEG, PNG, GIF, WEBP" : "Images and Documents"}` : `File size: Up to 5MB <br /> Supported file types: ${props.type === "image" ? "JPG, JPEG, PNG, GIF, WEBP" : "Images and Documents"}`} />
          <Footnote {...props} />
          <ErrorLabel error={props.error} info={props.info} />
          <Input name={props.name} disabled={props.disabled} ref={fileInputRef} style={{ display: "none" }} accept={props.type === "image" ? `image/*` : ``} className={`input ${props.value?.length > 0 ? "shrink" : ""}`} placeholder={props.placeholder} type={`file`} onChange={onchange} />
          {isCropModalOpen && props.type === "image" && previewImage && <ImageCropper height={props.height} width={props.width} image={previewImage} onCropComplete={handleCropComplete} onClose={closeCropModal} />}
        </div>
      </div>
    </FileContainer>
  );
};

export default ImageUploader;
