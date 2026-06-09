import styled from "styled-components";
import FormInput from "../input";
import { Filter } from "../list/styles";
import { useSelector } from "react-redux";
import { GetIcon } from "../../../icons";
import Tabs from "../tab";
import { SwitchButton, TabButton, TabContainer } from "./styles";
import { useCallback, useEffect, useState } from "react";
import ListTable from "../list/list";
import { DataItem, Td, Title as DataTitle } from "../list/popup/styles";
import { getValue } from "../list/functions";
import { appTheme } from "../../project/brand/project";
import CustomLabel from "../input/label";
export const ElementContainer = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 0.5rem;
  padding: 0;
  margin-bottom: auto;
  &.custom {
    gap: 10px;
    display: flex;
    padding: 0px 0px 30px 0px;
    flex-wrap: wrap;
  }
  &.column {
    flex-direction: column;
    margin: 0 0px;
    padding-top: 5px;
    flex-wrap: nowrap;
  }
  &.radio {
    margin-top: 10px;
    flex-direction: column;
    gap: 10px;
  }
  &.disabled {
    display: none;
  }
  &.tab-content {
    padding: 0 5px;
    margin: 0;
  }
  &.justify {
    justify-content: space-between;
    overflow: auto;
  }
  &.full {
    grid-column: span 4;
  }
  &.dashitem {
    padding: 16px;
    gap: 5px;
    /* height:388px; */
  }
  &.tiles {
    padding: 0;
    gap: 0;
  }
  &.popup {
    padding: 20px;
    gap: 5px;
  }
  &.form {
    background-color: #f6f8fa !important;
    gap: 20px;
    padding-bottom: 20px;
    /* padding-top: 10px; */
  }
  /* .title {
    font-size: 14px;
    font-weight: 700;
    color: #757575;
    svg {
      color: green;
      margin-right: 2px;
    }
  } */
  .title.has {
    font-weight: normal;
    font-size: 10px;
  }
  &.box {
    border: 1px solid #e2e4e9;
    padding: 0.5em 13px;
    border-radius: 10px;
    position: relative;
    div {
      flex-flow: wrap;
      row-gap: 10px;
      height: auto;
    }
  }
  &.row {
    flex-direction: row;
  }
  &.left {
    justify-content: flex-start;
  }
  &.right {
    justify-content: flex-end;
  }
  &.center {
    justify-content: center;
  }
  &.dashboard {
    display: grid;
    grid-template-columns: 1 1 1 1; /* Four equal columns (25% each) */
    gap: 16px; /* Space between items */
    flex-flow: wrap;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(1, 1fr);
  }
  &.top {
    margin-top: 15px;
  }
  &.bottom {
    margin-bottom: 15px;
  }
  &.small-max {
    width: 500px;
    gap: 0;
  }

  &.double {
    grid-column: span 6; /* 50% width */
    width: auto;
  }
  &.quarter {
    grid-column: span 3; /* 25% width */
    width: auto;
  }

  &.half {
    grid-column: span 6; /* 50% width */
    width: auto;
  }

  &.large {
    grid-column: span 9; /* 75% width */
    width: auto;
  }
  &.full {
    grid-column: span 12; /* 100% width */
  }
  &.form-builder-1 {
    min-width: 344px;
    max-width: 344px;
    background: white;
    border-right: 1px solid ${appTheme.stroke.soft};
    position: absolute;
    top: 0px;
    bottom: 0;
    /* overflow: auto; */
  }
  &.form-builder-2 {
    width: calc(100% - 688px);
    flex-direction: column;
    position: fixed;
    top: 80px;
    padding: 20px;
    bottom: 0;
    left: 344px;
    right: 344px;
    overflow: auto;
    background: #f6f8fa;
  }
  &.form-builder-3 {
    min-width: 344px;
    max-width: 344px;
    flex-direction: column;
    background: white;
    border-left: 1px solid ${appTheme.stroke.soft};
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  &.form-builder-4 {
    width: calc(100% - 344px);
    flex-direction: column;
    position: fixed;
    top: 80px;
    padding: 20px;
    bottom: 0;
    left: 344px;
    right: 344px;
    overflow: auto;
    background: #f6f8fa;
  }
  &.single {
    grid-column: span 12; /* 50% width */
  }

  &.double {
    grid-column: span 6; /* 50% width */
  }
  &.small {
    grid-column: span 3; /* 25% width */
  }

  &.half {
    grid-column: span 6; /* 50% width */
  }

  &.large {
    grid-column: span 9; /* 75% width */
  }
`;
export const ElementParentContainer = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  &.column {
    flex-direction: column;
  }
  &.row {
    flex-direction: row;
  }
  gap: 15px;
  padding: 1em 2em 0.5em;
  margin-bottom: auto;
  &.left {
    justify-content: flex-start;
  }
  &.right {
    justify-content: flex-end;
  }
  &.center {
    justify-content: center;
  }
`;

export const ImageCard = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);

    .overlay {
      opacity: 1;
    }
  }

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 16px;
  opacity: 0;
  transition: opacity 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const SizeLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px;
  margin: 0 8px 0 0;
  border-radius: 4px;
