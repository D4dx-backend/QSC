import React, { useEffect, useState } from "react";
import Layout from "../../../core/layout";
import ListTable from "../../../core/list/list";
import { Container } from "../../../core/layout/styels";
import styled from "styled-components";

const TabRow = styled.div`
  display: flex;
  gap: 4px;
  padding: 12px 16px 0;
  border-bottom: 1px solid #e6ebf3;
  background: #fff;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  border: 0;
  background: none;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #607292;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  border-radius: 6px 6px 0 0;
  transition: color 0.15s ease, border-color 0.15s ease;

  &.active {
    color: #1a4993;
    border-bottom-color: #1a4993;
    font-weight: 600;
  }

  &:hover:not(.active) {
    color: #1a4993;
    background: #f0f5ff;
  }
`;

const TabContent = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const Wrap = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
`;

const examTypeAttributes = [
  {
    type: "text",
    placeholder: "Exam Type",
    name: "examType",
    validation: "",
    default: "",
    tag: true,
    label: "Exam Type",
    required: true,
    view: true,
    add: true,
    update: true,
  },
  {
    type: "text",
    placeholder: "Exam Short Name",
    name: "examShortName",
    validation: "",
    default: "",
    tag: true,
    label: "Exam Short Name",
    required: true,
    view: true,
    add: true,
    update: true,
  },
  {
    type: "select",
    apiType: "CSV",
    selectApi: "State,District",
    placeholder: "Exam Level",
    name: "examLevel",
    validation: "",
    default: "District",
    tag: true,
    label: "Exam Level",
    required: true,
    view: true,
    add: true,
    update: true,
    filter: true,
  },
  {
    type: "select",
    apiType: "CSV",
    selectApi: "Regular,Private",
    placeholder: "Exam Category",
    name: "examCategory",
    validation: "",
    default: "Regular",
    tag: true,
    label: "Exam Category",
    required: true,
    view: true,
    add: true,
    update: true,
    filter: true,
  },
];

const userTypeAttributes = [
  {
    type: "text",
    placeholder: "Role",
    name: "role",
    validation: "",
    default: "",
    label: "Role",
    required: true,
    view: true,
    add: true,
    update: true,
  },
  {
    type: "text",
    placeholder: "Display Name",
    name: "roleDisplayName",
    validation: "",
    default: "",
    tag: true,
    label: "Display Name",
    required: true,
    view: true,
    add: true,
    update: true,
  },
];

const syllabusAttributes = [
  {
    type: "text",
    placeholder: "Syllabus",
    name: "syllabus",
    validation: "",
    default: "",
    label: "Syllabus",
    tag: true,
    required: true,
    view: true,
    add: true,
    update: true,
  },
  {
    type: "select",
    placeholder: "Year",
    apiType: "CSV",
    selectApi: "2023, 2024, 2025",
    name: "year",
    validation: "",
    default: "",
    label: "Year",
    tag: true,
    required: true,
    view: true,
    add: true,
    update: true,
  },
  {
    type: "file",
    placeholder: "Attachment",
    name: "attachment",
    validation: "",
    default: "",
    tag: false,
    label: "Attachment",
    required: true,
    view: true,
    add: true,
    update: true,
  },
];

const TABS = [
  { key: "exam-type", label: "Exam Types", api: "exam-type", shortName: "Exam Type", attributes: examTypeAttributes, itemTitle: { name: "examType", type: "text" } },
  { key: "user-type", label: "User Roles", api: "user-type", shortName: "User Role", attributes: userTypeAttributes, itemTitle: { name: "roleDisplayName", type: "text" } },
  { key: "syllabus", label: "Syllabus", api: "syllabus", shortName: "Syllabus", attributes: syllabusAttributes, itemTitle: { name: "syllabus", type: "text" } },
];

const MasterData = (props) => {
  useEffect(() => {
    document.title = "Master Data - QSC Automation";
  }, []);

  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === activeTab) || TABS[0];

  return (
    <Container className="noshadow">
      <Wrap>
        <TabRow>
          {TABS.map((t) => (
            <Tab key={t.key} className={activeTab === t.key ? "active" : ""} onClick={() => setActiveTab(t.key)}>
              {t.label}
            </Tab>
          ))}
        </TabRow>
        <TabContent>
          <ListTable
            key={tab.key}
            api={tab.api}
            itemTitle={tab.itemTitle}
            shortName={tab.shortName}
            formMode="single"
            {...props}
            attributes={tab.attributes}
          />
        </TabContent>
      </Wrap>
    </Container>
  );
};

export default Layout(MasterData);
