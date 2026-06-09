import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { appTheme } from "../../../project/brand/project";
import { Select } from "../../elements";
import { GetIcon } from "../../../../icons";

// Keep all your existing styled components here (PaginationContainer, PaginationInfo, PaginationControls, RowsPerPage)
const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  position: sticky;
  background-color: ${appTheme.bg.white};
  padding: 10px 0;
  &.pagination-theme-district {
    margin-top: 4px;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid #e6ebf3;
    border-radius: 18px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
  }
`;

const PaginationInfo = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: left;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  .pagination-theme-district & button {
    border-radius: 10px;
  }
  button {
    border: none;
    border-radius: 6px;
    background-color: ${appTheme.bg.white};
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    width: 32px;
    height: 32px;
    padding: 6px;
    gap: 6px;
    border: 1px 0px 0px 0px;
    opacity: 0.9;
    box-shadow: 0px 1px 2px 0px #e4e5e73d;
    border: 1px solid ${appTheme.stroke.soft};
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.006em;
    text-align: center;
    color: ${appTheme.text.main};

    &:disabled {
      background-color: ${appTheme.bg.weak};
      cursor: not-allowed;
    }
    &.plain {
      border: 0;
      background-color: transparent;
      box-shadow: none;
    }
    &:hover:not(:disabled) {
      background-color: ${appTheme.bg.weak};
    }
    svg {
      color: ${appTheme.icon.sub};
    }
  }
`;

const RowsPerPage = styled.div`
  display: flex;
  align-items: center;

  label {
    margin-right: 10px;
  }

  select {
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: white;
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Pagination = ({ totalRows, onClick, perPage, className = "" }) => {
  const rowsPerPageOptions = [...(perPage !== 10 ? [{ id: perPage, value: `Default (${perPage})` }] : []), { id: 10, value: "10 / page" }, { id: 25, value: "25 / page" }, { id: 50, value: "50 / page" }, { id: 100, value: "100 / page" }, { id: 250, value: "250 / page" }];

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(perPage);
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onClick((page - 1) * rowsPerPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (val) => {
    setRowsPerPage(val.id);
    setCurrentPage(1);
    onClick(0, val.id);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Use fewer visible pages on mobile
    const maxVisible = isMobile ? 2 : 4;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);

    // Adjust startPage if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // Add left ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(
        <button key="left-ellipsis" className="plain" onClick={() => handlePageChange(Math.max(1, startPage - maxVisible))}>
          ...
        </button>
      );
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button key={i} onClick={() => handlePageChange(i)} disabled={i === currentPage}>
          {i}
        </button>
      );
    }

    // Add right ellipsis if needed
    if (endPage < totalPages) {
      pageNumbers.push(
        <button key="right-ellipsis" className="plain" onClick={() => handlePageChange(Math.min(totalPages, endPage + 1))}>
          ...
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <PaginationContainer className={className}>
      <PaginationInfo>
        {isMobile ? (
          <span>{currentPage} of {totalPages}</span>
        ) : (
          <>{totalRows} Records • <span>Page </span>{currentPage} of {totalPages}</>
        )}
      </PaginationInfo>
      {rowsPerPage < totalRows && (
        <PaginationControls>
          {totalPages > 2 && (
            <button className="plain" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
              <GetIcon icon={"ArrowDoubleLeft"} />
            </button>
          )}
          {totalPages > 1 && (
            <button className="plain" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <GetIcon icon={"ArrowLeft"} />
            </button>
          )}
          {renderPageNumbers()}
          {totalPages > 1 && (
            <button className="plain" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              <GetIcon icon={"arrowRight"} />
            </button>
          )}
          {totalPages > 2 && (
            <button className="plain" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
              <GetIcon icon={"ArrowRightDoubleIcon"} />
            </button>
          )}
        </PaginationControls>
      )}
      <RowsPerPage>{rowsPerPage && <Select align="auto" value={rowsPerPage} label="" defaultValue={rowsPerPage} onSelect={(value) => handleRowsPerPageChange(value)} selectApi={rowsPerPageOptions} />}</RowsPerPage>
    </PaginationContainer>
  );
};

export default Pagination;
