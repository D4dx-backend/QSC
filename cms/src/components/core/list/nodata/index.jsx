import styled from "styled-components";
import { GetIcon } from "../../../../icons";
import { AddButton, FileButton } from "../styles";
import { appTheme } from "../../../project/brand/project";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* padding: 64px 0px 10px 0px; */
  text-align: center;
  border-radius: 8px;
  width: Fixed (293px) px;
  height: Hug (264px) px;
  gap: 24px;
  opacity: 0px;
  &.triple {
    grid-column: span 3;
  }
  @media screen and (max-width: 768px) {
    &.hm {
      display: none;
    }
  }
`;
const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.015em;
  text-align: center;
  margin-top: 20px;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.006em;
  text-align: center;
  color: ${appTheme.text.sub};
  margin-bottom: 8px;
`;

const Icon = styled.div`
  border-radius: 50%;
  width: 148px;
  height: 148px;
  gap: 0px;
  opacity: 0px;
  border: 0;
  background-color: #f6f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  > svg:first-child {
    font-size: 80px;
    color: #868c98;
  }
  > svg:nth-child(2) {
    position: absolute;
    top: 5px;
    left: 70%;
  }
  > svg:nth-child(3) {
    position: absolute;
    bottom: 0;
    left: 25%;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  button:nth-child(2) {
    background: ${appTheme.bg.white};
    color: ${appTheme.text.sub};
    border: 1px solid ${appTheme.stroke.soft};
  }
`;

const NoDataFound = ({ shortName, icon = "", addPrivilege, isCreatingHandler, refreshView, bulkUplaod, setShowBulkUplad, className = "", description = null }) => {
  return (
    <Container className={className + "  border rounded-lg p-10 mt-5"}>
      <Icon>
        <GetIcon icon={icon}></GetIcon>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Icon>
      <TextContent>
        <Title>No {shortName} found!</Title>
        <Description>{description ?? "Add a new " + shortName.toLowerCase() + " to get started!"}</Description>
        <ButtonContainer>
          {(addPrivilege ? addPrivilege : false) && (
            <AddButton className="small" onClick={() => isCreatingHandler(true, refreshView)}>
              <GetIcon icon={"add"}></GetIcon>
              <span>Add New {shortName}</span>
            </AddButton>
          )}
          {(bulkUplaod ? bulkUplaod : false) && (
            <AddButton onClick={() => setShowBulkUplad((prev) => !prev)}>
              <GetIcon icon={"upload"}></GetIcon>
              <span>Bulk Upload {shortName}</span>
            </AddButton>
          )}
        </ButtonContainer>
      </TextContent>
    </Container>
  );
};
export const NoBulkDataSelected = ({ icon, download, upload }) => {
  return (
    <Container>
      <Icon>
        <GetIcon icon={icon}></GetIcon>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Icon>
      <TextContent>
        <Title>No file added!</Title>
        <Description>Upload an Excel (.xlsx, .xls files are supported) file, Download template for valid upload!</Description>
        <ButtonContainer>
          <FileButton type="file" accept=".xlsx, .xls" onChange={upload}></FileButton>
          <AddButton onClick={download}>
            <GetIcon icon={"download"}></GetIcon>
            <span>Download Template</span>
          </AddButton>
        </ButtonContainer>
      </TextContent>
    </Container>
  );
};
export const PlainNoData = ({ title, icon, description = "", className }) => {
  return (
    <Container className={className}>
      <Icon>
        <GetIcon icon={icon}></GetIcon>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.8889 8.19449C14.8889 8.19449 7.69444 8.21894 7.69444 15.3889C7.69444 8.21894 0.5 8.19449 0.5 8.19449C0.5 8.19449 7.69444 8.16995 7.69444 1C7.69444 8.16995 14.8889 8.19449 14.8889 8.19449Z" stroke="#868C98" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Icon>
      <TextContent>
        <Title>{title}</Title>
        {description?.length > 0 && <Description>{description}</Description>}
      </TextContent>
    </Container>
  );
};
export default NoDataFound;
