import { Header, HeaderBox, Overlay, Page } from "../manage/styles";
import { getValue } from "../functions";
import { GetIcon } from "../../../../icons";
import { Logo } from "./styles";
import Tabs from "../../tab";
import React, { useCallback, useEffect, useState } from "react";
import { RowContainer } from "../../../styles/containers/styles";
import { ProfileImage } from "../styles";
import { IconButton } from "../../elements";
import { noimage, mobLogo } from "../../../../images";
import { PageHeader } from "../../input/heading";
import HeaderActions from "./headerActions";
import SearchMenu from "./SearchMenu";

const Popup = ({ noAnimation = false, openTheme, itemDescription = { type: "", name: "" }, showInfoType = "view", editData, customProfileSource, profileImage, isSingle = false, popupMode = "medium", showInfo, popupMenu, formMode, selectedMenuItem, viewMode, themeColors, openData, setLoaderBox, setMessage, closeModal, itemTitle, updatePrivilege, isEditingHandler, udpateView, parentName, parentIcon, parents = {}, parentReference, headerActions = [] }) => {
  const titleValue = (itemTitle.collection?.length > 0 ? openData?.data?.[itemTitle.collection]?.[itemTitle.name] ?? "" : openData?.data?.[itemTitle.name]) || "Please update the itemTitle.";
  const descriptionValue = (itemDescription.collection?.length > 0 ? openData?.data?.[itemDescription.collection]?.[itemDescription.name] ?? "" : openData?.data?.[itemDescription.name]) || "";

  const tabHandler = useCallback(() => {
    const tempTab = openData.actions
      .filter((item) => ["subList", "subTabs", "subItem", "custom", "information", "title", "gallery"].includes(item.type))
      .map((item, index) => ({
        name: `${item.id}-${index}`,
        title: item.title,
        icon: item.icon,
        type: item.type,
        css: item.type === "information" ? "info" : "",
        content: item.content,
        element: item.tabs?.length ? null : item, // If there are tabs, we set element to null
        dynamicTabs: item.dynamicTabs ?? null,
        tabs: item.tabs
          ?.filter((item) => ["subList", "subTabs", "subItem", "custom", "information", "title", "gallery"].includes(item.type))
          .map((tabItem, index2) => ({
            name: `${tabItem.id}-${index}-${index2}`,
            title: tabItem.title,
            type: tabItem.type,
            icon: tabItem.icon,
            css: tabItem.type === "information" ? "info" : "",
            content: tabItem.content,
            element: tabItem.tabs?.length ? null : tabItem,
            dynamicTabs: tabItem.dynamicTabs ?? null,
            tabs: tabItem.tabs
              ?.filter((item) => ["subList", "subTabs", "subItem", "custom", "information", "title", "gallery"].includes(item.type))
              .map((subTabItem, index3) => ({
                name: `${subTabItem.id}-${index}-${index2}-${index3}`,
                title: subTabItem.title,
                type: subTabItem.type,
                icon: subTabItem.icon,
                css: subTabItem.type === "information" ? "info" : "",
                element: subTabItem,
                content: subTabItem.content,
              })),
          })),
      }));
    showInfo &&
      tempTab.unshift({
        name: `information-${openData.data._id}`,
        title: `${parentName} Details`,
        icon: "info",
        css: "info",
        type: showInfoType === "edit" ? "edit" : "details",
        element: editData,
        editData: editData,
        content: { openTheme, titleValue, updatePrivilege, isEditingHandler, udpateView, formMode },
      });
    setTabs(tempTab);
  }, [formMode, isEditingHandler, titleValue, openTheme, udpateView, updatePrivilege, showInfo, showInfoType, editData, parentName, openData]);

  const [tabs, setTabs] = useState([]);
  const [onTabChange, setOnTabChange] = useState(null);
  useEffect(() => {
    tabHandler();
  }, [tabHandler]);
  return (
    <Overlay className={isSingle ? "plain" : ""}>
      <Page className={`${isSingle ? "plain" : ""} ${popupMode ?? "medium"} popup-child ${noAnimation ? "no-animation" : ""}`}>
        {!isSingle && (
          <Header className={`parent ${popupMenu}`}>
            <Logo src={mobLogo} alt="logo" />
            <HeaderBox className="header-data">
              <div>
                {profileImage ? (
                  <ProfileImage className="full profile-image1">
                    <img
                      src={openData?.data[profileImage] ? (customProfileSource ? "" : import.meta.env.VITE_CDN) + openData?.data[profileImage] : noimage}
                      onError={(e) => {
                        e.target.src = noimage; // Hide the image on error
                      }}
                      alt="Profile"
                    ></img>
                  </ProfileImage>
                ) : (
                  <div className="flex items-center justify-center w-[40px] min-w-[40px] h-[40px] min-h-[40px] mr-2 rounded-md border border-gray-300 ">
                    {" "}
                    <GetIcon icon={parentIcon ?? selectedMenuItem.icon}></GetIcon>
                  </div>
                )}
                {/* <div>
                  <span> {`${getValue(itemTitle, titleValue)}`}</span>
                  <span> {getValue(itemDescription, descriptionValue)}</span>
                </div> */}
                <PageHeader title={getValue(itemTitle, titleValue)} line={false} description={getValue(itemDescription, descriptionValue)} wrap={false}></PageHeader>
              </div>
              <div className="flex-1 flex justify-end pr-4 relative">
                {tabs.length > 0 && <SearchMenu tabs={tabs} onTabChange={setOnTabChange} />}
              </div>
              <div className="flex items-centerjustify-end gap-[10px!important]">
                {headerActions.length === 0 ? null : <HeaderActions openData={openData} actions={headerActions}></HeaderActions>}
                <IconButton icon="back" theme={themeColors} ClickEvent={closeModal}></IconButton>
              </div>
            </HeaderBox>
          </Header>
        )}

        <RowContainer theme={themeColors} className="popup-data">
          {tabs.length > 0 && <Tabs parentReference={parentReference} setLoaderBox={setLoaderBox} setMessage={setMessage} parents={parents} editData={editData} openData={openData} popupMenu={popupMenu} tabs={tabs} onTabChange={onTabChange}></Tabs>}
        </RowContainer>
      </Page>
    </Overlay>
  );
};
export default Popup;
