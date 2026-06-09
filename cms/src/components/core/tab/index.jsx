import React, { useEffect, useState, startTransition } from "react";
import { InlineMenu, InlineMenuItem, PopIconMenuItem, PopMenuItem, Tab, TabContainer, TabContents, TabHeader, Title } from "./styles";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { GetIcon } from "../../../icons";
import { HLine } from "../dashboard/styles";
import ListTable from "../list/list";
import CrudForm from "../list/create";
import ImageGallery from "../list/imagegallery";
import { CustomPageTemplate } from "../list/custom";
import RenderSubPage from "../../project/router/pages";
import { More } from "../list/styles";
import { Head } from "../list/popup/styles";
import { getData } from "../../../backend/api";
import { DisplayInformations } from "../list/popup/displayinformations";

const Tabs = ({ tabs: tabsData = [], className = "", popupMenu = "horizontal", editData, setMessage, setLoaderBox, openData, parentReference, parents, item, onTabChange = null }) => {
  const [t] = useTranslation();
  const themeColors = useSelector((state) => state.themeColors);
  const [activeTab, setActiveTab] = useState(tabsData[0]?.name);
  const [subActiveTab, setSubActiveTab] = useState(null);
  const [subActiveInlineTab, setSubActiveInlineTab] = useState(null);
  const [openedTab, setOpenedTab] = useState({});
  const [subMenus, setSubMenus] = useState(null);
  // const [additionalMenus, setAdditionalMenus] = useState({});
  const [tabs, setTabs] = useState(tabsData);

  const mainTabChange = (tab) => {
    startTransition(() => {
      setActiveTab(tab.name);
      setOpenedTab((prev) => ({ ...prev, [tab.name]: true }));
      if (tab.tabs?.length > 0) {
        const firstMenuIndex = tab.tabs.findIndex((item) => item.type !== "title");
        setOpenedTab((prev) => ({
          ...prev,
          [tab.tabs[firstMenuIndex].name]: true,
        }));
        setSubMenus(tab.tabs);
        setSubActiveTab(tab.tabs[firstMenuIndex].name);
      } else {
        setSubActiveTab(null);
        setSubMenus(null);
        setSubActiveInlineTab(null);
      }
    });
  };
  const subTabChange = (tab) => {
    startTransition(async () => {
      setSubActiveTab(tab.name);
      setOpenedTab((prev) => ({ ...prev, [tab.name]: true }));

      // Only fetch if we have dynamicTabs config and no existing tabs
      if (tab.dynamicTabs && (!tab.tabs || tab.tabs.length === 0)) {
        try {
          const response = await getData({ [parentReference]: openData?.data?._id }, tab.dynamicTabs.api);

          if (response.status === 200) {
            const newTabs = response.data?.map((itemMenu, index3) => ({
              name: `${itemMenu.id}-${index}-${index3}`,
              title: itemMenu.value,
              type: "subList",
              icon: "",
              css: "",
              element: {
                ...tab.dynamicTabs.template,
                params: {
                  ...tab.dynamicTabs.template.params,
                  shortName: itemMenu.value,
                  preFilter: {
                    instance: itemMenu.id,
                  },
                },
              },
              content: tab.dynamicTabs.template.content,
            }));

            setTabs((prevTabs) =>
              prevTabs.map((prevTab) => {
                if (prevTab.tabs?.length > 0) {
                  return {
                    ...prevTab,
                    tabs: prevTab.tabs.map((subTab) => {
                      if (subTab.dynamicTabs && subTab.name === tab.name) {
                        return {
                          ...subTab,
                          tabs: newTabs,
                        };
                      }
                      return subTab;
                    }),
                  };
                }
                return prevTab;
              })
            );

            setSubMenus((prev) => prev.map((prevItem) => (prevItem.name === tab.name ? { ...prevItem, tabs: newTabs } : prevItem)));
            if (newTabs?.length > 0) {
              setSubActiveInlineTab(newTabs[0].name);
            } else {
              setSubActiveInlineTab(null);
            }
          }
        } catch (error) {
          console.error("Error fetching dynamic tabs:", error);
        }
      } else {
        if (tab.tabs?.length > 0) {
          setSubActiveInlineTab(tab.tabs[0].name);
        } else {
          setSubActiveInlineTab(null);
        }
      }
    });
  };
  const subInlineTabChange = (subTab) => {
    startTransition(() => {
      setSubActiveInlineTab(subTab.name);
      setOpenedTab((prev) => ({
        ...prev,
        [subTab.name]: true,
      }));
    });
  };
  useEffect(() => {
    if (activeTab === null) {
      setActiveTab(tabs[0]?.name);
    }
  }, [tabs, activeTab]);
  useEffect(() => {
    if (onTabChange) {
      // setActiveTab(tabChangeAction);
      console.log(onTabChange);
    }
  }, [onTabChange]);
  const rederInlineMenu = (subTab, index) => {
    return (
      <InlineMenuItem
        key={`${subTab.name}-${index}`} // Updated key
        theme={themeColors}
        className={`${subActiveInlineTab === subTab.name && "active"} ${popupMenu}`}
        onClick={() => {
          subInlineTabChange(subTab);
        }}
      >
        {subTab.icon && <GetIcon icon={subTab.icon}></GetIcon>}
        <span>{t(subTab.title ?? subTab.value)}</span>
      </InlineMenuItem>
    );
  };
  const renderPage = (tab, editData, setMessage, setLoaderBox, openData, parents) => {
    const { element, type, content } = tab;
    if (!element) {
      // console.log(tab);
    }
    return !type ? null : type === "custom" ? (
      <CustomPageTemplate key={tab.name} openData={openData} {...element} themeColors={themeColors} setLoaderBox={setLoaderBox} setMessage={setMessage} content={content ?? RenderSubPage(tab.element, content)}></CustomPageTemplate>
    ) : type === "information" ? (
      <CrudForm key={tab.name} {...editData} css="plain head-hide info" noTabView={true}></CrudForm>
    ) : type === "gallery" ? (
      <ImageGallery key={tab.name} showTitle={element.showTitle} imageSettings={element.imageSettings} api={`${element.api}`} openData={openData} />
    ) : type === "edit" ? (
      <CrudForm key={tab.name} {...editData} css="plain head-hide info"></CrudForm>
    ) : type === "details" ? (
      <TabContainer className="tab">
        <DisplayInformations
          opentThem={content.opentTheme}
          editingHandler={(event) => {
            event.stopPropagation();
            content.isEditingHandler(openData?.data, content.udpateView, content.titleValue);
          }}
          titleValue={content.titleValue}
          popupMenu={popupMenu}
          formMode={content.formMode}
          attributes={openData.attributes}
          data={openData.data}
        />
      </TabContainer>
    ) : type === "jsx" ? (
      content
    ) : (
      element?.attributes && (
        <ListTable
          name={tab.name}
          headerStyle={"sub"}
          icon={element.icon ?? ""}
          showInfo={element.showInfo ?? true}
          viewMode={element.viewMode ?? "table"}
          setMessage={setMessage}
          setLoaderBox={setLoaderBox}
          parentReference={element?.params?.parentReference}
          referenceId={openData?.data?._id}
          attributes={element.attributes}
          {...element.params}
          parents={{
            ...parents,
            [element?.params?.parentReference]: openData?.data?._id,
          }}
        ></ListTable>
      )
    );
  };
  return (
    <TabContainer className={popupMenu}>
      {tabs.length > 0 && (
        <TabHeader className={`sub-menu ${className} ${popupMenu}`}>
          <HLine className={popupMenu}></HLine>
          {tabs.map((tab, index) => {
            return (
              <PopIconMenuItem
                key={`${tab.name}-${index}`} // Updated key
                theme={themeColors}
                className={`${tab.name} ${activeTab === tab.name && "active"}  ${popupMenu}`}
                onClick={() => {
                  mainTabChange(tab);
                }}
              >
                <GetIcon icon={tab.icon}></GetIcon>
                {t(tab.title)}
              </PopIconMenuItem>
            );
          })}
        </TabHeader>
      )}
      {subMenus?.length > 0 && (
        <TabHeader className={`menu secondary-menu ${className} ${popupMenu}`}>
          {subMenus.map((tab, index) => {
            return tab.type === "title" ? (
              <Title key={`${tab.name}-title`} className="flex items-center gap-3">
                <span className="">{t(tab.title)}</span>
              </Title>
            ) : (
              <React.Fragment key={`${tab.name}-${index}`}>
                <PopMenuItem
                  key={`${tab.name}-${index}`}
                  theme={themeColors}
                  className={`${tab.tabs?.length > 0 ? "submenu" : ""} ${subActiveTab === tab.name ? "active" : ""} ${popupMenu}`}
                  onClick={async () => {
                    subTabChange(tab);
                  }}
                >
                  {tab.icon && <GetIcon icon={tab.icon} />}
                  {t(tab.title)} {tab?.length}
                </PopMenuItem>

                {tab.tabs?.length > 0 && tab.name === subActiveTab && <InlineMenu>{tab.tabs?.map((subTab, index) => rederInlineMenu(subTab, index))}</InlineMenu>}
              </React.Fragment>
            );
          })}
        </TabHeader>
      )}
      <TabContents className={`tab-page ${popupMenu} ${subMenus ? "sub-menu" : "menu"}`}>
        {tabs.map((tab, index) => {
          return (
            <React.Fragment key={`${tab.name}-tab-content-${index}`}>
              <Tab className={`${className} ${popupMenu} ${tab.css ?? ""} tab-page `} theme={themeColors} active={subActiveTab === null && activeTab === tab.name}>
                {(openedTab[tab.name] === true || index === 0) && renderPage(tab, editData, setMessage, setLoaderBox, openData, parents)}
              </Tab>
              {tab.tabs?.map((subTab, index1) => (
                <React.Fragment key={`${subTab.name}-${index1}-tab-content`}>
                  <Tab className={`${className} ${popupMenu} ${subTab.css ?? ""} tab-page`} theme={themeColors} key={`${subTab.name}-sub-tab-content`} active={subActiveInlineTab === null && subActiveTab === subTab.name}>
                    {(openedTab[subTab.name] === true || (openedTab[tab.name] === true && index1 === 0)) && renderPage(subTab, editData, setMessage, setLoaderBox, openData, parents)}
                  </Tab>
                  {subTab.tabs?.map((subInlineTab, index2) => (
                    <React.Fragment key={`${subInlineTab.name}-${index2}-sub-sub-tab-content`}>
                      <Tab className={`${className} ${popupMenu} ${subInlineTab.css ?? ""} tab-page`} theme={themeColors} key={`${subInlineTab.name}-${index2}-sub-sub-tab-content-data`} active={subActiveInlineTab === subInlineTab.name}>
                        {(openedTab[subInlineTab.name] === true || (openedTab[subTab.name] === true && index2 === 0)) && renderPage(subInlineTab, editData, setMessage, setLoaderBox, openData, parents)}
                      </Tab>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        })}
      </TabContents>
    </TabContainer>
  );
};

export default Tabs;
