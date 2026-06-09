import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getData, postData } from "../../../backend/api";
import { Button, Cards, ImgBox, SelectBox, Tabs, TagBox, TagItem, TagList, TagTitle } from "./styles";
import { DownIcon, GetIcon } from "../../../icons";
import { useTranslation } from "react-i18next";
import { addSelectObject } from "../../../store/actions/select";
import Search from "../search";
import { getValue } from "../list/functions";
import { Checkbox, ElementContainer } from "../elements";
import { noimage } from "../../../images";
import { RowContainer } from "../../styles/containers/styles";
import InfoBoxItem from "../input/info";
import CustomLabel from "../input/label";
import ErrorLabel from "../input/error";
import Footnote from "../input/footnote";
import SelectableCard from "../input/SelectableCard";
import AutoForm from "../autoform/AutoForm";
import Select from "react-select";
import { appTheme } from "../../project/brand/project";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, RefreshCw } from "lucide-react";

// Create a new NoDataWithRefresh component
const NoDataWithRefresh = ({ onRefresh, isLoading }) => {
  return (
    <div className="flex items-center justify-center w-full text-center">
      <button type="button" onClick={onRefresh} disabled={isLoading} className="text-[12px] inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Refresh data">
        {isLoading ? <Loader className="w-3 h-3 animate-spin" aria-hidden="true" /> : <RefreshCw className="w-3 h-3" aria-hidden="true" />}
        <span>No data available!</span>
      </button>
    </div>
  );
};

