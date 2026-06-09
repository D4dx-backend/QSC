import React, { useRef, useState, useEffect } from "react";
import { FileContainer, Input } from "./styles";
import CustomLabel from "./label";
import { noimage } from "../../../images";
import { IconButton } from "../elements";
import InfoBoxItem from "./info";
import { SubPageHeader } from "./heading";
import Footnote from "./footnote";
import ErrorLabel from "./error";

const VideoUploader = (props) => {
  const [previewVideo, setPreviewVideo] = useState(null);
  const fileInputRef = useRef(null);

  // Cleanup blob URLs when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewVideo && previewVideo.startsWith('blob:')) {
        URL.revokeObjectURL(previewVideo);
      }
    };
  }, [previewVideo]);

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
  const video = props.formValues?.["old_" + props.name] ?? "";

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create blob URL for video files
      const blobUrl = URL.createObjectURL(file);
      setPreviewVideo(blobUrl);
    }
    props.onChange(event, props.id, props.type);
  };

  return (
    <FileContainer className={`${props.customClass ?? "full"} ${props.dynamicClass ?? ""}`}>
      <CustomLabel name={props.name} className={`${props.dynamicClass ?? ""}`} label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <div>
        <div className="w-[160px] h-[90px]">
          {video ? (
            <video
              style={{ width: "100%", height: "100%" }}
              className="contain"
              controls
              src={previewVideo ? previewVideo : video ? import.meta.env.VITE_CDN + video : noimage}
            />
          ) : (
            <video
              style={{ width: "100%", height: "100%" }}
              className="contain"
              controls
              src={previewVideo ? previewVideo : noimage}
            />
          )}
          {props.update && props.formType === "put" && <IconButton ClickEvent={handleButtonClick} align="imageedit" icon="pen"></IconButton>}
          {!props.disabled && !video && <IconButton ClickEvent={handleButtonClick} align="imageedit" icon="add"></IconButton>}
        </div>
        <div>
          <InfoBoxItem info={props.info} />
          <SubPageHeader 
            dynamicClass="custom" 
            line={false} 
            description={props.value?.length > 0 
              ? `File size: ${size} <br /> Supported file types: MP4, WebM, Ogg` 
              : `File size: Up to 50MB <br /> Supported file types: MP4, WebM, Ogg`} 
          />
          <Footnote {...props} />
          <ErrorLabel error={props.error} info={props.info} />
          <Input 
            name={props.name} 
            disabled={props.disabled} 
            ref={fileInputRef} 
            style={{ display: "none" }} 
            accept="video/*" 
            className={`input ${props.value?.length > 0 ? "shrink" : ""}`} 
            placeholder={props.placeholder} 
            type="file" 
            onChange={onchange} 
          />
        </div>
      </div>
    </FileContainer>
  );
};

export default VideoUploader; 