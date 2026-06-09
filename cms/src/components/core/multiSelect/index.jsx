import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { getData, postData } from "../../../backend/api";
import { SelectBox } from "./styles";
import { GetIcon, TickIcon } from "../../../icons";
import { useTranslation } from "react-i18next";
import { addSelectObject } from "../../../store/actions/select";
import { Cards, ImgBox, TagBox, TagData, TagItem, TagTitle } from "../select/styles";
import { getValue } from "../list/functions";
import { Checkbox, ElementContainer } from "../elements";
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
    <div className="flex items-center justify-center w-full left-0">
      <button type="button" onClick={onRefresh} disabled={isLoading} className="text-[12px] inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Refresh data">
        {isLoading ? <Loader className="w-3 h-3 animate-spin" aria-hidden="true" /> : <RefreshCw className="w-3 h-3" aria-hidden="true" />}
        <span>No data available, click here to refresh!</span>
      </button>
    </div>
  );
};

function MultiSelect(props) {
  const { addNew, setMessage, setLoaderBox } = props;
  const [selectType] = useState(props.radioButton ? "checkbox" : props.selectType ?? "dropdown");
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(() => {
    if (!props.value) return [];
    return Array.isArray(props.value) 
      ? props.value.map(v => typeof v === 'object' ? v : { id: String(v), value: String(v) })
      : [];
  });
  const [options, setOptions] = useState([]);
  const [addNewOpen, setAddNewOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Memoize the query parameters
  const queryParams = useMemo(() => {
    let values = {};
    props.params?.forEach((param) => {
      if (param.dynamic ?? true) {
        const currentValue = props.updateValue?.[param.name] ?? props.formValues?.[param.name] ?? param.value;
        values[param.name] = currentValue;
      } else {
        values[param.name] = param.value;
      }
    });
    return {
      ...(props.updateOn ? { [props.updateOn]: props.updateValue?.[props.updateOn] } : {}),
      searchKey: "",
      limit: props.apiSearch ? 20 : 0,
      ...values,
    };
  }, [props.params, props.updateValue, props.formValues, props.apiSearch, props.updateOn]);

  // Fetch data query with memoized params
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

  // Update options and selected values when query data changes
  useEffect(() => {
    if (queryData) {
      const normalizedOptions = queryData.map(opt => ({
        ...opt,
        id: String(opt.id)
      }));
      setOptions(normalizedOptions);

      // Handle value updates
      if (props.value && props.value.length > 0) {
        const selectedData = props.value
          .map((itemValue) => {
            if (typeof itemValue === 'object' && itemValue.id) {
              return { ...itemValue, id: String(itemValue.id) };
            }
            const foundItem = normalizedOptions.find((dataItem) => String(dataItem.id) === String(itemValue));
            return foundItem ? { id: String(foundItem.id), value: foundItem.value } : null;
          })
          .filter(Boolean);

        setSelectedId(selectedData);
      }
    }
  }, [queryData, props.value]);

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

  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
  };

  const selectRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (!selectRef.current?.contains(event.target)) {
        setOptionsVisible(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const submitHandler = async (data) => {
    setLoaderBox(true);
    addNewMutation.mutate(data);
  };

  if (addNew && addNew.attributes?.length > 0 && !setLoaderBox) {
    return "setLoaderBox";
  }
  const hasIcon = props.icon ? true : false;
  const hasFilter = props.customClass?.includes("filter");
  return (
    <React.Fragment>
      {selectType === "checkbox" ? (
        <ElementContainer ref={selectRef} className={`column box  ${props.customClass}`}>
          <InfoBoxItem info={props.info} />
          <div className={`${selectedId !== null && selectedId.length !== 0 ? "has title" : "title"} ${isLoading ? "loading" : ""}`} onClick={toggleOptions} role="button" tabIndex={0} aria-label={t(props.label)} aria-expanded={optionsVisible} aria-busy={isLoading}>
            {isLoading ? (
              <Loader className="animate-spin" aria-hidden="true" />
            ) : (
              <>
                {selectedId?.length > 0 ? <TickIcon aria-hidden="true" /> : null}
                <span>{`${t(props.label)} ${props.required ? " *" : ""}`}</span>
              </>
            )}
          </div>
          <ElementContainer ref={selectRef} className="left">
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-4" role="status" aria-label="Loading options">
                <Loader className="animate-spin" aria-hidden="true" />
              </div>
            ) : options.length > 0 ? (
              <div role="group" aria-label={t(props.label)}>
                {options.map((option) => {
                  const selectedIndex = selectedId?.findIndex((item) => String(item.id) === String(option.id));
                  return (
                    <Checkbox
                      key={option.id}
                      isDisabled={props.disabled}
                      align="left"
                      label={props.displayValue ? option[props.displayValue] : option.value}
                      onChange={(event) => {
                        const items = selectedId;
                        const index = items.findIndex((item) => String(item.id) === String(option.id));

                        if (index === -1) {
                          items.push(option);
                        } else {
                          items.splice(index, 1);
                        }
                        setSelectedId(items);
                        props.onSelect(items, props.id, props.type);
                      }}
                      value={selectedIndex > -1}
                      aria-checked={selectedIndex > -1}
                    />
                  );
                })}
              </div>
            ) : null}
          </ElementContainer>
          <Footnote {...props} />
          <ErrorLabel error={props.error} info={props.info} />
        </ElementContainer>
      ) : selectType === "dropdown" || selectType === "select" ? (
        <div className={`${props.dynamicClass?.includes("disabled") ? "hidden" : ""}  col-span-12 rounded-md flex flex-col gap-1 min-w-[200px] w-full ${props.customClass?.includes("filter") ? "w-[max-content] max-w-[100%]" : ""}`} role="group" aria-label={t(props.label)}>
          {(props.showLabel ?? true) && (
            <div className="flex items-center gap-2 justify-between">
              <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
              <div className="flex items-center gap-4">
                {addNew && addNew.attributes?.length > 0 && (
                  <button type="button" className="text-primary-base rounded-md w-[max-content] add-new-option flex items-center gap-2 p-0 text-[12px] text-primary cursor-pointer border-gray-200" onClick={() => setAddNewOpen(true)} aria-label={`Add new ${t(props.label)}`}>
                    <GetIcon icon={"add"} aria-hidden="true" />
                    <span>{props.addNew.label ?? "Add New"}</span>
                  </button>
                )}
                {!props.hideSelectAll && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded cursor-pointer"
                      checked={options.length > 0 && selectedId?.length === options.length}
                      onChange={() => {
                        if (selectedId?.length === options.length) {
                          setSelectedId([]);
                          props.onSelect([], props.id, props.type);
                        } else {
                          setSelectedId(options);
                          props.onSelect(options, props.id, props.type);
                        }
                      }}
                      aria-label="Select all options"
                    />
                    <span className="text-[12px] text-gray-600">Select All</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="relative">
            <Select
              isMulti
              isDisabled={props.disabled || isLoading}
              value={selectedId}
              onChange={(selectedOptions) => {
                const normalizedOptions = selectedOptions ? selectedOptions.map(opt => ({
                  ...opt,
                  id: String(opt.id)
                })) : [];
                setSelectedId(normalizedOptions);
                props.onSelect(normalizedOptions, props.id, props.type);
              }}
              options={options}
              getOptionLabel={(option) => {
                if (props.tags) {
                  return (
                    <TagBox>
                      {props.iconImage && <ImgBox src={import.meta.env.VITE_CDN + (props.iconImage.collection.length > 0 ? option[props.iconImage.collection]?.[props.iconImage.item] ?? "" : option[props.iconImage.item])} alt="" aria-hidden="true" />}
                      <TagData>
                        <div>{props.displayValue ? option[props.displayValue] : option.value}</div>
                        {props.tags.map((tag) => (
                          <React.Fragment key={tag.item}>
                            {tag.title.length > 0 && <TagTitle>{`${tag.title}`}</TagTitle>}
                            <TagItem className={tag.type}>{getValue(tag, tag.collection.length > 0 ? option[tag.collection]?.[tag.item] ?? "" : option[tag.item])}</TagItem>
                          </React.Fragment>
                        ))}
                      </TagData>
                    </TagBox>
                  );
                }
                return props.displayValue ? option[props.displayValue] || option.value : option.value;
              }}
              getOptionValue={(option) => String(option.id)}
              isOptionSelected={(option, selectValue) => selectValue.some(selected => String(selected.id) === String(option.id))}
              placeholder={isLoading ? "Loading..." : t(props.placeholder)}
              noOptionsMessage={() => <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />}
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: "100%",
                }),
                control: (base, state) => ({
                  ...base,
                  width: "100%",
                  height: hasFilter ? "32px" : "auto",
                  minHeight: hasFilter ? "32px" : "40px",
                  padding: hasFilter ? "0px 8px" : "0px",
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
                menu: (base) => ({
                  ...base,
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
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? appTheme.bg.weak : state.isFocused ? appTheme.bg.weak : "white",
                  color: state.isSelected ? appTheme.text.main : state.isFocused ? appTheme.text.main : appTheme.text.soft,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontWeight: state.isSelected ? "bold" : "normal",
                  "&:active": {
                    zIndex: 100,
                    fontWeight: "bold",
                    background: appTheme.bg.weak,
                    color: appTheme.text.main,
                  },
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#F3F4F6",
                  borderRadius: "6px",
                  margin: "2px",
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: appTheme.text.sub,
                  padding: "4px",
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: appTheme.text.main,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#E5E7EB",
                    color: appTheme.text.main,
                  },
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: "2px 8px",
                }),
                input: (base) => ({
                  ...base,
                  color: "var(--text)",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#9CA3AF",
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  padding: hasFilter ? "4px" : "8px",
                }),
                clearIndicator: (provided) => ({
                  ...provided,
                  padding: hasFilter ? "4px" : "8px",
                }),
              }}
            />
            {hasIcon && <div className={`z-10 absolute left-3 top-[18px] -translate-y-1/2 pointer-events-none ${hasFilter ? "pt-0" : "pt-1"}`}>{isLoading ? <Loader className="w-4 h-4 text-gray-500 animate-spin" aria-hidden="true" /> : <GetIcon icon={props.icon} className="w-4 h-4 text-gray-500" aria-hidden="true" />}</div>}
          </div>
          <Footnote {...props} />
          <ErrorLabel error={props.error} info={props.info} />
        </div>
      ) : selectType === "card" ? (
        <SelectBox theme={props.theme} className={`custom-select ${optionsVisible ? "open" : "close"} ${props.customClass}  ${props.dynamicClass}`}>
          <InfoBoxItem className={"info-select"} info={props.info} />
          <CustomLabel label={props.label} required={props.required} sublabel={props.sublabel} error={props.error ?? ""} />
          <Cards role="group" aria-label={t(props.label)}>
            {isLoading ? (
              <div className="flex items-center justify-center w-full py-8" role="status" aria-label="Loading options">
                <Loader className="animate-spin" aria-hidden="true" />
              </div>
            ) : options.length > 0 ? (
              options.map((option) => {
                const isSelected = selectedId?.some((item) => String(item.id) === String(option.id));
                return (
                  <SelectableCard
                    type="checkbox"
                    option={option}
                    checked={isSelected}
                    key={option.id}
                    onChange={() => {
                      const items = [...selectedId];
                      const index = items.findIndex((item) => String(item.id) === String(option.id));

                      if (index === -1) {
                        items.push(option);
                      } else {
                        items.splice(index, 1);
                      }
                      setSelectedId(items);
                      props.onSelect(items, props.id, props.type);
                    }}
                    aria-checked={isSelected}
                  />
                );
              })
            ) : (
              <NoDataWithRefresh onRefresh={handleRefresh} isLoading={isLoading} />
            )}
          </Cards>
        </SelectBox>
      ) : null}
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

export default MultiSelect;
