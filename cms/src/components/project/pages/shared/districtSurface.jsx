import React from "react";
import styled from "styled-components";

export const PageWrap = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderCopy = styled.div`
  h2 {
    margin: 0;
    color: #142749;
    font-size: 24px;
    line-height: 1.1;
  }

  p {
    margin: 6px 0 0;
    color: #6b7d9e;
    font-size: 14px;
    line-height: 1.45;
    max-width: 760px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const OverviewCard = styled.div`
  background: #fff;
  border: 1px solid #e6ebf3;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OverviewTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #607292;
  font-size: 12px;
  font-weight: 600;
`;

const OverviewValue = styled.div`
  color: #142749;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
`;

const OverviewMeta = styled.div`
  color: #6d7f9e;
  font-size: 12px;
  line-height: 1.45;
`;

const ContextBanner = styled.div`
  background: linear-gradient(135deg, #eef4ff 0%, #f9fbff 100%);
  border: 1px solid #d5e1f4;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

const ContextCopy = styled.div`
  color: #1a4993;
  font-size: 14px;
  line-height: 1.5;

  strong {
    color: #142749;
  }

  span {
    display: block;
    font-size: 12px;
    color: #5c73a2;
  }
`;

export const ActionButton = styled.button`
  border: 0;
  border-radius: 12px;
  padding: 10px 14px;
  min-height: 42px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  &.primary {
    background: #1a4993;
    color: #fff;
    box-shadow: 0 10px 18px rgba(26, 73, 147, 0.18);
  }

  &.secondary {
    background: #eef4ff;
    color: #1a4993;
  }

  &.ghost {
    background: #fff;
    color: #4f6488;
    border: 1px solid #dbe3f1;
  }

  &.danger {
    background: #fff5f4;
    color: #b42318;
    border: 1px solid #f3c3bc;
  }
`;

export const DistrictPageHeader = ({ title, description, actions = null }) => (
  <HeaderBar>
    <HeaderCopy>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </HeaderCopy>
    {actions ? <HeaderActions>{actions}</HeaderActions> : null}
  </HeaderBar>
);

export const DistrictOverviewCards = ({ cards = [] }) => (
  <OverviewGrid>
    {cards.map((card) => (
      <OverviewCard key={card.key || card.label}>
        <OverviewTop>
          <span>{card.label}</span>
          {card.icon}
        </OverviewTop>
        <OverviewValue>{card.value}</OverviewValue>
        <OverviewMeta>{card.meta}</OverviewMeta>
      </OverviewCard>
    ))}
  </OverviewGrid>
);

export const DistrictContextBanner = ({ children, action = null }) => (
  <ContextBanner>
    <ContextCopy>{children}</ContextCopy>
    {action}
  </ContextBanner>
);

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 18, 40, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  overflow-y: auto;
  overscroll-behavior: contain;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const ModalCard = styled.div`
  width: min(100%, 1040px);
  max-height: calc(100dvh - 32px);
  background: #fff;
  border-radius: 18px;
  border: 1px solid #e6ebf3;
  padding: 18px;
  box-shadow: 0 22px 60px rgba(11, 24, 52, 0.18);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const ModalTitle = styled.div`
  margin-bottom: 14px;

  h3 {
    margin: 0;
    font-size: 20px;
    color: #13284a;
  }

  p {
    margin: 6px 0 0;
    color: #6b7d9e;
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #e6ebf3;

  h3 {
    margin: 0;
    color: #13284a;
    font-size: 20px;
  }

  p {
    margin: 6px 0 0;
    color: #6b7d9e;
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const CloseButton = styled.button`
  border: 0;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #eef4ff;
  color: #1a4993;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const PdfBody = styled.div`
  min-height: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  iframe {
    border: 0;
    flex: 1;
    min-height: 0;
  }
`;

export const BulkBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  flex: 1;
`;

export const FormGrid = styled.form`
  display: grid;
  gap: 14px;
`;

export const GridForm = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #607292;
  font-size: 12px;
  font-weight: 500;

  input,
  textarea,
  select {
    width: 100%;
    min-height: 42px;
    border: 1px solid #d9e2ef;
    border-radius: 12px;
    background: #fff;
    padding: 10px 12px;
    color: #142749;
    font-size: 14px;
    outline: 0;
    font-family: inherit;
  }

  textarea {
    min-height: 110px;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    border-color: #1a4993;
  }
`;

export const BulkMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: #607292;
  font-size: 13px;

  span {
    color: #13284a;
    font-weight: 700;
  }
`;

export const BulkTableWrap = styled.div`
  min-height: 0;
  flex: 1;
  overflow: auto;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  background: #fbfcff;
`;

export const BulkTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  thead th {
    position: sticky;
    top: 0;
    background: #f8faff;
    color: #607292;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: left;
    padding: 14px 12px;
    border-bottom: 1px solid #e6ebf3;
  }

  tbody td {
    padding: 12px;
    border-bottom: 1px solid #eef2f8;
    color: #13284a;
    font-size: 14px;
  }

  tbody tr:hover {
    background: #eef4ff;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

export const EmptyRow = styled.td`
  padding: 32px 14px;
  color: #6b7d9e;
  text-align: center;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 14px;
  margin-top: 14px;
  border-top: 1px solid #e6ebf3;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PreviewToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
`;

export const PreviewHeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PreviewFilterRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PreviewFilterGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1 1 560px;
`;

export const PreviewFilterField = styled(Field)`
  min-width: 180px;
  flex: 1 1 180px;
`;

export const PreviewSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewStatCard = styled.div`
  border: 1px solid #e6ebf3;
  background: #f8faff;
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PreviewStatLabel = styled.div`
  color: #6d7f9e;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const PreviewStatValue = styled.div`
  color: #13284a;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
`;

export const PreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) minmax(280px, 1.3fr) auto;
  gap: 12px;
  align-items: start;
  padding: 14px;
  border: 1px solid #e6ebf3;
  border-radius: 16px;
  background: #fbfcff;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewIdentity = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PreviewName = styled.div`
  color: #102447;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
`;

export const PreviewSubline = styled.div`
  color: #7082a2;
  font-size: 12px;
  line-height: 1.45;
  word-break: break-word;
`;

export const BadgeWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  background: #f4f7fc;
  color: #49607f;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
`;

export const InteractiveBadge = styled.button`
  border: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 6px 10px;
  background: #eef4ff;
  color: #1a4993;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;

  &:hover {
    background: #dce9ff;
    transform: translateY(-1px);
  }
`;

export const PreviewRowActions = styled.div`
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 980px) {
    justify-content: flex-start;
  }

  @media (max-width: 520px) {
    button {
      width: 100%;
    }
  }
`;

export const PreviewPaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const PreviewPaginationMeta = styled.div`
  color: #6d7f9e;
  font-size: 12px;
  line-height: 1.5;
`;

export const EmptyState = styled.div`
  background: #fff;
  border: 1px dashed #d4ddeb;
  border-radius: 16px;
  padding: 28px 18px;
  text-align: center;
  color: #6d7f9e;
`;