import React, { useEffect, useState, useRef } from "react";
import Layout from "../../../core/layout";
import { Container } from "../../../core/layout/styels";
import { getData, putData } from "../../../../backend/api";
import { GetIcon } from "../../../../icons";
import { dateFormat } from "../../../core/functions/date";
import styled from "styled-components";
//src/components/styles/page/index.js
//if you want to write custom style wirte in above file

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  overflow: hidden;
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    border-radius: 8px;
    box-shadow: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const TableHeader = styled.thead`
  background: #f8fafc;
`;

const TableHeaderRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
`;

const TableHeaderCell = styled.th`
  padding: 20px 8px 15px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #626262;
  border-right: 1px solid #e2e8f0;
  white-space: nowrap;
  background: #f8fafc;

  &:first-child {
    width: 70%;
    min-width: 200px;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
  }

  &:nth-child(2) {
    width: 20%;
    min-width: 120px;
  }

  &:last-child {
    width: 10%;
    min-width: 100px;
    text-align: center;
    border-right: none;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 13px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f1f1;
  transition: background-color 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #f8fafc;
  }

  &:last-child {
    border-bottom: none;

    td:first-child {
      border-bottom-left-radius: 12px;
    }

    td:last-child {
      border-bottom-right-radius: 12px;
    }
  }
`;

const TableCell = styled.td`
  padding: 12px 10px;
  font-size: 14px;
  color: #374151;
  border-right: 1px solid #f1f1f1;
  vertical-align: middle;
  font-weight: normal;
  letter-spacing: -0.006em;

  &:last-child {
    border-right: none;
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 8px 6px;
    font-size: 13px;
  }
`;

const TitleCell = styled(TableCell)`
  font-weight: 500;
  color: #1e293b;
  word-break: break-word;
`;

const DateCell = styled(TableCell)`
  color: #64748b;
  font-size: 13px;
  white-space: nowrap;
`;

const ActionCell = styled(TableCell)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    gap: 2px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #64748b;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin: 0 2px;

  &:hover {
    background: #f1f5f9;
    color: #375dfb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    padding: 2px;
    margin: 0 1px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-size: 1rem;
  color: #6b7280;
`;

const NoDataContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-size: 1rem;
  color: #6b7280;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 0;
  background: transparent;
  border: none;
  width: 100%;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-family: "Inter";
  font-weight: 600;
  color: #000000;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const PageDescription = styled.p`
  font-size: 14px;
  font-family: "Inter";
  color: #525866;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AddButton = styled.button`
  background: #375dfb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 14px;
  font-family: "Inter";
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  height: 32px;
  justify-content: center;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.25rem;
    font-size: 13px;
    width: 100%;
    justify-content: center;
    height: auto;
  }
