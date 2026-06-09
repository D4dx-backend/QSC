import React, { useState } from "react";
import styled from "styled-components";
import { ElementContainer, IconButton } from "../../elements";
import { GetIcon } from "../../../../icons";
import { dateFormat } from "../../functions/date";

const FileContainer = styled.div`
  cursor: pointer;
  width: 200px;
  height: 150px;
  border: 1px solid #e2e4e9;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 12px;
  img {
    left: 0;
    right: 0;
    top: 0;
    bottom: 0px;
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 12px;
  }
  .left {
    margin-bottom: auto;
    margin-top: 5px;
    padding: 0 10px 0 0;
  }
  .action {
    background-color: #ffffffc2;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    margin-top: 5px;
    padding: 5px;
    width: auto;
  }
  .align.custom {
    margin: 5px 0 auto auto;
  }
`;

const ImagePreview = styled.img`
  position: absolute;
  object-fit: cover;
`;
const OtherPreview = styled.div`
  margin: 10px 0;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  background-color: #ffffffc2;
`;
const Preview = styled.div`
  margin: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  padding: 0px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.div`
  font-size: 14px;
  padding: 0 10px;
`;
const FileItem = ({ fileSource, alt, action, title = "File Name", date = new Date() }) => {
  const [downloading, setDownloading] = useState(false);
  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  const getFileType = (extension) => {
    switch (extension.toLowerCase()) {
      case "pdf":
        return "PDF";
      case "doc":
      case "docx":
        return "Word Document";
      case "xls":
      case "xlsx":
        return "Excel Spreadsheet";
      case "png":
      case "jpg":
      case "jpeg":
        return "Image";
      default:
        return "Unknown";
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    fetch(import.meta.env.VITE_CDN + fileSource)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        console.log(url);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}.${getFileExtension(fileSource)}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloading(false);
      })
      .catch((error) => {
        console.error("Download error:", error);
        setDownloading(false);
      });
  };

  const fileExtension = getFileExtension(fileSource);
  const fileType = getFileType(fileExtension);

  const renderPreview = () => {
    if (fileType === "Image") {
      return <ImagePreview src={import.meta.env.VITE_CDN + fileSource} alt={alt} />;
    } else {
      return null;
    }
  };

  return (
    <FileContainer>
      {renderPreview()}
      <Preview>
        <ElementContainer className="left">
          <ElementContainer className="action"> {action}</ElementContainer>
          {!downloading && <IconButton ClickEvent={handleDownload} icon="download"></IconButton>}
        </ElementContainer>
        {date && <Title>{title}</Title>}
        <OtherPreview>
          <span>
            <GetIcon icon={"add-file"}></GetIcon>
            {` ${fileType}`}
          </span>
          <span>{date && dateFormat(date)}</span>
        </OtherPreview>
      </Preview>
    </FileContainer>
  );
};

export default FileItem;
