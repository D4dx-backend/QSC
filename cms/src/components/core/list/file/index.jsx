import React, { useState } from "react";
import styled from "styled-components";
import { IconButton } from "../../elements";
import { GetIcon } from "../../../../icons";
import { dateFormat } from "../../functions/date";
import PDFPreview from "../../pdfpreview";
import { FileText, FileSpreadsheet, FileImage, File } from "lucide-react";

const FileContainer = styled.div`
  cursor: pointer;
  width: 100%;
  border: 1px solid #e2e4e9;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease-in-out;
  gap: 1rem;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    border-color: #d1d5db;
  }
`;

const FilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const FileIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => (props.type === "Image" ? "#f0f9ff" : "#f3f4f6")};
  color: ${(props) => (props.type === "Image" ? "#0ea5e9" : "#4b5563")};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FileType = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileDate = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

const ImageThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;

const LucideIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FileItem = ({ fileSource, alt, action, title = "File Name", date = new Date(), thumbnail = "" }) => {
  const [downloading, setDownloading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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

  const getFileIcon = (fileType) => {
    const iconProps = {
      size: 20,
      strokeWidth: 1.5,
    };

    switch (fileType) {
      case "PDF":
        return (
          <LucideIconWrapper>
            <FileText {...iconProps} />
          </LucideIconWrapper>
        );
      case "Word Document":
        return (
          <LucideIconWrapper>
            <FileText {...iconProps} />
          </LucideIconWrapper>
        );
      case "Excel Spreadsheet":
        return (
          <LucideIconWrapper>
            <FileSpreadsheet {...iconProps} />
          </LucideIconWrapper>
        );
      case "Image":
        return (
          <LucideIconWrapper>
            <FileImage {...iconProps} />
          </LucideIconWrapper>
        );
      default:
        return (
          <LucideIconWrapper>
            <File {...iconProps} />
          </LucideIconWrapper>
        );
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    fetch(import.meta.env.VITE_CDN + fileSource)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
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

  const handleFileClick = (e) => {
    e.stopPropagation();
    const fileType = getFileType(getFileExtension(fileSource));
    if (fileType === "Image") {
      setShowImagePopup(true);
    } else if (fileType === "PDF") {
      setShowPdfPreview(true);
    }
  };

  const fileExtension = getFileExtension(fileSource);
  const fileType = getFileType(fileExtension);

  const renderFilePreview = () => {
    if (fileType === "Image" && !imageError) {
      return <ImageThumbnail src={import.meta.env.VITE_CDN + thumbnail} alt={alt || title} onError={() => setImageError(true)} />;
    }
    return getFileIcon(fileType);
  };

  return (
    <>
      <FileContainer onClick={handleFileClick}>
        <FilePreview>
          <FileIcon type={fileType}>{renderFilePreview()}</FileIcon>
          <FileInfo>
            <FileName>{title}</FileName>
            <FileDetails>
              <FileType>{fileType}</FileType>
              {date && <FileDate>{dateFormat(date)}</FileDate>}
            </FileDetails>
          </FileInfo>
        </FilePreview>
        <Actions>
          {action}
          {!downloading && (
            <IconButton
              ClickEvent={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              icon="download"
              align="plain small"
            />
          )}
        </Actions>
      </FileContainer>

      {/* Image Popup */}
      {showImagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[2001] flex items-center justify-center p-4" onClick={() => setShowImagePopup(false)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4 z-10">
              <button onClick={() => setShowImagePopup(false)} className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200">
                <GetIcon icon="Close" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <img src={import.meta.env.VITE_CDN + fileSource} alt={alt || title} className="w-full h-full object-contain" style={{ maxHeight: "90vh" }} />
          </div>
        </div>
      )}

      {/* PDF Preview */}
      {showPdfPreview && <PDFPreview closeModal={() => setShowPdfPreview(false)} title={title} isUrl={true} url={import.meta.env.VITE_CDN + fileSource} />}
    </>
  );
};

export default FileItem;
