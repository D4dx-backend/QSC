import React, { useState, useEffect } from "react";
import { GetIcon } from "../../../icons";

const PDFPreview = ({ closeModal, title, pdfFunction, openItemData, isUrl = false, url = "" }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPdfUrl = async () => {
      setIsLoading(true);
      try {
        if (isUrl) {
          setPdfUrl(url);
        } else {
          const url = await pdfFunction(openItemData);
          setPdfUrl(url);
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPdfUrl();
  }, [pdfFunction, openItemData, isUrl, url]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2001] flex items-center justify-center">
      <div className="bg-white rounded-lg w-[800px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-800">{title}</div>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <GetIcon icon="Close" className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-6 min-h-0">
          <div className={`bg-gray-50 rounded-lg shadow-inner relative ${isLoading ? "min-h-[500px]" : "h-full"}`}>
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
                <span className="ml-2 text-gray-600">Generating PDF...</span>
              </div>
            ) : (
              <iframe
                src={pdfUrl}
                className="w-full h-full rounded-lg"
                style={{
                  aspectRatio: "1 / 1.4142", // A4 aspect ratio
                  maxHeight: "calc(90vh - 8rem)", // Account for header and padding
                }}
                title="PDF Preview"
                frameBorder="0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