`;

export const ContentCardButton = ({ icon = null, align = "", isDisabled = false, value = "Button", ClickEvent, type = "contet-card" }) => {
  return <FormInput icon={icon} customClass={`custom ${type} ${align}`} disabled={isDisabled} type="button" name="submit" value={value} onChange={ClickEvent} />;
};
export const Button = ({ icon = null, align = "", isDisabled = false, value = "Button", ClickEvent, type = "primary" }) => {
  return <FormInput icon={icon} customClass={`custom ${type} ${align}`} disabled={isDisabled} type="button" name="submit" value={value} onChange={ClickEvent} />;
};
export const LinkButton = ({ icon = null, align = "", isDisabled = false, value = "Button", ClickEvent, type = "primary" }) => {
  return <FormInput icon={icon} customClass={`custom ${type} ${align}`} disabled={isDisabled} type="linkbutton" name="submit" value={value} onChange={ClickEvent} />;
};
export const Select = ({ customClass = "", keyValue = "", info, radioButton, error, defaultValue = "", align = "", apiType = "JSON", selectApi = [{ id: "1", value: "No Item Added" }], isDisabled = false, value = "", label = "Select", onSelect = () => {}, showLabel = true }) => {
  return <FormInput key={keyValue} info={info} radioButton={radioButton} default={defaultValue} apiType={apiType} selectApi={selectApi} customClass={`custom ${align} ${customClass}`} disabled={isDisabled} type="select" error={error} label={label} name="submit" value={value} onChange={onSelect} showLabel={showLabel} />;
};
export const MultiSelect = ({ info, checkBox, error, defaultValue = "", align = "", apiType = "JSON", selectApi = [{ id: "1", value: "No Item Added" }], isDisabled = false, value = [], label = "Select", onSelect = () => {} }) => {
  return (
    <FormInput
      info={info}
      default={defaultValue}
      apiType={apiType}
      selectApi={selectApi}
      customClass={`custom ${align}`}
      disabled={isDisabled}
      type="multiSelect"
      checkboxDesign={checkBox}
      error={error}
      label={label}
      name="submit"
      value={value}
      onChange={(event) => {
        const items = value;
        const index = items.findIndex((item) => item === event.id);
        if (index === -1) {
          // If event._id doesn't exist, push it to the items array
          items.push(event.id);
        } else {
          // If event._id already exists, remove it from the items array
          items.splice(index, 1);
        }
        onSelect(items);
      }}
    />
  );
};
export const IconButton = ({ align = "", icon = `filter`, ClickEvent, label, labelPosition = "right" }) => {
  const themeColors = useSelector((state) => state.themeColors);
  return (
    <Filter className={`align custom ${align}`} theme={themeColors} onClick={ClickEvent}>
      {labelPosition === "left" && label && <span>{label}</span>} <GetIcon icon={icon} /> {labelPosition === "right" && label && <span>{label}</span>}
    </Filter>
  );
};

export const MultiTabs = ({ tabs }) => {
  const [tabsTemp, setTabsTemp] = useState(null);
  // const MemoizedListTable = React.memo(ListTable);

  const tabHandler = useCallback(() => {
    const tempTab = tabs
      .filter((item) => [undefined, "subList", "subTabs", "subItem", "custom", "information", "title", "gallery"].includes(item.type))
      .map((item, index) => ({
        name: `${item.id}-${index}`,
        title: item.title,
        icon: item.icon,
        type: item.type ?? "jsx",
        css: item.type === "information" ? "info" : "",
        content: item.content,
        element: item.tabs?.length ? null : item, // If there are tabs, we set element to null
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

    setTabsTemp(tempTab);
  }, [tabs]);

  useEffect(() => {
    tabHandler();
  }, [tabHandler]);
  return tabsTemp && <Tabs className="custom" tabs={tabsTemp} />;
};
export const TabButtons = ({ tabs, selectedTab, selectedChange = () => {}, direct = false, showContentTab }) => {
  const [tabsTemp, setTabsTemp] = useState(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);

  useEffect(() => {
    setTabsTemp(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);
  }, [showContentTab, tabs]);

  const themeColors = useSelector((state) => state.themeColors);
  return (
    (tabsTemp?.length >= 1 || (tabsTemp?.length > 0 && direct)) && (
      <TabContainer className="custom">
        {tabsTemp?.map((tab, index) => (
          <TabButton theme={themeColors} key={index} className={selectedTab === tab.key} onClick={() => selectedChange(tab.key)}>
            {tab.icon ? <GetIcon icon={tab.icon} /> : ""}
            {tab.title}
          </TabButton>
        ))}
      </TabContainer>
    )
  );
};

export const Switch = ({ align, label, switchValue, switchChange = () => {}, icon = "open-book", showLabel = false }) => {
  const themeColors = useSelector((state) => state.themeColors);
  return (
    <div className={`flex flex-col gap-2 w-full min-w-[150px] max-w-[200px]`}>
      {showLabel && <CustomLabel name={'name'} label={label} required={false} sublabel={""} error={""} />}
      <SwitchButton className={`custom ${align}`} enableBg={themeColors.theme} enableColor={themeColors.theneForeground} active={switchValue} onClick={() => switchChange(!switchValue)}>
        <GetIcon icon={icon} />
      </SwitchButton>
    </div>
  );
};

export const TextBox = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="text" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const ColorPicker = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="color" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const SliderBox = ({ min, max, info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput min={min} max={max} info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="range" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const TextBoxWithButton = ({ success = "", status = false, info, error = "", text = "", icon = null, align = "", placeholder = "", isDisabled = false, value = "", onChange = () => {}, label = "primary", onClick = () => {}, customClass = "", footnote = "", footnoteIcon = "" }) => {
  return <FormInput text={text} success={success} status={status} info={info} error={error} label={label} placeholder={placeholder ?? label} icon={icon} customClass={`custom ${customClass} ${align}`} disabled={isDisabled} type="buttonInput" name="submit" footnote={footnote} footnoteIcon={footnoteIcon} value={value} onClick={onClick} onChange={(e) => onChange(e.target.value)} />;
};
export const NumberBox = ({ addValue = 1, info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput addValue={addValue} info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="number" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const Number = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="number" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const TextArea = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="textarea" name="submit" value={value} onChange={(e) => onChange(e.target.value)} />;
};
export const DateTime = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="datetime" name="submit" value={value} onChange={(e) => onChange(e.toISOString())} />;
};
export const Date = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="date" name="submit" value={value} onChange={(e) => onChange(e.toISOString())} />;
};
export const Time = ({ info, error, icon = null, align = "", isDisabled = false, value = "", onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align}`} disabled={isDisabled} type="time" name="submit" value={value} onChange={(e) => onChange(e.toISOString())} />;
};
export const Checkbox = ({ info, customClass, error, icon = null, align = "", isDisabled = false, value = false, onChange = () => {}, label = "primary" }) => {
  return <FormInput info={info} error={error} label={label} placeholder={label} icon={icon} customClass={`custom ${align} ${customClass}`} disabled={isDisabled} type="checkbox" name="submit" value={value} onChange={(e) => onChange(e)} />;
};
export const Title = ({ info, title = "primary", icon, line = true }) => {
  return <FormInput info={info} line={line} dynamicClass="custom" icon={icon} title={title} type="title" />;
};
export const Info = ({ info, content = "primary" }) => {
  return <FormInput info={info} dynamicClass="custom" content={content} type="info" />;
};
export const DataView = ({ title, value = "", attribute = { type: "text" } }) => {
  const [data] = useState(getValue(attribute, value));
  return (
    <Td className="plain">
      <DataTitle>{title}</DataTitle>
      <DataItem>{data}</DataItem>
    </Td>
  );
};
export const ListTabs = ({ actions, setMessage, setLoaderBox, titleValue, showInfo = false }) => {
  const tabHandler = useCallback(() => {
    const tempTab = actions
      .filter((item) => item.type === "subList" || item.type === "subItem")
      .map((item, index) => ({
        name: `${item.id}-${index}`,
        title: item.title,
        element: <ListTable showInfo={showInfo} viewMode={item.type ?? "subList"} setMessage={setMessage} setLoaderBox={setLoaderBox} parentReference={item?.params?.parentReference} referenceId={0} attributes={item.attributes} {...item.params}></ListTable>,
      }));

    setTabs(tempTab);
  }, [setMessage, setLoaderBox, actions, showInfo]);

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    tabHandler();
  }, [tabHandler]);
  return tabs.length > 0 && <Tabs className="custom" tabs={tabs}></Tabs>;
};
export const TabMenu = ({ tabs, selectedTab, selectedChange = () => {}, direct = false, showContentTab }) => {
  const [tabsTemp, setTabsTemp] = useState(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);

  useEffect(() => {
    setTabsTemp(showContentTab ? tabs.filter((tab) => tab.title === "Elements") : tabs);
  }, [showContentTab, tabs]);

  const themeColors = useSelector((state) => state.themeColors);
  return (
    (tabsTemp?.length >= 1 || (tabsTemp?.length > 0 && direct)) && (
      <TabContainer className="custom tab-menu1">
        {/* <label>SELECT PLATFORM</label> */}
        {tabsTemp?.map((tab, index) => (
          <TabButton theme={themeColors} key={index} className={`tab-menu ${selectedTab === tab.key}`} onClick={() => selectedChange(tab.key)}>
            {tab.icon ? <GetIcon icon={tab.icon} /> : ""}
            {tab.title}
          </TabButton>
        ))}
      </TabContainer>
    )
  );
};