function CustomSelect(props) {
  const { addNew, setMessage, setLoaderBox } = props;
  const [addNewOpen, setAddNewOpen] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [updateValue, setUpdateValue] = useState({});
  const [defaultValue] = useState(props.default);
  const [preFill] = useState(props.preFill ?? []);
  const [filter] = useState(props.filter ?? {});
  const [selectedId, setSelectedId] = useState(props.value);
  const [initialized, setInitialized] = useState(false);
  const [selectedValue, setSelectedValue] = useState(props.placeholder);
  const [options, setOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectType] = useState(props.radioButton ? "radio" : props.selectType ?? "dropdown");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const selectRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchKey, setSearchKey] = useState("");

  const toggleOptions = (event) => {
    event.stopPropagation();
    setOptionsVisible(!optionsVisible);
  };

  // Memoize the query parameters
  const queryParams = useMemo(() => {
    let values = {};
    props.params?.forEach((param) => {
      if (param.dynamic ?? true) {
        const currentValue = props.updateValue?.[param.name] ?? props.formValues?.[param.name] ?? param.value;
        // Only include the value if it's different from the default
        values[param.name] = currentValue;
      } else {
        values[param.name] = param.value;
      }
    });
    return {
      searchKey: searchKey,
      limit: props.apiSearch ? 20 : 0,
      ...values,
      ...(props.updateOn ? { [props.updateOn]: props.updateValue?.[props.updateOn] } : {}),
      ...filter,
    };
  }, [props.params, props.updateValue, props.formValues, props.apiSearch, searchKey, filter, props.updateOn]);

  const {
    data: queryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [props.selectApi, queryParams],
    queryFn: async () => {
      if (props.apiType === "API") {
        const response = await getData(queryParams, props.selectApi);
        if (response.status === 200) {
          dispatch(addSelectObject(response.data, props.selectApi));
          return response.data;
        }
        throw new Error(response.customMessage || "Failed to fetch data");
      } else if (props.apiType === "CSV") {
        return props.selectApi.split(",").map((itemValue) => ({
          id: itemValue.trim(),
          value: itemValue.trim().charAt(0).toUpperCase() + itemValue.trim().slice(1),
        }));
      } else if (props.apiType === "JSON") {
        return props.selectApi;
      }
      return [];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update options when query data changes
  useEffect(() => {
    if (queryData) {
      setOptions([...preFill, ...queryData]);
      setInitialized(true);
      try {
        const selected = queryData.find((itemValue) => itemValue.id === selectedId);
        setSelectedValue(selected ? selected.value : props.placeholder);
      } catch {}
    }
  }, [queryData, selectedId, props.placeholder, preFill]);

  // Handle search changes
  const handleChange = (event) => {
    event.stopPropagation();
    if (props.apiSearch) {
      setSearchKey(event.target.value);
    } else {
      setSearchValue(event.target.value);
      const filtered = options.filter((option) => option.value?.toLowerCase().includes(event.target.value.toString().toLowerCase()));
      setFilteredOptions(filtered);
      if (event.target.value.toString() === "") {
        setFilteredOptions([]);
      }
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // Add new mutation
  const addNewMutation = useMutation({
    mutationFn: async (data) => {
      let values = {};
      props.params?.forEach((item) => {
        if (!item.value) {
          item.value = props.formValues?.[item.name] ?? "";
        }
        values[item.name] = item.value;
      });

      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (!key.includes("Array")) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      const response = await postData({ ...values, ...filteredData }, addNew.api);
      if (response.status === 200) {
        return response;
      }
      throw new Error(response.customMessage || "Failed to add new item");
    },
    onSuccess: (response) => {
      if (response?.data.customMessage?.length > 0) {
        setMessage({
          type: 1,
          content: response?.data.customMessage,
          proceed: "Okay",
          icon: "success",
        });
      } else {
        setMessage({
          type: 1,
          content: `The '${props.label}' saved successfully!`,
          proceed: "Okay",
          icon: "success",
        });
      }
      setAddNewOpen(false);
      queryClient.invalidateQueries([props.selectApi]);
    },
    onError: (error) => {
      setMessage({
        type: 1,
        content: error.message || "Something went wrong!",
        proceed: "Okay",
        icon: "error",
      });
    },
    onSettled: () => {
      setLoaderBox(false);
    },
  });

  // Handle update value changes
  useEffect(() => {
    if (props.updateOn) {
      const isObjectEqual = (obj1, obj2) => {
        const keys1 = Object.keys(obj1 ?? {});
        const keys2 = Object.keys(obj2 ?? {});
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          if (obj1[key] !== obj2[key]) {
            return false;
          }
        }
        return true;
      };
      const equal = isObjectEqual(updateValue, props.updateValue);
      if (!equal) {
        setUpdateValue(props.updateValue);
        refetch();
      }
    }
  }, [props.updateValue, updateValue, refetch, props.updateOn]);

  // Handle click outside
  useEffect(() => {
    function handleClick(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        if (!props.listBox) {
          setOptionsVisible(false);
        } else {
          setOptionsVisible(true);
          setInitialized(true);
        }
      }
    }

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [props.listBox]);

  // Calculate the position of the dropdown
  const calculateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Example height of the dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      return spaceBelow >= dropdownHeight ? "down" : spaceAbove >= dropdownHeight ? "up" : "down";
    }
    return "down"; // Default to down if unable to calculate
  };

  const dropdownPosition = calculateDropdownPosition();

  const renderList = () => (
    <div>
      <ul style={{ height: "calc(100dvh - 120px)" }} className={`  options ${optionsVisible ? dropdownPosition : "hide"} pr-1 overflow-auto`}>
        {initialized && (
          <>
            {props.search && !props.disableSearch && options.length > 8 && <Search active={true} key={`search-inside${props.key}`} className="select" title="Search" theme={props.theme} placeholder="Search" value={searchValue} onChange={handleChange} />}
            {props.apiSearch && <Search active={true} key="search-api-2" className={"select " + props.customClass} title="Search" theme={props.theme} placeholder={`Search ${props.placeholder}`} value={searchKey} onChange={handleChange} />}
            {options.length > 0 &&
              (searchValue.length > 0 ? filteredOptions : options).map((option) => (
                <li
                  value={option.id === selectedId}
                  className={option.id === selectedId ? "selected" : ""}
                  key={option.id}
                  onClick={(event) => {
                    event.stopPropagation();
                    const listBox = props.listBox ?? false;
                    if (!listBox) {
                      toggleOptions(event);
                      if (selectedId === option.id) {
                        props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
                        setSelectedValue(props.placeholder);
                        setSelectedId(defaultValue);
                      } else {
                        props.onSelect(option, props.id, props.type);
                        setSelectedValue(option.value);
                        setSelectedId(option.id);
                      }
                    } else {
                      props.onSelect(option, props.id, props.type);
                      setSelectedValue(option.value);
                      setSelectedId(option.id);
                    }
                  }}
                >
                  <span>
                    {props.tags ? (
                      <TagBox>
                        {props.iconImage && (
                          <ImgBox
                            onError={(e) => {
                              e.target.src = noimage; // Hide the image on error
                            }}
                            src={import.meta.env.VITE_CDN + (props.iconImage.collection.length > 0 ? option[props.iconImage.collection]?.[props.iconImage.item] ?? "" : option[props.iconImage.item])}
                          />
                        )}
                        <RowContainer>
                          <TagItem className="title">{props.displayValue ? option[props.displayValue] : option.value}</TagItem>
                          <TagList>
                            {props.tags.map((tag) => (
                              <React.Fragment key={tag.item}>
                                <TagTitle>{`${tag.title.length ? tag.title + ": " : ""}${getValue(tag, tag.collection.length > 0 ? option[tag.collection]?.[tag.item] ?? "" : option[tag.item])}`}</TagTitle>
                              </React.Fragment>
                            ))}
                          </TagList>
                        </RowContainer>
                      </TagBox>
                    ) : props.displayValue ? (
                      option[props.displayValue]
                    ) : option.icon ? (
                      <React.Fragment>
                        <GetIcon icon={option.icon ?? "info"} />
                        <span>{option.value}</span>
                      </React.Fragment>
                    ) : (
                      option.value
                    )}

                    {props.viewButton && (
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          props.viewButton?.callback(option);
                        }}
                      >
                        View Menu
                      </Button>
                    )}
                  </span>
                </li>
              ))}
            {initialized && options.length === 0 && (
              <li className="text-xs" onClick={handleRefresh}>
                <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />
              </li>
            )}
            {addNew && addNew.attributes?.length > 0 && (
              <li onClick={() => setAddNewOpen(true)}>
                <GetIcon icon={"add"}></GetIcon>Add New
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
  const renderRadioOptions = () => (
    <ElementContainer ref={selectRef} className={`column ${props.customClass} ${props.dynamicClass}`}>
      <InfoBoxItem info={props.info} />
      {(props.showLabel ?? true) && <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />}
      <ElementContainer ref={selectRef} className="left radio">
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-4" role="status" aria-label="Loading options">
            <Loader className="animate-spin" aria-hidden="true" />
          </div>
        ) : options.length > 0 ? (
          (searchValue.length > 0 ? filteredOptions : options).map((option) => {
            const isSelected = option.id.toString() === selectedId.toString();
            return (
              <Checkbox
                isDisabled={props.disabled}
                key={option.id}
                align="left"
                customClass="round"
                label={props.displayValue ? option[props.displayValue] : option.value}
                onChange={(event) => {
                  const listBox = props.listBox ?? false;
                  if (!listBox) {
                    if (selectedId === option.id) {
                      props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
                      setSelectedValue(props.placeholder);
                      setSelectedId(defaultValue);
                    } else {
                      props.onSelect(option, props.id, props.type);
                      setSelectedValue(option.value);
                      setSelectedId(option.id);
                    }
                  } else {
                    props.onSelect(option, props.id, props.type);
                    setSelectedValue(option.value);
                    setSelectedId(option.id);
                  }
                }}
                value={isSelected}
              />
            );
          })
        ) : (
          <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />
        )}
      </ElementContainer>
      <Footnote {...props} />
      <ErrorLabel error={props.error} info={props.info} />
    </ElementContainer>
  );
  const renderDropdownOptions = () => (
    <SelectBox key={props.key} theme={props.theme} className={`${props.dynamicClass === "disabled" ? "hidden" : ""} custom-select ${props.listBox ? "list-box" : ""} ${optionsVisible ? "open" : "close"} ${props.customClass} ${props.dynamicClass}`}>
      <InfoBoxItem customClass={"info-select"} info={props.info} />

      {(props.showLabel ?? true) && <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />}
      <button disabled={props.disabled} ref={selectRef} className={`${selectedId !== null && props.value?.length > 0 ? "has" : ""}`} onClick={toggleOptions}>
        {props.value?.toString().length === 0 ? <span>{t(props.placeholder)}</span> : <span>{selectedValue}</span>}
        {!props.disabled && <DownIcon className="down" />}
        <ul className={`options ${optionsVisible ? dropdownPosition : "hide"}`}>
          {((optionsVisible && initialized) || (initialized && props.listBox)) && (
            <>
              {props.search && !props.disableSearch && options.length > 8 && <Search active={true} key={`search-inside${props.key}`} className="select" title="Search" theme={props.theme} placeholder="Search" value={searchValue} onChange={handleChange} />}
              {props.apiSearch && <Search active={true} key="search-api-2" className={"select " + props.customClass} title="Search" theme={props.theme} placeholder={`Search ${props.placeholder}`} value={searchKey} onChange={handleChange} />}
              {options.length > 0 &&
                (searchValue.length > 0 ? filteredOptions : options).map((option) => (
                  <li
                    value={option.id === selectedId}
                    className={option.id === selectedId ? "selected" : ""}
                    key={option.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      const listBox = props.listBox ?? false;
                      if (!listBox) {
                        toggleOptions(event);
                        if (selectedId === option.id) {
                          props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
                          setSelectedValue(props.placeholder);
                          setSelectedId(defaultValue);
                        } else {
                          props.onSelect(option, props.id, props.type);
                          setSelectedValue(option.value);
                          setSelectedId(option.id);
                        }
                      } else {
                        props.onSelect(option, props.id, props.type);
                        setSelectedValue(option.value);
                        setSelectedId(option.id);
                      }
                    }}
                  >
                    <span>
                      {props.tags ? (
                        <TagBox>
                          {props.iconImage && (
                            <ImgBox
                              onError={(e) => {
                                e.target.src = noimage; // Hide the image on error
                              }}
                              src={import.meta.env.VITE_CDN + (props.iconImage.collection.length > 0 ? option[props.iconImage.collection]?.[props.iconImage.item] ?? "" : option[props.iconImage.item])}
                            />
                          )}
                          <RowContainer>
                            <TagItem className="title">{props.displayValue ? option[props.displayValue] : option.value}</TagItem>
                            <TagList>
                              {props.tags.map((tag) => (
                                <React.Fragment key={tag.item}>
                                  <TagTitle>{`${tag.title.length ? tag.title + ": " : ""}${getValue(tag, tag.collection.length > 0 ? option[tag.collection]?.[tag.item] ?? "" : option[tag.item])}`}</TagTitle>
                                </React.Fragment>
                              ))}
                            </TagList>
                          </RowContainer>
                        </TagBox>
                      ) : props.displayValue ? (
                        option[props.displayValue]
                      ) : option.icon ? (
                        <React.Fragment>
                          <GetIcon icon={option.icon ?? "info"} />
                          <span>{option.value}</span>
                        </React.Fragment>
                      ) : (
                        option.value
                      )}

                      {props.viewButton && (
                        <Button
                          onClick={(event) => {
                            event.stopPropagation();
                            props.viewButton?.callback(option);
                          }}
                        >
                          View Menu
                        </Button>
                      )}
                    </span>
                    {option.id === selectedId && <GetIcon className="tick" icon={"checked"}></GetIcon>}
                  </li>
                ))}
              {initialized && options.length === 0 && (
                <li className="text-xs" onClick={handleRefresh}>
                  <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />
                </li>
              )}
              {addNew && addNew.attributes?.length > 0 && (
                <li onClick={() => setAddNewOpen(true)}>
                  <GetIcon icon={"add"}></GetIcon>Add New
                </li>
              )}
            </>
          )}
        </ul>
      </button>
      <Footnote {...props} />
      <ErrorLabel error={props.error} info={props.info} />
    </SelectBox>
  );
  const reactSelectOptions = () => {
    const hasIcon = props.icon ? true : false;
    const hasFilter = props.customClass?.includes("filter");
    const customStyles = {
      container: (provided) => ({
        ...provided,
        width: "100%",
      }),
      control: (provided, state) => ({
        ...provided,
        height: hasFilter ? "32px" : "40px",
        minHeight: hasFilter ? "32px" : "40px",
        padding: hasFilter ? "0px 8px" : "0px",
        width: "100%",
        paddingLeft: hasIcon ? "30px" : "0px",
        borderRadius: hasFilter ? "8px" : "10px",
        fontSize: hasFilter ? "12px" : "14px",
        color: appTheme.text.soft,
        fontWeight: "400",
        borderColor: state.isFocused ? appTheme.stroke.soft : "#e5e7eb",
        border: state.isFocused ? "1px solid " + appTheme.stroke.strong : "1px solid " + appTheme.stroke.soft,
        boxShadow: state.isFocused ? "0px 0px 0px 4px " + appTheme.stroke.soft : "none",
        "&:hover": {
          borderColor: state.isFocused ? appTheme.stroke.strong : appTheme.stroke.soft,
        },
        opacity: isLoading ? 0.7 : 1,
      }),
      placeholder: (provided) => ({
        ...provided,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginTop: "8px",
        zIndex: 100,
      }),
      menuList: (base) => ({
        ...base,
        padding: "8px",
        maxHeight: "250px",
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "2px",
        },
      }),
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? appTheme.bg.weak : state.isFocused ? appTheme.bg.weak : "white",
        color: state.isSelected ? appTheme.text.main : state.isFocused ? appTheme.text.main : appTheme.text.soft,
        fontSize: "14px",
        fontWeight: state.isSelected ? "bold" : "normal",
        cursor: "pointer",
        "&:active": {
          zIndex: 100,
          fontWeight: "bold",
          background: appTheme.bg.weak,
          color: appTheme.text.main,
        },
      }),
      multiValue: (provided) => ({
        ...provided,
        borderRadius: "0.5rem", // 8px
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        borderRadius: "0 0.5rem 0.5rem 0", // 8px on right side
        padding: hasFilter ? "4px" : "8px",
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        padding: hasFilter ? "4px" : "8px",
      }),
      clearIndicator: (provided) => ({
        ...provided,
        padding: hasFilter ? "4px" : "8px",
      }),
    };
    const handleSelect = (option) => {
      const listBox = props.listBox ?? false;
      if (!listBox) {
        if (option) {
          props.onSelect(option, props.id, props.type);
          setSelectedValue(option.value);
          setSelectedId(option.id);
        } else {
          props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
          setSelectedValue(props.placeholder);
          setSelectedId(defaultValue);
        }
      } else {
        props.onSelect(option, props.id, props.type);
        setSelectedValue(option.value);
        setSelectedId(option.id);
      }
    };
    const selectedOption = options.find((option) => option.id === selectedId);

    return (
      <SelectBox key={props.key} theme={props.theme} className={`${props.dynamicClass === "disabled" ? "hidden" : ""} custom-select ${props.listBox ? "list-box" : ""} ${optionsVisible ? "open" : "close"} ${props.customClass} ${props.dynamicClass}`}>
        <div className={`${props.dynamicClass?.includes("disabled") ? "hidden" : ""} col-span-12 rounded-md flex flex-col gap-1 w-full min-w-[150px] ${hasFilter ? "w-[max-content] max-w-[200px]" : ""}`}>
          {(props.showLabel ?? true) && (
            <div className="flex items-center gap-2 justify-between">
              <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
              {addNew && addNew.attributes?.length > 0 && (
                <div className="text-primary-base rounded-md w-[max-content] add-new-option flex items-center gap-2 p-0 text-[12px] text-primary cursor-pointer border-gray-200" onClick={() => setAddNewOpen(true)}>
                  <GetIcon icon={"add"} />
                  {props.addNew.label ?? "Add New"}
                </div>
              )}
            </div>
          )}
          <div className="relative">
            <Select isClearable={props.clearable ?? true} value={selectedOption} onChange={handleSelect} styles={customStyles} placeholder={isLoading ? "Loading..." : props.placeholder} className="w-full" getOptionLabel={(option) => option.value} getOptionValue={(option) => option.id} options={options} isDisabled={isLoading} noOptionsMessage={() => <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />} />
            {hasIcon && <div className={`z-10 absolute left-3 top-[18px] -translate-y-1/2 pointer-events-none ${hasFilter ? "pt-0" : "pt-1"}`}>{isLoading ? <Loader className="w-4 h-4 text-gray-500 animate-spin" aria-hidden="true" /> : <GetIcon icon={props.icon} className="w-4 h-4 text-gray-500" />}</div>}
          </div>
          <Footnote {...props} />
          <ErrorLabel error={props.error} info={props.info} />
        </div>
      </SelectBox>
    );
  };
  const renderTabs = () => (
    <Tabs className="tabs">
      {options.map((option) => (
        <div
          key={option.id}
          onClick={(event) => {
            const listBox = props.listBox ?? false;
            if (!listBox) {
              toggleOptions(event);
              if (selectedId === option.id) {
                props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
                setSelectedValue(props.placeholder);
                setSelectedId(defaultValue);
              } else {
                props.onSelect(option, props.id, props.type);
                setSelectedValue(option.value);
                setSelectedId(option.id);
              }
            } else {
              props.onSelect(option, props.id, props.type);
              setSelectedValue(option.value);
              setSelectedId(option.id);
            }
          }}
          className={selectedId === option.id ? "active tab" : "tab"}
        >
          {option.value}
        </div>
      ))}
    </Tabs>
  );
  const renderCard = () => (
    <SelectBox theme={props.theme} className={`custom-select ${optionsVisible ? "open" : "close"} ${props.customClass} ${props.dynamicClass}`}>
      <InfoBoxItem className={"info-select"} info={props.info} />
      <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
      <Cards>
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-8" role="status" aria-label="Loading options">
            <Loader className="animate-spin" aria-hidden="true" />
          </div>
        ) : options.length > 0 ? (
          (searchValue.length > 0 ? filteredOptions : options).map((option) => {
            const isSelected = option.id.toString() === selectedId?.toString();
            return (
              <SelectableCard
                parentType={props.type}
                id={props.id}
                checked={isSelected}
                type="radio"
                onChange={() => {
                  if (selectedId === option.id) {
                    props.onSelect({ id: defaultValue, value: props.placeholder }, props.id, props.type);
                    setSelectedValue(props.placeholder);
                    setSelectedId(defaultValue);
                  } else {
                    props.onSelect(option, props.id, props.type);
                    setSelectedValue(option.value);
                    setSelectedId(option.id);
                  }
                }}
                option={option}
                key={option.id}
              />
            );
          })
        ) : (
          <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />
        )}
      </Cards>
      <Footnote {...props} />
      <ErrorLabel error={props.error} info={props.info} />
    </SelectBox>
  );
  const renderSelectType = () => {
    switch (selectType) {
      case "radio":
        return renderRadioOptions();
      case "dropdown":
        return reactSelectOptions();
      case "dropdown1":
        return renderDropdownOptions();
      case "tabs":
        return renderTabs();
      case "list":
        return renderList();
      case "card":
        return renderCard();
      default:
        return reactSelectOptions(); // Fallback to dropdown
    }
  };
  const submitHandler = async (data) => {
    setLoaderBox(true);
    addNewMutation.mutate(data);
  };
  if (addNew && addNew.attributes?.length > 0 && !setLoaderBox) {
    return "setLoaderBox";
  }
  return (
    <React.Fragment>
      {renderSelectType()}
      {addNewOpen && addNew && addNew.attributes?.length > 0 && (
        <AutoForm
          useCaptcha={false}
          useCheckbox={false}
          customClass={""}
          description={""}
          formValues={{}}
          formMode={"center"}
          key={"add-new-" + props.name}
          formType={"post"}
          header={"Add New " + props.label}
          css={""}
          formInput={addNew.attributes}
          submitHandler={async (data) => {
            submitHandler(data);
          }}
          button={"Submit"}
          isOpenHandler={(value) => {
            setAddNewOpen(false);
          }}
          isOpen={true}
          plainForm={true}
        ></AutoForm>
      )}
    </React.Fragment>
  );
}

export default CustomSelect;