`;

const CertificateManagement = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Certificate Management - QSC Automation`;
  }, []);

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});
  const [uploading, setUploading] = useState({});
  const [deleting, setDeleting] = useState({});
  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      const response = await getData({}, "certificate-management");
      if (response.data?.success) {
        setCertificate(response.data.response?.[0] || null);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const certificateFields = [
    { key: "hallTicket", label: "Hall Ticket" },
    { key: "examCertificate", label: "Exam Certificate" },
    { key: "stateExamCertificate", label: "State Exam Certificate (Legacy)" },
    { key: "districtExamCertificate", label: "District Exam Certificate (Legacy)" },
    { key: "stateExamCertificateRegular", label: "State Exam — Regular" },
    { key: "stateExamCertificatePrivate", label: "State Exam — Private" },
    { key: "districtExamCertificateRegular", label: "District Exam — Regular" },
    { key: "districtExamCertificatePrivate", label: "District Exam — Private" },
    { key: "affiliationCertificate", label: "Affiliation Certificate" },
  ];

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

  const handleUpload = async (fieldKey, file) => {
    setUploading((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const data = { field: fieldKey, [fieldKey]: file };
      const response = await putData(data, "certificate-management/upsert-field");
      if (response.status === 200 || response.status === 201) {
        await fetchCertificate();
        props.setMessage?.({ content: "Certificate uploaded successfully" });
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      props.setMessage?.({ content: "Error uploading certificate", type: "error" });
    } finally {
      setUploading((prev) => ({ ...prev, [fieldKey]: false }));
      if (fileInputRefs.current[fieldKey]) {
        fileInputRefs.current[fieldKey].value = "";
      }
    }
  };

  const handleFileSelect = (fieldKey) => {
    if (fileInputRefs.current[fieldKey]) {
      fileInputRefs.current[fieldKey].click();
    }
  };

  const handleFileChange = (fieldKey, event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(fieldKey, file);
    }
  };

  const handleDownload = async (fileSource, title, fieldKey) => {
    setDownloading((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const fullUrl = import.meta.env.VITE_APP_CDN + fileSource;
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.${getFileExtension(fileSource)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleDeleteField = async (fieldKey) => {
    setDeleting((prev) => ({ ...prev, [fieldKey]: true }));
    try {
      const response = await putData({ field: fieldKey }, "certificate-management/delete-field");
      if (response.status === 200) {
        await fetchCertificate();
        props.setMessage?.({ content: "Certificate removed successfully" });
      }
    } catch (error) {
      console.error("Error deleting certificate:", error);
      props.setMessage?.({ content: "Error removing certificate", type: "error" });
    } finally {
      setDeleting((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  if (loading) {
    return (
      <Container className="noshadow">
        <LoadingContainer>Loading certificates...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container className="noshadow" style={{ display: "block", flexDirection: "column", padding: "2rem" }}>
      <HeaderContainer>
        <HeaderContent>
          <PageTitle>Certificate Management</PageTitle>
          <PageDescription>Upload, replace, or download certificate templates for each type.</PageDescription>
        </HeaderContent>
      </HeaderContainer>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Certificate Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {certificateFields.map((field) => {
              const fileSource = certificate?.[field.key];
              const hasFile = !!fileSource;
              const fileExtension = hasFile ? getFileExtension(fileSource) : "";
              const fileType = hasFile ? getFileType(fileExtension) : "";
              const isUploading = uploading[field.key] || false;
              const isDownloading = downloading[field.key] || false;
              const isDeleting = deleting[field.key] || false;

              return (
                <TableRow key={field.key}>
                  <TitleCell>{field.label}</TitleCell>
                  <DateCell>
                    {hasFile ? (
                      <>
                        {fileType} {certificate.updatedAt && dateFormat(certificate.updatedAt)}
                      </>
                    ) : (
                      <span style={{ color: "#94a3b8" }}>Not uploaded</span>
                    )}
                  </DateCell>
                  <ActionCell>
                    <input
                      type="file"
                      ref={(el) => (fileInputRefs.current[field.key] = el)}
                      style={{ display: "none" }}
                      accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      onChange={(e) => handleFileChange(field.key, e)}
                    />
                    <ActionButton onClick={() => handleFileSelect(field.key)} disabled={isUploading} title={hasFile ? "Replace Certificate" : "Upload Certificate"}>
                      {isUploading ? <GetIcon icon="reload" size={16} className="animate-spin" /> : <GetIcon icon="add" size={16} />}
                    </ActionButton>
                    {hasFile && (
                      <>
                        <ActionButton onClick={() => handleDeleteField(field.key)} disabled={isDeleting} title="Delete Certificate">
                          {isDeleting ? <GetIcon icon="reload" size={16} className="animate-spin" /> : <GetIcon icon="delete" size={16} />}
                        </ActionButton>
                        <ActionButton onClick={() => handleDownload(fileSource, field.label, field.key)} disabled={isDownloading} title="Download Certificate">
                          {isDownloading ? <GetIcon icon="reload" size={16} className="animate-spin" /> : <GetIcon icon="open" size={16} />}
                        </ActionButton>
                      </>
                    )}
                  </ActionCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Layout(CertificateManagement);