export const Toggle = ({ isEnabled, onToggle, size = "default", disabled = false, title = "", color = "blue" }) => {
  const sizeClasses = {
    small: "h-6 w-12",
    default: "h-7 w-14",
    large: "h-8 w-16",
  };

  const thumbSizeClasses = {
    small: "h-5 w-5",
    default: "h-6 w-6",
    large: "h-7 w-7",
  };

  const translateClasses = {
    small: "translate-x-6",
    default: "translate-x-7",
    large: "translate-x-8",
  };

  const colorClasses = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
  };

  return (
    <button
      className={`relative inline-flex ${sizeClasses[size]} flex-shrink-0 cursor-pointer rounded-full 
        transition-all duration-200 ease-in-out focus:outline-none
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isEnabled ? colorClasses[color] : "bg-gray-200"}`}
      role="switch"
      aria-checked={isEnabled}
      onClick={() => !disabled && onToggle()}
      title={title}
      disabled={disabled}
    >
      <span className="relative inline-block h-full w-full rounded-full">
        <span
          className={`
            absolute top-0.5 left-0.5
            ${isEnabled ? translateClasses[size] : "translate-x-0"}
            ${thumbSizeClasses[size]}
            transform rounded-full bg-white shadow-sm
            transition-transform duration-200 ease-in-out
          `}
        />
      </span>
    </button>
  );
};

export const LabeledToggle = ({ isEnabled, onToggle, label, labelPosition = "right", size = "default", disabled = false, color = "green" }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${labelPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
      <Toggle isEnabled={isEnabled} onToggle={onToggle} size={size} disabled={disabled} color={color} />
      <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>{label}</span>
    </div>
  );
};

export const StatusToggle = ({ isEnabled, onToggle, activeLabel = "Active", inactiveLabel = "Inactive", size = "default", disabled = false }) => {
  return <LabeledToggle isEnabled={isEnabled} onToggle={onToggle} label={isEnabled ? activeLabel : inactiveLabel} size={size} disabled={disabled} color={isEnabled ? "green" : "gray"} />;
};
