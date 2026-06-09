import React, { useState, useEffect, useCallback, useRef } from "react";
import { PopContainer } from "../../../styles/containers/styles";
import { SubPageHeader } from "../../input/heading";
import { DropArea, UploadText, Progess } from "./styles";
import { Button, IconButton } from "../../elements";
import { GetIcon } from "../../../../icons";
import { Bar } from "../../input/styles";
import { bulkUploadData } from "../../../../backend/api";
import { v4 as uuidv4 } from "uuid";
import heic2any from "heic2any";
const formatTime = (milliseconds) => {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)} ms`;
  }
  const seconds = (milliseconds / 1000).toFixed(1);
  return `${seconds} s`;
};
const ImageGallery = ({ openData, viewMode = "", api, imageSettings, showTitle = false }) => {
  // State Management
  const [id, setId] = useState("");
  const [currentApi, setCurrentApi] = useState(api);
  const [images, setImages] = useState([]);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [stoppedIndex, setStoppedIndex] = useState(-1);
  const [overallStatus, setOverallStatus] = useState("idle");
  const [maxTotalSizeMB, setMaxTotalSizeMB] = useState({ uploadedMB: 0, totalMB: 0, uploadedCount: 0, totalCount: 0 });
  const [currentFileName, setCurrentFileName] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [retryTimestamp, setRetryTimestamp] = useState(null);
  const [uploadTimes, setUploadTimes] = useState({
    perFile: {},
    total: 0,
  });

  // Refs
  const fileInputRef = useRef(null);
  const convertedFiles = useRef(new Map());
  const retryTimeoutRef = useRef(null);
  const currentUploadIndex = useRef(-1);
  const uploadStartTimeRef = useRef(null);

  useEffect(() => {
    const uniqueId = uuidv4();
    setId(uniqueId);
    setMaxTotalSizeMB({ uploadedMB: 50, totalMB: 100, uploadedCount: 0, totalCount: 20 });
  }, []);

  useEffect(() => {
    setCurrentApi(api);
  }, [api]);

  const calculateSizes = useCallback(() => {
    const uploadedOriginalSize = images.reduce((total, image) => {
      if (image.status === "uploaded") {
        return total + (image.originalSize || 0);
      }
      return total;
    }, 0);

    const totalOriginalSize = images.reduce((total, image) => total + (image.originalSize || 0), 0);

    return {
      uploadedMB: (uploadedOriginalSize / (1024 * 1024)).toFixed(2),
      totalMB: (totalOriginalSize / (1024 * 1024)).toFixed(2),
    };
  }, [images]);

  const updateImageStatus = useCallback((index, status, processedFile = null) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages[index] = {
        ...updatedImages[index],
        status,
        ...(processedFile && {
          file: processedFile,
          fileSize: processedFile.size,
          convertedSize: processedFile.size,
        }),
      };
      return updatedImages;
    });
  }, []);

  const cleanupFileMemory = useCallback((index) => {
    if (convertedFiles.current.has(index)) {
      const file = convertedFiles.current.get(index);
      if (file instanceof File) {
        try {
          const objectUrl = URL.createObjectURL(file);
          URL.revokeObjectURL(objectUrl);
        } catch (error) {
          console.warn("Error revoking object URL:", error);
        }
      }
      convertedFiles.current.delete(index);
    }

    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      if (updatedImages[index]) {
        const oldFile = updatedImages[index].file;
        if (oldFile instanceof File) {
          try {
            const objectUrl = URL.createObjectURL(oldFile);
            URL.revokeObjectURL(objectUrl);
          } catch (error) {
            console.warn("Error revoking object URL:", error);
          }
        }
        updatedImages[index] = {
          ...updatedImages[index],
          file: undefined,
        };
      }
      return updatedImages;
    });

    if (window.gc) window.gc();
  }, []);

  const cleanupAllFiles = useCallback(() => {
    convertedFiles.current.forEach((file) => {
      if (file instanceof File) {
        try {
          const objectUrl = URL.createObjectURL(file);
          URL.revokeObjectURL(objectUrl);
        } catch (error) {
          console.warn("Error revoking object URL:", error);
        }
      }
    });
    convertedFiles.current.clear();

    setImages((prevImages) =>
      prevImages.map((img) => ({
        ...img,
        file: undefined,
      }))
    );

    if (window.gc) window.gc();
  }, []);

  const processImage = useCallback(async (file) => {
    let processedFile = file;
    let createdImage = null;
    let canvas = null;

    try {
      const isHeicByExtension = /\.(heic|heif)$/i.test(file.name);

      if (isHeicByExtension || file.type === "image/heic" || file.type === "image/heif") {
        const blob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        });

        processedFile = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
          type: "image/jpeg",
        });
      } else if (file.type === "image/jpeg" || file.type === "image/png") {
        createdImage = await createImageBitmap(file);

        if (createdImage.width <= 2000 && createdImage.height <= 2000) {
          processedFile = file;
        } else {
          canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let { width, height } = createdImage;
          const maxDimension = 2000;

          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(createdImage, 0, 0, width, height);

          const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));

          processedFile = new File([blob], file.name, { type: "image/jpeg" });
        }
      }

      return processedFile;
    } catch (error) {
      console.error("Error processing image:", error);
      return file;
    } finally {
      if (createdImage) {
        createdImage.close();
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
        canvas = null;
      }
    }
  }, []);
  const abortControllerRef = useRef(null);
  const stopUpload = useCallback(() => {
    setIsStopping(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort current upload
      updateImageStatus(currentUploadIndex.current, "pending");
    }

    setStoppedIndex(currentUploadIndex.current - 1);
    setIsUploading(false);
    setCurrentFileName("");
    setCurrentAction("");
    setOverallStatus("waiting");
  }, [updateImageStatus]);

  // Modify startUpload with graceful stop
  const startUpload = useCallback(async () => {
    if (isUploading) return;

    // Reset upload times
    setUploadTimes({
      perFile: {},
      total: 0,
    });

    // Mark overall upload start time
    uploadStartTimeRef.current = Date.now();

    setIsUploading(true);
    setIsFailed(false);

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Create new AbortController for this upload session
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    try {
      const startIndex = stoppedIndex >= 0 ? stoppedIndex + 1 : 0;

      for (let i = startIndex; i < images.length; i++) {
        const image = images[i];
        if (image.status === "uploaded") continue;
        const fileStartTime = Date.now();
        try {
          // Step 1: Convert
          setCurrentFileName(image.originalName);
          setCurrentAction("converting");
          updateImageStatus(i, "converting");

          const processedFile = await processImage(image.file);
          convertedFiles.current.set(i, processedFile);

          // Step 2: Upload
          setCurrentAction("uploading");
          updateImageStatus(i, "uploading");

          let formData = new FormData();
          formData.append(imageSettings.fileName, processedFile);
          formData.append("event", openData.data._id);

          // Once we start the upload, let it complete
          const response = await bulkUploadData(formData, currentApi);

          // Once we start the upload, let it complete
          const fileUploadTime = Date.now() - fileStartTime;
          setUploadTimes((prev) => ({
            perFile: {
              ...prev.perFile,
              [image.originalName]: fileUploadTime,
            },
            total: prev.total,
          }));

          if (response.status === 200) {
            updateImageStatus(i, "uploaded");
            currentUploadIndex.current = i;
            cleanupFileMemory(i);
          } else {
            throw new Error("Upload failed");
          }

          if (signal.aborted === true) {
            console.log("Upload aborted");
            setIsStopped(true);
            setIsStopping(false);
            break;
          }
        } catch (error) {
          if (signal.aborted === true) {
            console.log("Upload aborted");
            setIsStopped(true);
            setIsStopping(false);
            break;
          }
          console.error("Processing/Upload error:", error);
          if (signal.aborted !== true) {
            updateImageStatus(i, "failed");
            setIsFailed(true);
            setIsStopped(true);
            stopUpload();
            setIsStopping(false);

            // Set a retry timestamp
            setRetryTimestamp(Date.now() + 3 * 60 * 1000); // 3 minutes from now

            // Setup auto-retry timeout
            retryTimeoutRef.current = setTimeout(() => {
              console.log("Retrying....");
              setReadyToUpload(true);
              setIsFailed(false);
              startUpload();
            }, 3 * 60 * 1000); // 3 minutes
            break;
          }
        }
      }
    } finally {
      // Calculate total upload time
      const totalUploadTime = Date.now() - uploadStartTimeRef.current;
      setUploadTimes((prev) => ({
        ...prev,
        total: totalUploadTime,
      }));
      setIsUploading(false);
      setCurrentFileName("");
      setCurrentAction("");
      setReadyToUpload(false);
      setStoppedIndex(-1);
      setIsStopped(false);

      // Clear abort controller
      abortControllerRef.current = null;
    }
  }, [images, stoppedIndex, stopUpload, processImage, isUploading, updateImageStatus, currentApi, imageSettings.fileName, openData.data._id, cleanupFileMemory]);
  const handleFiles = useCallback(
    async (files) => {
      // Reset all states first
      setImages([]);
      setTotalPhotos(0);
      setIsStopping(false);
      setIsUploading(false);
      setIsFailed(false);
      setIsStopped(false);
      setStoppedIndex(-1);
      setOverallStatus("idle");
      setCurrentFileName("");
      setCurrentAction("");
      setReadyToUpload(false);
      currentUploadIndex.current = -1;

      // Clean up any existing files
      cleanupAllFiles();

      const validTypes = ["image/jpeg", "image/png", "image/heic", "image/heif"];
      const validFiles = Array.from(files).filter((file) => {
        const isHeicByExtension = /\.(heic|heif)$/i.test(file.name);
        return validTypes.includes(file.type) || isHeicByExtension;
      });

      if (validFiles.length === 0) return;

      setTotalPhotos(validFiles.length);

      const newImages = validFiles.map((file) => ({
        file,
        status: "pending",
        originalName: file.name,
        originalSize: file.size,
        fileSize: file.size,
        convertedSize: null,
      }));

      setImages(newImages);
      setReadyToUpload(true);
      setOverallStatus("waiting");
    },
    [cleanupAllFiles]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  useEffect(() => {
    const uploadedCount = images.filter((img) => img.status === "uploaded").length;
    const failedCount = images.filter((img) => img.status === "failed").length;
    const pendingCount = images.filter((img) => ["pending", "converting", "uploading", "waiting"].includes(img.status)).length;

    if (images.length === 0) {
      setOverallStatus("idle");
    } else if (uploadedCount === images.length && images.length > 0) {
      setIsUploading(false);
      setOverallStatus("completed");
    } else if (failedCount > 0) {
      setOverallStatus("waiting");
    } else if (pendingCount > 0 && isUploading) {
      setOverallStatus("uploading");
    }
  }, [images, isUploading]);

  useEffect(() => {
    return () => {
      cleanupAllFiles();
      setImages([]);
    };
  }, [cleanupAllFiles]);

  const totalUploaded = images.filter((image) => image.status === "uploaded").length;
  // const pendingCount = images.filter((img) => img.status === "pending").length;
  const { uploadedMB, totalMB } = calculateSizes();

  const retryFailedUploads = useCallback(() => {
    setReadyToUpload(true);
    setIsFailed(false);
    startUpload();
  }, [startUpload]);

  return (
    <PopContainer className={"data-layout " + viewMode}>
      {showTitle && <SubPageHeader title={"Upload Photos"} line={false} description={"Upload event photos to the gallery for AI-powered sharing and retrieval"} />}

      {images.length > 0 && (
        <Progess viewMode={viewMode}>
          {/* Progress information section */}
          <div className="info">
            <div className="count">
              <strong>
                {totalUploaded} of {totalPhotos} Photos {isUploading || overallStatus === "completed" ? "Uploaded" : "Selected"}
              </strong>
            </div>
            <div className="status">
              <strong>
                {uploadedMB} MB of {totalMB} MB
              </strong>
              {isFailed && retryTimestamp ? (
                <span className="orange">
                  <GetIcon icon={"progress"}></GetIcon> Upload failed, retry in {Math.ceil((retryTimestamp - Date.now()) / 1000)} seconds
                </span>
              ) : isStopping ? (
                <span className="orange">
                  <GetIcon icon={"progress"}></GetIcon> Stopping, it will wait current file to be processed..
                </span>
              ) : isFailed ? (
                <span className="red">
                  <GetIcon icon={"progress"}></GetIcon> Some file has failed
                </span>
              ) : currentFileName ? (
                <span>
                  <GetIcon icon={"progress"} rotate={true}></GetIcon>
                  {currentAction === "converting" ? " Converting: " : " Uploading: "}
                  <strong>{currentFileName}</strong>
                  {uploadTimes.perFile[currentFileName] && <em>{uploadTimes.total > 0 && <span>(Time Taken : {formatTime(uploadTimes.total)})</span>}</em>}
                </span>
              ) : overallStatus === "completed" ? (
                <span className="green">
                  <GetIcon icon={"success"}></GetIcon> All images are uploaded{uploadTimes.total > 0 && <span>(Time Taken : {formatTime(uploadTimes.total)})</span>}
                </span>
              ) : isStopped ? (
                <span className="orange">
                  <GetIcon icon={"pause"}></GetIcon> Upload paused
                </span>
              ) : readyToUpload ? (
                <span>
                  <GetIcon icon={"play"}></GetIcon> Ready to upload
                </span>
              ) : null}
            </div>
            {overallStatus !== "completed" && (
              <Bar>
                <div style={{ width: `${(totalUploaded / totalPhotos) * 100}%` }}></div>
              </Bar>
            )}
          </div>
          <div className="buttons">
            {/* {readyToUpload && !isUploading && pendingCount > 0 && !isStopped && <Button isDisabled={isUploading} value={`Start Upload (${pendingCount} files)`} ClickEvent={startUpload} type="primary" icon="upload" />} */}
            {isUploading && !isFailed && !isStopped && <IconButton icon="pause" ClickEvent={stopUpload} type="warning" />}
            {!isUploading && !isStopping && overallStatus !== "completed" && <Button value={isFailed ? "Retry" : isStopped ? "Resume Upload" : "Start Upload"} ClickEvent={retryFailedUploads} type={isFailed ? "error" : isStopped ? "primary" : "primary"} icon={isFailed ? "reload" : isStopped ? "play" : "play"} />}
            {overallStatus === "completed" && <IconButton value="Done" icon="copy" />}
          </div>
        </Progess>
      )}
      {((!isUploading && !isFailed && !isStopped && images.length === 0) || overallStatus === "completed") && (
        <DropArea onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}>
          <GetIcon icon={"upload"} />
          <UploadText>
            <div>Choose a file or drag & drop it here.</div>
            <div>JPEG, PNG & HEIC formats, up to {maxTotalSizeMB.totalMB - maxTotalSizeMB.uploadedMB} MB.</div>
          </UploadText>
          <Button value="Browse Images" type="secondary" />
          <input ref={fileInputRef} type="file" id="file-input" name={id} multiple onChange={(e) => handleFiles(e.target.files)} style={{ display: "none" }} accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif" />
        </DropArea>
      )}
    </PopContainer>
  );
};

export default ImageGallery;
