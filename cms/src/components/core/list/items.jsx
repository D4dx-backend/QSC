import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table, Button, Td, Tr, AddButton, Filter, Filters, ButtonPanel, ToggleContainer, FilterBox, More, Title, DataItem, Head, TrBody, TableView, TrView, ThView, TdView, TableContaner, ListContainer, PageNumber, ListContainerData, ListContainerBox, ImageRow, DescRow } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { RowContainer } from "../../styles/containers/styles";
import { AddIcon, GetIcon, UploadIcon } from "../../../icons";
import { useNavigate } from "react-router-dom";
import { deleteData, getData, postData, putData } from "../../../backend/api";
// import { ShimmerTable } from "react-shimmer-effects";
// import CrudForm from "./create";
import { addPageObject } from "../../../store/actions/pages";
import FormInput from "../input";
import Manage from "./manage";
import Loader from "../loader";
import Search from "../search";
import SubPage from "./subPage";
import DateRangeSelector from "../daterange";
// import { ToolTip } from "../../styles/list/styles";
import { dateFormat, dateTimeFormat } from "../functions/date";
import { convertMinutesToHHMM, findChangedValues, getValue } from "./functions/index";
import Popup from "./popup";
import Print from "./print/print";
import Highlight from "./highlight";
import Editable from "./editable";
import Details from "./details";
import PopupView from "../popupview";
import { TabContainer } from "./popup/styles";
import ImagePopup from "./image";
import moment from "moment";
import FileItem from "./file";
import { ButtonGroup, IconButton, ImageCard, ImageOverlay, SizeLabel } from "../elements";
import { PageHeader } from "../input/heading";
import Pagination from "./pagination";
import NoDataFound from "./nodata";
import BulkUplaodForm from "./bulkupload";
import CrudForm from "./create";
import { noimage } from "../../../images";
// import { ImageItem } from "./imagegallery/styles";
import ImageGallery from "./imagegallery";
import StatusLabel from "./statusLabel";
import MetricTile from "../metricTile";
import { ListTableSkeleton } from "../loader/shimmer";
import { useToast } from "../toast";
import { getMenuItems, ThreeDotMenu } from "./threedotmenu";
// import styled from "styled-components";
import ExcelJS from "exceljs";
import { Plus, X } from "lucide-react";
import ProfileImage from "./ProfileImage";

const SetTd = React.memo((props) => {
  if (props.viewMode === "table") {
    return <TdView {...props}></TdView>;
  } else {
    return <Td {...props}></Td>;
  }
});
const SetTr = React.memo((props) => {
  if (props.viewMode === "table") {
    return <TrView {...props}></TrView>;
  } else {
    return <Tr {...props}></Tr>;
  }
});

// const CrudForm = React.lazy(() => import("./create"));
const ListItems = React.memo(
  ({
    formTabTheme = "normal",
    imageSettings = {
      fileName: "file",
      image: "file",
      thumbnail: "compressed",
      endpoind: "https://event-hex-saas.s3.amazonaws.com/",
    },
    itemOpenMode = {
      type: "open",
      //callback if custom open action is required
    },
    openTheme = "style1",
    labels = [],
    showTitle = true,
    showFilters = true,
    showPagination = true,
    showHeaderRow = true,
    showHeader = true,
    overflow = "scroll",
    name = "",
    rowLimit = 10,
    isSingle = false,
    icon,
    addLabel = null,
    popupMode = "medium",
    showInfo = true,
    showInfoType = "open",
    customProfileSource = false,
    orientation = "portrait",
    profileImage,
    fileSource = "",
    displayColumn = "single",
    printPrivilege = false,
    formMode = "single",
    formLayout = "",
    formStyle = "",
    parentReference = "_id",
    referenceId = 0,
    actions = [],
    api,
    formView = "normal",
    setMessage,
    attributes = [],
    exportPrivilege = false,
    addPrivilege = false,
    delPrivilege = false,
    showDeleteInDotMenu = true,
    updatePrivilege = false,
    showEditInDotMenu = true,
    clonePrivilege = false,
    showCloneInDotMenu = true,
    shortName = "Item",
    itemTitle = { type: "text", name: "title" },
    highlight = null,
    datefilter = false,
    preFilter = {},
    viewMode = "table",
    popupMenu = "horizontal",
    bulkUplaod = false,
    additionalButtons = [],
    submitButtonText = "Submit",
    updateButtonText = "Update",
    parents = {},
    itemDescription = { type: "datetime", name: "createdAt" },
    lastUpdateDate = null,
    fillType = "API",
    preData = [],
    onFilter = () => {},
    onFilterChange = null,
    headerStyle = "",
    openPage = true,
    showFilter = false,
    description,
    itemOpenInSlug = false,
    isSlug = false,
    headerActions = [],
    enableFullScreen = false,
    surfaceTheme = "",
  }) => {
    // console.log(parentReference, referenceId, parents, preFilter);
    const toast = useToast();
    const [preDataSet] = useState(preData);
    const [fillingType] = useState(fillType);
    const userData = useSelector((state) => state.pages);
    const pagesLoading = useSelector((state) => state.pagesLoading);
    const [dataLoaded, setDataLoaded] = useState(true);
    const [initialCheck, setInitialCheck] = useState(false);
    const [users, setUsers] = useState(null);
    const [date] = useState(new Date().toLocaleString());
    const [id, setId] = useState("");
    const [sortView, setSortView] = useState();
    const [inlineSelect, setInlineSelect] = useState({});
    const [filterElements, setFilterElements] = useState(null);
    const [actionElements, setActionElements] = useState(null);

    useEffect(() => {
      setId(name + "-" + referenceId);
    }, [name, referenceId]); // Empty dependency array ensures this runs only once on mount

    useEffect(() => {
      const alldata = userData[`${api}-${id}`];
      const loading = pagesLoading[`${api}-${id}`] ?? false;
      setLoaderBox(loading);
      setShimmerLoader(loading);
      alldata && setUsers(alldata);

      if (!initialCheck) {
        if (!alldata && !loading) {
          // console.log(alldata);
          setInitialCheck(true);
          setDataLoaded(false);
          setShimmerLoader(true);
        }
      }
    }, [userData, api, pagesLoading, initialCheck, referenceId, id]);

    const [showSublist, setShowSubList] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [currentApi] = useState(`${api}`);
    const [subAttributes, setSubAttributes] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [perPage, setPerPage] = useState(rowLimit);
    const [pageNumber, setPageNumber] = useState(1);
    const [showPageCount, setShowPageCount] = useState(false);
    const [showFilterStatus, setShowFilterStatus] = useState(showFilter ?? false);
    const [count, setCount] = useState(0);
    const [counts, setCounts] = useState({});

    const [editable, setEditable] = useState({});
    const [reset] = useState(0);
    const themeColors = useSelector((state) => state.themeColors);
    const selectedMenuItem = useSelector((state) => state.selectedMenu);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = useState(false);
    const [shimmerLoader, setShimmerLoader] = useState(false);
    /**
     * Function to set the showLoader state.
     * @param {boolean} status The status of the loader.
     */
    const setLoaderBox = (status) => {
      setShowLoader(status);
    };

    function formatSize(size) {
      if (size === null || size === undefined) {
        return "0.0MB";
      }

      // If the size is already less than 1024, assume it's in MB
      if (size < 1024) {
        return `${parseFloat(size).toFixed(2)}MB`;
      }

      // For larger sizes, convert to GB
      const sizeInGB = size / 1024;
      if (sizeInGB >= 1) {
        return `${sizeInGB.toFixed(2)}GB`;
      }

      return `${parseFloat(size).toFixed(2)}MB`;
    }

    const [initialized, setInitialized] = useState(false);
    const [prevCrud, setPrevCrud] = useState("");
    const [formInput, setFormInput] = useState([]);
    const [errroInput, setErrorInput] = useState([]);
    const [addValues, setAddValues] = useState({});
    const [updateId, setUpdateId] = useState("");
    const [updateValues, setUpdateValues] = useState({});
    const [udpateView, setUpdateView] = useState(() => {});
    const [hasFilter, setHasFilter] = useState(false);
    const [filterView, setFilterView] = useState(referenceId !== 0 ? { [parentReference]: referenceId, ...preFilter, ...parents } : { ...preFilter, ...parents });

    const [scrolled, setScrolled] = useState(false);
    const SCROLL_THRESHOLD = 90;

    useEffect(() => {
      // Get the elements
      const elements = document.querySelectorAll(".nopadding, .tab-page");
      // Scroll handler function
      const handleScroll = (event) => {
        const isPassedThreshold = event.target.scrollTop > SCROLL_THRESHOLD;
        // Only update state if it's actually changing to prevent unnecessary re-renders
        setScrolled((prevScrolled) => {
          if (prevScrolled !== isPassedThreshold) {
            return isPassedThreshold;
          }
          return prevScrolled;
        });
      };

      // Add event listeners to all matching elements
      if (elements.length > 0) {
        Array.from(elements).forEach((element) => {
          element.addEventListener("scroll", handleScroll);
        });
      }

      // Cleanup function to remove event listeners
      return () => {
        if (elements.length > 0) {
          Array.from(elements).forEach((element) => {
            element.removeEventListener("scroll", handleScroll);
          });
        }
      };
    }, []);

    useEffect(() => {
      if (filterElements === null && formInput.length > 0) {
        const tempFilterElements = { left: [], right: [], openbox: [] };
        [...formInput]
          .filter((item) => (item.type === "select" && item.filter === null) || item.filter)
          .forEach((item) => {
            const filterPosition = item.filterPosition ?? "openbox";
            if (filterPosition === "left") {
              tempFilterElements.left.push(item);
            } else if (filterPosition === "right") {
              tempFilterElements.right.push(item);
            } else if (filterPosition === "openbox") {
              tempFilterElements.openbox.push(item);
            }
          });
        setFilterElements(tempFilterElements);
      }

      if (actionElements === null && actions.length > 0) {
        const tempActionElements = { dotmenu: [], buttons: [], toggles: [] };
        [...actions]
          .filter((item) => item.type === "callback" || item.element === "action" || item.actionType === "toggle")
          .forEach((item) => {
            const actionType = item.actionType ?? "dotmenu";
            if (actionType === "dotmenu") {
              tempActionElements.dotmenu.push(item);
            } else if (actionType === "button") {
              tempActionElements.buttons.push(item);
            } else if (actionType === "toggle") {
              tempActionElements.toggles.push(item);
            }
          });
        setActionElements(tempActionElements);
      }
    }, [formInput, actions, filterElements, actionElements]);

    useEffect(() => {
      const initialCheck = async () => {
        if (attributes.length > 0) {
          const addValuesTemp = {
            addValues: {},
            updateValues: {},
            viewValues: {},
            errorValues: {},
            filterValues: {},
            sortView: {},
            inlineSelect: {},
          };
          // let tempFilter = false;
          let date = new Date();
          const promises = attributes.map(async (item) => {
            if (item.type === "checkbox" || item.type === "toggle") {
              let bool = JSON.parse(item.default === "false" || item.default === "true" ? item.default : "false");
              if (item.add) {
                addValuesTemp.addValues[item.name] = bool;
              }
              addValuesTemp.updateValues[item.name] = bool;
            } else if (item.type === "datetime" || item.type === "date" || item.type === "time") {
              addValuesTemp.addValues[item.name] = date.toISOString();
              if (item.add) {
                addValuesTemp.addValues[item.name] = item.default === "empty" ? "" : moment(item.default).isValid() ? moment(item.default).toISOString() : date.toISOString();
                // addValuesTemp.updateValues[item.name] = date.toISOString();
              }
              if (item.type === "date" && (item.filter ?? false) === true) {
                // addValuesTemp.filterValues[item.name] = date.toISOString();
                // tempFilter = true;
              }
            } else if (item.type === "image" || item.type === "file") {
              if (item.add) {
                addValuesTemp.addValues[item.name] = [];
              }
              if (item.update) {
                addValuesTemp.updateValues[item.name] = [];
              }
            } else if (item.type === "multiSelect") {
              if (item.add) {
                addValuesTemp.addValues[item.name] = Array.isArray(item.default) ? item.default : [];
              }
              if (item.update) {
                addValuesTemp.updateValues[item.name] = [];
              }
            } else {
              if (item.add) {
                addValuesTemp.addValues[item.name] = item.default;
              }
              addValuesTemp.updateValues[item.name] = item.default;
              if (item.type === "select") {
                addValuesTemp.filterValues[item.name] = item.filterDefault ?? "";
                if (item.inlineAction) {
                  if (!addValuesTemp.inlineSelect[item.name]) {
                    const response = await getData({}, item.selectApi);
                    addValuesTemp.inlineSelect[item.name] = response.data;
                  }
                }
              }
            }
            if (item.sort ?? false) {
              addValuesTemp.sortView[item.name] = addValuesTemp.defaultSort ?? "";
            }
            addValuesTemp.errorValues[item.name] = "";
            addValuesTemp.filterValues["searchkey"] = "";
          });

          await Promise.all(promises);
          if (referenceId !== 0) {
            addValuesTemp.filterValues[parentReference] = referenceId;
          }
          setInlineSelect(addValuesTemp.inlineSelect);
          setSortView(addValuesTemp.sortView);
          setFormInput(attributes);
          setAddValues(addValuesTemp.addValues);
          setErrorInput(addValuesTemp.errorValues);
          setUpdateValues(addValuesTemp.updateValues);
          setFilterView((prevFilterView) => {
            return { ...addValuesTemp.filterValues, ...prevFilterView };
          });
          // setFilter(tempFilter);
          setInitialized(true);
        }
      };
      initialCheck();
    }, [attributes, dispatch, setPrevCrud, prevCrud, setFormInput, setAddValues, setUpdateValues, setFilterView, parentReference, referenceId, setSortView]);

    // Notify parent whenever the active filter changes (e.g. for custom download actions)
    const onFilterChangeRef = useRef(onFilterChange);
    useEffect(() => {
      onFilterChangeRef.current = onFilterChange;
    });
    useEffect(() => {
      if (onFilterChangeRef.current) {
        onFilterChangeRef.current(filterView);
      }
    }, [filterView]);

    // end processing attributes
    useEffect(() => {
      //setLoaderBox(users.isLoading);
      if (currentIndex === 0 && users?.count) {
        setCount(users.filterCount);
        setCounts(users.counts);
        // setTotalCount(users.totalCount);
      }
    }, [users, currentIndex]);

    useEffect(() => {
      if (initialized && !dataLoaded) {
        setDataLoaded(true);
        dispatch(addPageObject(currentApi, currentIndex, { ...filterView, sorting: sortView }, perPage, id, preDataSet, fillingType));
      }
    }, [initialized, currentApi, dataLoaded, currentIndex, dispatch, filterView, sortView, perPage, id, preDataSet, fillingType]);

    useEffect(() => {
      const newPageNumber = Math.ceil((currentIndex + 1) / perPage);
      if (newPageNumber !== pageNumber) {
        setPageNumber(newPageNumber);
      }
    }, [count, currentIndex, perPage, pageNumber]);

    const refreshView = useCallback(
      (currentIndex) => {
        try {
          dispatch(addPageObject(currentApi, currentIndex, { ...filterView, sorting: sortView }, perPage, id, preDataSet, fillingType));
        } catch (error) {
          console.error("Error dispatching addPageObject:", error);
        }
      },
      [dispatch, currentApi, filterView, perPage, id, preDataSet, sortView, fillingType]
    );
    const refreshUpdate = (refresh = true, index = 0, update = {}) => {
      try {
        if (refresh) {
          dispatch(addPageObject(currentApi, currentIndex, { ...filterView, sorting: sortView }, perPage, id, preDataSet, fillingType));
        } else {
          const usetTemp = { ...users };
          const usetDataTemp = [...usetTemp.response];
          const current = usetDataTemp[index];
          usetDataTemp[index] = { ...current, ...update };
          usetTemp.response = usetDataTemp;
          setUsers(usetTemp);
        }
      } catch (err) {
        console.log("error", err);
      }
    };
    const [lastUpdatedDate, setLastUpdatedDate] = useState(lastUpdateDate);
    useEffect(() => {
      setLastUpdatedDate(lastUpdateDate);
    }, [lastUpdateDate]);

    useEffect(() => {
      if (lastUpdatedDate) {
        refreshView(0);
      }
    }, [lastUpdatedDate, refreshView]);
    const [isOpen, setIsOpen] = useState(false);
    const [detailView] = useState(false);
    const [isPrint, setIsPrint] = useState(false);
    const [printData, setPrintData] = useState([]);
    const [openData, setOpenData] = useState({});
    //crud functions
    const [showBulkUplad, setShowBulkUplad] = useState(false);
    const [showMobileActions, setShowMobileActions] = useState(false);
    const [showExport, setShowExport] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const mobileMenuRef = useRef(null);

    // Click outside handler for mobile actions menu
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
          setShowMobileActions(false);
        }
      };

      if (showMobileActions) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showMobileActions]);

    const isCreatingHandler = (value, callback) => {
      setIsCreating((prevIsCreating) => {
        if (prevIsCreating) {
          setUpdateView(() => callback);
          navigate({}, "", window.location.pathname);
          return false; // Set to false
        } else {
          window.location.hash = "add";
          return true; // Set to true
        }
      });
    };
    const [isEditing, setIsEditing] = useState(false);
    const setEditingData = (value, updateValuesTemp) => {
      formInput.forEach((item) => {
        let itemValue = item.collection?.length > 0 && item.showItem?.length > 0 ? value[item.collection]?.[item.showItem] : value[item.name] ?? "";
        if (item.showSubItem) {
          itemValue = item.collection?.length > 0 && item.showItem?.length > 0 ? value[item.collection][item.showItem][item.showSubItem] ?? "" : value[item.name];
        }
        if (item.update || item.view) {
          if (item.type === "checkbox" || item.type === "toggle") {
            let bool = value[item.name]?.toString() === "true" ? true : false;
            updateValuesTemp[item.name] = bool;
          } else if (item.type === "number") {
            updateValuesTemp[item.name] = parseFloat(itemValue);
          } else if (item.type === "select") {
            updateValuesTemp[item.name] = typeof itemValue === "undefined" ? "" : typeof itemValue === "string" || typeof itemValue === "number" || typeof itemValue === "boolean" ? itemValue : value[item.name]?._id ? value[item.name]._id : "";
          } else if (item.type === "multiSelect") {
            try {
              if (item.apiType === "API") {
                updateValuesTemp[item.name] = value[item.name].map((obj) => obj._id);
              } else {
                updateValuesTemp[item.name] = value[item.name].map((obj) => obj);
              }
            } catch (error) {
              updateValuesTemp[item.name] = [];
            }
          } else if (item.type === "image") {
            if (item.multiple) {
              updateValuesTemp["old_" + item.name] = value[item.name] ? value[item.name] : [];
              updateValuesTemp["delete_" + item.name] = [];
              updateValuesTemp[item.name] = [];
            } else {
              updateValuesTemp["old_" + item.name] = value[item.name] ? value[item.name] : null;
              updateValuesTemp[item.name] = null;
            }
          } else if (item.name === "authenticationId") {
            updateValuesTemp[item.name] = { number: value[item.name], country: parseInt(value["phoneCode"] ?? 91), numberLength: parseInt(value?.formData?.PhoneNumberLength ?? 10) };
          } else {
            updateValuesTemp[item.name] = itemValue ? itemValue : "";
          }
        }
      });
      updateValuesTemp["_id"] = value._id;
      return updateValuesTemp;
    };

    const isEditingHandler = (value, callback, titleValue, clone = false, view = false) => {
      setLoaderBox(true);
      if (!isEditing) {
        if (!clone) {
          setUpdateView(() => callback);
          let updateValuesTemp = {};
          setUpdateId(value._id);
          setEditingData(value, updateValuesTemp);
          updateValuesTemp["_id"] = value._id;
          updateValuesTemp["clone"] = clone;
          updateValuesTemp["_title"] = titleValue;
          setUpdateValues(updateValuesTemp);
          if (!view) {
            setIsEditing(true);
          }

          window.location.hash = "edit";
        } else {
          updateHandler({ id: value._id, _title: titleValue, clone: true });
        }
      } else {
        setUpdateId("");
        navigate({}, "", window.location.pathname);
        setIsEditing(false);
      }
      setLoaderBox(false);
    };
    const deleteHandler = async (item, id = "") => {
      await deleteData({ id }, currentApi, dispatch, navigate)
        .then((response) => {
          if (response.status === 200) {
            if (response.customMessage?.length > 0) {
              toast.success(response.customMessage);
            } else {
              toast.success(`The '${item.title ? item.title : shortName}' deleted successfully!`);
            }
            setCount((count) => count - 1);
            setIsCreating(false);
            refreshView(currentIndex);
            // udpateView(0);
          } else if (response.status === 404) {
            if (response.customMessage?.length > 0) {
              toast.error(response.customMessage);
            } else {
              toast.error("User not found!");
            }
          } else {
            if (response.customMessage?.length > 0) {
              toast.error(response.customMessage);
            } else {
              toast.error("Something went wrong!");
            }
          }
          setLoaderBox(false);
        })
        .catch((error) => {
          toast.error(error.message + "Something went wrong!");
          setLoaderBox(false);
        });
    };
    const [action, setActions] = useState([]);
    const openAction = (item, data) => {
      // Actions Window
      setActions({ item, data });
      // setMessage({ type: 1, content: item.title + " / " + data._id, proceed: "Okay" });
    };
    const submitHandler = async (data) => {
      setLoaderBox(true);

      const saveData = referenceId === 0 ? { ...data } : { ...data, [parentReference]: referenceId };

      // Filter and remove keys that have "*Array"
      const parentData = { ...parents, _id: null };
      const filteredData = Object.keys(saveData).reduce((acc, key) => {
        if (!key.includes("Array")) {
          acc[key] = saveData[key];
        }
        return acc;
      }, {});
      await postData({ ...parentData, ...filteredData }, currentApi)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            if (response?.data.customMessage?.length > 0) {
              toast.success(response?.data.customMessage);
            } else {
              toast.success(`The '${shortName}' saved successfully!`);
            }
            setIsCreating(false);
            setCurrentIndex(0);
            refreshView(0);
            // udpateView(0);
          } else if (response.status === 404) {
            if (response?.data.customMessage?.length > 0) {
              toast.error(response?.data.customMessage);
            } else {
              toast.error("User not found!");
            }
          } else {
            console.log(response);
            if (response.customMessage?.length > 0) {
              toast.error(response.customMessage);
            } else {
              toast.error("Something went wrong!");
            }
          }
          setLoaderBox(false);
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.message + "Something went wrong!");
          setLoaderBox(false);
        });
    };
    useEffect(() => {
      if (users?.data?.response) {
        const data = users?.data?.response.find((item) => item._id === updateId);
        if (data) {
          setOpenData((prev) => ({ ...prev, data: data }));
          setSubAttributes((prev) => ({ ...prev, data: data }));
        }
      }
    }, [users, isEditing, updateId, setOpenData, setSubAttributes]);
    const updateHandler = async (data, formInput, oldData) => {
      setLoaderBox(true);
      let status = false;
      // console.log({ data, formInput, oldData });

      const updatedItems = findChangedValues(oldData, data);
      const dataChanged = { ...updatedItems.changedObject, id: data._id };

      try {
        const response = await putData(dataChanged, `${currentApi}`);

        if (response.status === 200) {
          if (response?.data.customMessage?.length > 0) {
            toast.success(response?.data.customMessage);
          } else {
            toast.success(`The '${data._title ?? shortName}' ${data.clone ? "cloned" : "updated"} successfully!`);
          }
          refreshView(currentIndex);
          setIsEditing(false);
        } else if (response.status === 404) {
          if (response?.data.customMessage?.length > 0) {
            toast.error(response?.data.customMessage);
          } else {
            toast.error("User not found!");
          }
        } else {
          console.log("Error", response);
          if (response.customMessage?.length > 0) {
            toast.error(response.customMessage);
          } else {
            toast.error("Something went wrong!");
          }
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoaderBox(false);
      }

      return status; // Return the status at the end of the function
    };

    const filterChange = useCallback(
      (option, name, type, parentFilter = false) => {
        if (!parentFilter) {
          const updateValue = {
            ...filterView,
            [name]: type === "multiSelect" ? option.map((item) => item.id) : type === "select" ? option.id : type === "date" ? option?.toISOString() : "",
          };
          setFilterView(updateValue);
          setDataLoaded(false);
        } else {
          onFilter({
            [name]: type === "select" ? option.id : type === "date" ? option?.toISOString() : "",
          });
        }
        // updating the form values
      },
      [filterView, onFilter]
    );

    const dateRangeChange = (item) => {
      const startDate = new Date(item?.startDate);
      startDate.setHours(0, 0, 0, 0); // Set start date to 00:00

      const endDate = new Date(item?.endDate);
      endDate.setHours(23, 59, 59, 999); // Set end date to 23:59
      const udpateValue = {
        ...filterView,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      // updating the formm values
      setFilterView(udpateValue);
    };
    const closeManage = () => {
      setActions([]);
    };
    const generateDescription = useCallback(() => {
      const actions = [];
      if (description) {
        return description;
      }
      const TempShortName = shortName.toLowerCase();

      if (addPrivilege) {
        actions.push("add");
      }
      if (updatePrivilege) {
        actions.push("edit");
      }
      if (delPrivilege) {
        actions.push("delete");
      }
      if (clonePrivilege) {
        actions.push("clone");
      }
      if (exportPrivilege) {
        actions.push("export");
      }

      if (actions.length === 0) {
        return ``;
      }

      // Limit the number of displayed actions
      const maxActionsToShow = 3;
      const displayedActions = actions.slice(0, maxActionsToShow);

      // Preparing the final description
      let descriptionText = `You can ${displayedActions.join(", ")}`;

      // Add ellipsis for additional actions if truncated
      if (actions.length > maxActionsToShow) {
        descriptionText += `, or take additional actions on `;
      }

      // Determining the correct plural form
      let itemLabel = TempShortName;
      if (displayedActions.length > 1 && !TempShortName.endsWith("s")) {
        itemLabel += "s"; // Only add 's' if the last letter is not 's'
      }

      descriptionText += ` ${itemLabel}`;
      return descriptionText;
    }, [shortName, addPrivilege, description, updatePrivilege, delPrivilege, clonePrivilege, exportPrivilege]); // Dependencies

    const TableRowWithActions = React.memo(({ attributes, data, slNo, inlineSelectData = {} }) => {
      const titleValue = (itemTitle.collection?.length > 0 ? (data[itemTitle.collection] ? data[itemTitle.collection][itemTitle.name] : "NIl") : data[itemTitle.name]) ?? shortName;
      const signleRecord = viewMode === "list" || viewMode === "subList" || viewMode === "table" || viewMode === "files" ? false : true;

      const ActionDiv = (
        <React.Fragment key={`actions-${shortName}-${data._id}`}>
          {actionElements?.buttons?.map((item, index) => {
            let status = true;
            if (item.condition) {
              if (Array.isArray(item.condition.if)) {
                // Handle array of conditions
                const matchFound = item.condition.if.some((conditionValue) => conditionValue?.toString() === data[item.condition.item]?.toString());
                status = matchFound ? item.condition.then : item.condition.else;
              } else {
                // Handle single condition
                status = data[item.condition.item]?.toString() === item.condition.if?.toString() ? item.condition.then : item.condition.else;
              }
            }
            return (
              (item.element === "action" || item.type === "callback") &&
              status && (
                <Button
                  theme={themeColors}
                  key={`custom-${item.id + "-" + index}-${data._id}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (item.type === "callback") {
                      item.callback(item, data, refreshUpdate, slNo);
                    } else if (item.type === "call") {
                      window.location.href = `tel:${data.mobileNumber}`;
                    } else if (item.type === "subList" || item.type === "subItem") {
                      setSubAttributes({ item, data });
                      setShowSubList(true);
                    } else {
                      openAction(item, data);
                    }
                  }}
                  className="edit menu callBack button"
                >
                  <GetIcon icon={item.icon} />
                  <span>{item.title}</span>
                </Button>
              )
            );
          })}
          {actionElements?.toggles?.map((item, index) => {
            return (
              <ToggleContainer key={`${item.id}-${data._id}`}>
                <div
                  key={`${item.id}-${data._id}`}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                  role="switch"
                  onClick={async (event) => {
                    event.stopPropagation();
                    setLoaderBox(true);
                    await postData({ status: !data[item.dataKey] }, `${item.api}/${data._id}`, dispatch, navigate)
                      .then((response) => {
                        if (response.status === 200) {
                          if (response.data?.message) {
                            toast.success(response.data?.message);
                          }
                          refreshUpdate(false, currentIndex, { [item.dataKey]: !data[item.dataKey] });
                        } else if (response.status === 404) {
                          refreshUpdate(false, currentIndex, { [item.dataKey]: data[item.dataKey] });
                          toast.error("Something Went Wrong!");
                        } else {
                          refreshUpdate(false, currentIndex, { [item.dataKey]: data[item.dataKey] });
                          toast.error("Something Went Wrong!");
                        }
                      })
                      .catch((error) => {
                        alert(error);
                      });
                  }}
                  aria-checked={data[item.id]}
                  aria-label={`Toggle ${item.label || "option"}`}
                >
                  <input type="checkbox" checked={data[item.dataKey]} readOnly className="peer sr-only" />
                  <div
                    className={`
                      pointer-events-none absolute h-full w-full rounded-full
                      transition-colors duration-200 ease-in-out
                      ${data[item.dataKey] ? "bg-primary-base" : "bg-gray-200"}
                      peer-focus:ring-2 peer-focus:ring-primary-500 peer-focus:ring-offset-2
                      peer-disabled:cursor-not-allowed peer-disabled:opacity-50
                    `}
                  />
                  <div
                    className={`
                      pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full
                      shadow-sm ring-0 transition-transform duration-200 ease-in-out
                      bg-white
                      ${data[item.dataKey] ? "translate-x-5" : "translate-x-0"}
                      peer-disabled:cursor-not-allowed peer-disabled:opacity-50
                    `}
                  />
                </div>
              </ToggleContainer>
            );
          })}
          {updatePrivilege && !showEditInDotMenu && (
            <More
              className="callBack"
              theme={themeColors}
              onClick={(event) => {
                event.stopPropagation();
                isEditingHandler(data, udpateView, titleValue);
              }}
            >
              <GetIcon icon={"edit"} />
              <span>Edit</span>
            </More>
          )}
          {delPrivilege && !showDeleteInDotMenu && (
            <More
              className="callBack"
              theme={themeColors}
              onClick={(event) => {
                event.stopPropagation();
                setMessage({
                  type: 2,
                  content: `Do you want to delete '${getValue({ type: itemTitle.type ?? "text" }, titleValue) ? getValue({ type: itemTitle.type ?? "text" }, titleValue) : "Item"}'?`,
                  proceed: "Delete",
                  onProceed: async () => {
                    await deleteHandler(data, data._id);
                    return true;
                  },
                  data: data,
                });
              }}
            >
              <GetIcon icon={"delete"} />
              <span>Delete</span>
            </More>
          )}
          {signleRecord && (
            <More
              className="callBack"
              theme={themeColors}
              onClick={(event) => {
                event.stopPropagation();
                refreshView(currentIndex);
              }}
            >
              <GetIcon icon={"reload"}></GetIcon>
            </More>
          )}
          {(actionElements?.dotmenu?.length > 0 || (showEditInDotMenu && updatePrivilege) || (showDeleteInDotMenu && delPrivilege) || (showCloneInDotMenu && clonePrivilege)) && (
            <ThreeDotMenu
              items={getMenuItems({
                showDeleteInDotMenu,
                showEditInDotMenu,
                showCloneInDotMenu,
                data,
                titleValue,
                itemTitle,
                slNo,
                signleRecord,
                clonePrivilege,
                updatePrivilege,
                delPrivilege,
                actionElements,
                updateHandler,
                deleteHandler,
                refreshUpdate,
                openAction,
                formInput,
                setMessage,
                setUpdateId,
                setSubAttributes,
                setShowSubList,
                isEditingHandler,
                udpateView,
                getValue,
              })}
            />
          )}
        </React.Fragment>
      );
      let sticky = true;
      switch (viewMode) {
        case "table":
          return (
            <TrView
              onClick={() => {
                if (!signleRecord) {
                  if (itemOpenInSlug) {
                    window.location.href = `${window.location.pathname}/${data._id}`;
                  } else if (itemOpenMode.type === "edit") {
                    isEditingHandler(data, udpateView, titleValue);
                  } else if (itemOpenMode.type === "open" && openPage) {
                    window.location.hash = "";
                    isEditingHandler(data, udpateView, titleValue, false, true);
                    setOpenData({ actions, attributes, data });
                    setSubAttributes({ actions, attributes, data });
                    setIsOpen(true);
                  } else if (itemOpenMode.type === "callback") {
                    itemOpenMode.callback(data);
                  }
                }
              }}
              // style={{ zIndex: users?.response?.length - slNo }}
              key={`${shortName}-${slNo}`}
            >
              {/* <TdView className={sticky} key={-1}>
                {slNo + 1 + currentIndex}
              </TdView> */}
              {attributes.map((attribute, index) => {
                if (attribute.view && (attribute.tag ?? false)) {
                  try {
                    let itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem] : data[attribute.name];
                    if (attribute.showSubItem) {
                      itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem][attribute.showSubItem] ?? "" : data[attribute.name];
                    }
                    let dynamicClass = "";
                    if (attribute.condition) {
                      if (data[attribute.condition.item] === attribute.condition.if) {
                        dynamicClass = attribute.condition.then;
                      } else {
                        if (typeof attribute.condition.else === "object") {
                          dynamicClass = attribute.condition.else.class;
                          if (attribute.condition.else.value) {
                            itemValue = attribute.condition.else.value;
                          }
                        } else {
                          dynamicClass = attribute.condition.else;
                        }
                      }
                    }
                    if (attribute.name === "authenticationId") {
                      itemValue = "+" + (data.phoneCode || "") + "" + itemValue;
                    }
                    const value = getValue(attribute, itemValue);
                    const result = (
                      <TdView
                        className={sticky}
                        key={index}
                        onClick={() => {
                          if (attribute.editable === true) {
                            alert("yes");
                          } else {
                            // alert("no");
                          }
                        }}
                      >
                        {dynamicClass === "disabled" ? (
                          attribute.inlineAction ? (
                            ""
                          ) : (
                            "--"
                          )
                        ) : attribute.inlineAction ? (
                          <FormInput
                            {...attribute}
                            formType="put"
                            disabled={false}
                            dynamicClass={formMode + " control table " + (attribute.condition?.then ?? "")}
                            formValues={data}
                            updateValue={
                              (attribute.type === "select" || attribute.type === "multiSelect") && Array.isArray(attribute.updateOn)
                                ? attribute.updateOn.reduce((acc, itemName) => {
                                    acc[itemName] = data[itemName];
                                    return acc;
                                  }, {})
                                : {
                                    [attribute.updateOn]: data[attribute.updateOn],
                                  }
                            }
                            placeholder={attribute.label}
                            key={`input-${data._id}-${attribute.index}${inlineSelectData[attribute.name] ? "1" : "2"}-${dynamicClass}`}
                            id={attribute.index}
                            error=""
                            value={data[attribute.name]}
                            selectApi={inlineSelectData[attribute.name] ?? []}
                            apiType="JSON"
                            disableSearch={true}
                            params={[
                              ...(attribute.params ?? []),
                              referenceId
                                ? {
                                    name: parentReference,
                                    value: referenceId,
                                  }
                                : {},
                            ]}
                            onChange={async (value) => {
                              let put = null;
                              if (attribute.type === "select") {
                                put = {
                                  id: data._id,
                                  [attribute.name]: value.id,
                                };
                              } else {
                                put = {
                                  id: data._id,
                                  [attribute.name]: value,
                                };
                              }
                              if (put) {
                                const res = await putData(put, api);
                                if (res.status === 200) {
                                  refreshUpdate(false, slNo, put);
                                }
                              }
                            }}
                          />
                        ) : (
                          <React.Fragment>
                            {attribute.render ? (
                              attribute.render(value, data)
                            ) : attribute.image ? (
                              <ImageRow>
                                {attribute.image?.generateTextIcon ? (
                                  <ProfileImage imageUrl={attribute.image.collection?.length > 0 ? data[attribute.image.collection]?.[attribute.image.field] : data[attribute.image.field]} title={value} customProfileSource={customProfileSource} onImageClick={(src) => setShowImage({ src })} theme={themeColors} className="w-auto" />
                                ) : (
                                  <img
                                    onError={(e) => {
                                      e.target.src = noimage; // Hide the image on error
                                    }}
                                    src={import.meta.env.VITE_CDN + (attribute.image.collection?.length > 0 ? data[attribute.image.collection]?.[attribute.image.field] : data[attribute.image.field])}
                                    alt={attribute.name}
                                  />
                                )}
                                <div>
                                  {value && <div>{value}</div>}
                                  {attribute.description && <div>{getValue(attribute.description, attribute.description.collection?.length > 0 ? data[attribute.description.collection]?.[attribute.description.field] : data[attribute.description.field])}</div>}
                                </div>
                              </ImageRow>
                            ) : (
                              <React.Fragment>
                                {value && <span>{getValue(attribute, itemValue)}</span>}
                                {attribute.statusLabel && <StatusLabel statusLabels={attribute.statusLabel.conditions} nextLine={attribute.statusLabel.nextLine} values={data} size={attribute.statusLabel.size ?? "small"}></StatusLabel>}
                                {attribute.description && <DescRow>{getValue(attribute.description, attribute.description.collection?.length > 0 ? data[attribute.description.collection]?.[attribute.description.field] : data[attribute.description.field])}</DescRow>}
                              </React.Fragment>
                            )}
                          </React.Fragment>
                        )}
                      </TdView>
                    );
                    sticky = false;
                    return result;
                  } catch (error) {
                    const result = <TdView className={sticky} key={index}>{`--`}</TdView>;
                    sticky = false;
                    return result;
                  }
                }

                return null;
              })}
              <TdView style={{ border: 0 }} key={`actions-${shortName}-${data._id}`} className="actions">
                <div>{ActionDiv}</div>
              </TdView>
            </TrView>
          );
        case "files":
          return (
            <FileItem
              fileSource={data[fileSource] || ""}
              thumbnail={data[fileSource + "Thumbnail"] || data[fileSource] || ""}
              title={titleValue}
              date={data["date"] ?? ""}
              onClick={() => {
                if (!signleRecord) {
                  isEditingHandler(data, udpateView, titleValue, false, true);
                  setIsOpen(true);
                  window.location.hash = "";
                  setOpenData({ actions, attributes, data });
                  setSubAttributes({ actions, attributes, data });
                }
              }}
              viewMode={viewMode}
              theme={themeColors}
              key={`row-${shortName}-${data._id ?? slNo}`}
              action={ActionDiv}
            ></FileItem>
          );
        case "gallery":
          return (
            <ImageCard
              onClick={() => {
                setShowImage({
                  src: `${imageSettings.endpoind}${data[imageSettings.image]}`,
                });
              }}
            >
              <img alt={data.key} src={`${imageSettings.endpoind}${data[imageSettings.thumbnail]}`} />
              <ImageOverlay className="overlay">
                <SizeLabel>{formatSize(data.compressedSize)}</SizeLabel>
                <ButtonGroup>
                  {api === "contribute" && (
                    <IconButton
                      icon="tick"
                      theme={themeColors}
                      align="success small"
                      ClickEvent={async (event) => {
                        event.stopPropagation();
                        setLoaderBox(true);
                        try {
                          const response = await putData({ status: true }, `${api}/approve?contributeId=${data._id}`);
                          if (response.status === 200) {
                            toast.success("Image approved successfully!");
                            refreshUpdate(true);
                          } else {
                            toast.error("Failed to approve image");
                          }
                        } catch (error) {
                          toast.error("Error approving image");
                        }
                        setLoaderBox(false);
                      }}
                    />
                  )}
                  {api !== "event-highlight" && (
                    <IconButton
                      icon="star"
                      theme={themeColors}
                      align="success small"
                      ClickEvent={async (event) => {
                        event.stopPropagation();
                        setLoaderBox(true);
                        try {
                          const response = await putData({ status: true }, `${api}/approve?imageId=${data._id}&eventId=${data.event}`);
                          if (response.status === 200) {
                            toast.success("Image highlighted successfully!");
                            refreshUpdate(true);
                          } else {
                            console.log("response", response);
                            toast.error(response.data.message);
                          }
                        } catch (error) {
                          toast.error("Error approving image");
                        }
                        setLoaderBox(false);
                      }}
                    />
                  )}
                  {delPrivilege && (
                    <IconButton
                      icon="delete"
                      theme={themeColors}
                      align="error small"
                      ClickEvent={(event) => {
                        event.stopPropagation();
                        setMessage({
                          type: 2,
                          content: `Do you want to delete '${getValue({ type: itemTitle.type ?? "text" }, titleValue) ? getValue({ type: itemTitle.type ?? "text" }, titleValue) : "Item"}'?`,
                          proceed: "Delete",
                          onProceed: async () => {
                            await deleteHandler(data, data._id);
                            return true;
                          },
                          data: data,
                        });
                      }}
                    />
                  )}
                </ButtonGroup>
              </ImageOverlay>
            </ImageCard>
          );
        default:
          return (
            <SetTr
              onClick={() => {
                if (!signleRecord) {
                  if (itemOpenInSlug) {
                    window.location.href = `${window.location.pathname}/${data._id}`;
                  } else if (itemOpenMode.type === "edit") {
                    isEditingHandler(data, udpateView, titleValue);
                  } else if (itemOpenMode.type === "open" && openPage) {
                    window.location.hash = "";
                    isEditingHandler(data, udpateView, titleValue, false, true);
                    setOpenData({ actions, attributes, data });
                    setSubAttributes({ actions, attributes, data });
                    setIsOpen(true);
                  } else if (itemOpenMode.type === "callback") {
                    itemOpenMode.callback(data, refreshUpdate, slNo);
                  }
                }
              }}
              viewMode={viewMode}
              theme={themeColors}
              className={signleRecord ? "single" : ""}
              key={`row-${shortName}-${data._id ?? slNo}`}
            >
              {profileImage && displayColumn !== "triple" && <ProfileImage imageUrl={data[profileImage]} title={titleValue} customProfileSource={customProfileSource} onImageClick={(src) => setShowImage({ src })} theme={themeColors} />}

              <ListContainerBox>
                {!signleRecord && (
                  <TrBody className={signleRecord ? "nowrap" : "nowrap "}>
                    <SetTd key={`row-head-${slNo}`} className={`flex w-full gap-2 justify-between`}>
                      {profileImage && displayColumn === "triple" && <ProfileImage imageUrl={data[profileImage]} title={titleValue} customProfileSource={customProfileSource} onImageClick={(src) => setShowImage({ src })} theme={themeColors} />}
                      <Head
                        onClick={() => {
                          if (itemOpenInSlug) {
                            window.location.href = `${window.location.pathname}/${data._id}`;
                          } else if (itemOpenMode.type === "edit") {
                            isEditingHandler(data, udpateView, titleValue);
                          } else if (itemOpenMode.type === "open" && openPage) {
                            window.location.hash = "";
                            isEditingHandler(data, udpateView, titleValue, false, true);
                            setOpenData({ actions, attributes, data });
                            setSubAttributes({ actions, attributes, data });
                            setIsOpen(true);
                          } else if (itemOpenMode.type === "callback") {
                            itemOpenMode.callback(data, refreshUpdate, slNo);
                          }
                        }}
                      >
                        {!profileImage && <GetIcon icon={icon ?? selectedMenuItem.icon} />}
                        <span>{` ${getValue({ type: itemTitle.type ?? "text" }, titleValue)}`}</span>
                        <Highlight data={data} highlight={highlight}></Highlight>
                      </Head>
                      <div className="flex row gap-2 h-[max-content] dotmenu"> {ActionDiv}</div>
                    </SetTd>
                    <Td key={`actions-${shortName}-${data._id}`} className={`actions flex left gap-2 ${displayColumn === "triple" ? "flex-col" : "justify-between"}`}>
                      {[...attributes]
                        .sort((a, b) => (b.highlight === a.highlight ? 0 : b.highlight ? 1 : -1))
                        .map((attribute, index) => {
                          if (attribute.view && (attribute.tag ?? false)) {
                            try {
                              let itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem] : data[attribute.name];
                              if (attribute.showSubItem) {
                                itemValue = attribute.collection?.length > 0 && attribute.showItem?.length > 0 ? data[attribute.collection][attribute.showItem][attribute.showSubItem] ?? "" : data[attribute.name];
                              }
                              const itemColor = attribute.collection?.length > 0 && attribute.color?.length > 0 ? data[attribute.collection][attribute.color] : "initial";
                              let dynamicClass = "";
                              if (attribute.condition) {
                                if (data[attribute.condition.item] === attribute.condition.if) {
                                  dynamicClass = attribute.condition.then;
                                } else {
                                  dynamicClass = attribute.condition.else;
                                }
                              }
                              if (attribute.type === "image") {
                                return "";
                              }
                              return (
                                <Td className={"custom " + dynamicClass} key={index}>
                                  {displayColumn === "triple" ? attribute.itemLabel !== undefined && attribute.itemLabel !== null ? attribute.itemLabel === "" ? "" : <Title>{attribute.itemLabel}</Title> : <Title>{attribute.label}</Title> : ""}
                                  <DataItem
                                    className={attribute.highlight ? "highlight" : "box"}
                                    onClick={() => {
                                      if (attribute.editable === true) {
                                        const temp = { ...editable };
                                        temp[`${index}-${attribute.name}`] = temp[`${index}-${attribute.name}`] ? !temp[`${index}-${attribute.name}`] : true;
                                        setEditable(temp);
                                      }
                                    }}
                                    style={{ color: itemColor }}
                                  >
                                    {attribute.icon?.length > 0 && <GetIcon icon={attribute.icon} />}
                                    <span>{getValue(attribute, itemValue)}</span>
                                  </DataItem>
                                  {editable[`${index}-${attribute.name}`] ? <Editable item={attribute} /> : ""}
                                </Td>
                              );
                            } catch (error) {
                              let dynamicClass = "";
                              if (attribute.condition) {
                                if (data[attribute.condition.item] === attribute.condition.if) {
                                  dynamicClass = attribute.condition.then;
                                } else {
                                  dynamicClass = attribute.condition.else;
                                }
                              }
                              return (
                                <Td key={index} className={"custom " + dynamicClass}>
                                  <Title>{attribute.label}</Title>
                                  <DataItem>{`--`} </DataItem>
                                </Td>
                              );
                            }
                          }

                          return null;
                        })}
                    </Td>
                  </TrBody>
                )}
                {signleRecord ? (
                  <React.Fragment key={date}>
                    {showTitle && <PageHeader dynamicClass={headerStyle} title={shortName} line={false} description={`Manage ${shortName} here.`}></PageHeader>}

                    <CrudForm
                      formStyle={formStyle}
                      {...{
                        parentReference: parentReference,
                        referenceId: referenceId,
                        formMode: formMode,
                        api: api,
                        formType: "put",
                        updateId: updateId,
                        header: ``,
                        formInput: formInput,
                        formErrors: errroInput,
                        formValues: setEditingData(data, {}),
                        submitHandler: updateHandler,
                        isOpenHandler: isEditingHandler,
                        isOpen: isEditing,
                        profileImage: profileImage,
                        parentName: shortName,
                        parentIcon: icon,
                      }}
                      setMessage={setMessage}
                      setLoaderBox={setLoaderBox}
                      css="plain"
                    ></CrudForm>
                  </React.Fragment>
                ) : null}
                {/* {actions.length > 0 && (
                  <TrBody className="actions">
                    {actions.map((item, index) => {
                      let status = true;
                      if (item.condition) {
                        if (data[item.condition.item]?.toString() === item.condition?.if?.toString()) {
                          status = item.condition.then;
                        } else {
                          status = item.condition.else;
                        }
                      }
                      return (
                        item.type === "callback" &&
                        status && (
                          <More
                            theme={themeColors}
                            key={`custom-${item.id + "-" + index}-${data._id}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              item.callback(item, data, refreshUpdate, slNo);
                            }}
                            className="edit callBack"
                          >
                            <GetIcon icon={item.icon} />
                            <span>{item.title}</span>
                          </More>
                        )
                      );
                    })}
                  </TrBody>
                )} */}
              </ListContainerBox>
            </SetTr>
          );
      }
    });

    const closeModal = () => {
      setShowSubList(false);
      setIsOpen(false);
      window.location.hash = "";
      setIsPrint(false);
      setPrintData([]);
    };
    const [searchValue, setSearchValue] = useState("");
    // const [filter, setFilter] = useState(false);
    const searchTimeoutRef = useRef();
    const handleChange = (event) => {
      clearTimeout(searchTimeoutRef.current);
      setSearchValue(event.target.value);
      searchTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(0);
        setFilterView({ ...filterView, searchkey: event.target.value });
        setDataLoaded(false);
      }, 400);
    };
    //export to excel
    const toExcel = async (currentIndex) => {
      try {
        await exportToExcel();
      } catch (error) {
        alert(error);
      }
    };
    const printPage = async (currentIndex) => {
      try {
        setLoaderBox(true);
        await getData({ ...filterView, skip: 0, limit: 0 }, api, dispatch, navigate)
          .then((response) => {
            setPrintData(response.data);
            setLoaderBox(false);
            setIsPrint(true);
          })
          .catch((error) => {
            setLoaderBox(false);
          });
      } catch (error) {
        alert(error);
      }
    };
    const exportToExcel = async () => {
      setLoaderBox(true);
      try {
        const response = await getData({ ...filterView, skip: 0, limit: 0 }, api);
        const jsonData = response.data.response;

        if (!jsonData || !Array.isArray(jsonData)) {
          throw new Error("No valid data to export");
        }

        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(shortName?.substring(0, 31) || "Sheet1"); // Excel has 31 char limit

        // Define columns based on attributes that should be exported
        const columns = attributes
          .filter((attribute) => attribute.export !== false) // Export all by default unless explicitly set to false
          .map((attribute) => ({
            header: attribute.label,
            key: attribute.name,
            width: 20,
            style: { alignment: { vertical: "middle", horizontal: "left" } },
          }));

        worksheet.columns = columns;

        // Style the header row
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, size: 12 };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "f5f5f5" },
        };
        headerRow.border = {
          bottom: { style: "thin", color: { argb: "cccccc" } },
        };

        // Process and add data rows
        const rows = jsonData.map((data) => {
          const row = {};
          attributes
            .filter((attribute) => attribute.export !== false)
            .forEach((attribute) => {
              try {
                let valueToProcess;
                if (attribute.collection && data[attribute.collection] !== undefined && data[attribute.collection] !== null) {
                  const collectedObject = data[attribute.collection];
                  if (typeof collectedObject === "object" && attribute.showItem) {
                    let potentialValue = collectedObject[attribute.showItem];
                    if (attribute.showSubItem && typeof potentialValue === "object" && potentialValue !== null) {
                      valueToProcess = potentialValue[attribute.showSubItem];
                    } else if (attribute.showSubItem && (potentialValue === null || typeof potentialValue !== "object")) {
                      valueToProcess = ""; // showSubItem exists but parent is not an object or is null
                    } else {
                      valueToProcess = potentialValue;
                    }
                  } else {
                    valueToProcess = collectedObject; // collection exists but not object, or no showItem for collection
                  }
                } else {
                  valueToProcess = data[attribute.name];
                }

                switch (attribute.type) {
                  case "mobilenumber":
                    row[attribute.name] = typeof valueToProcess === "object" && valueToProcess !== null ? `+${valueToProcess.country}${valueToProcess.number}` : `+${data.phoneCode || ""}${valueToProcess}`;
                    break;
                  case "minute":
                    row[attribute.name] = convertMinutesToHHMM(parseFloat(valueToProcess));
                    break;
                  case "datetime":
                    row[attribute.name] = valueToProcess ? dateTimeFormat(valueToProcess) : "";
                    break;
                  case "date":
                    row[attribute.name] = valueToProcess ? dateFormat(valueToProcess) : "";
                    break;
                  case "select":
                    if (attribute.apiType === "JSON") {
                      const idValue = data[attribute.name]; // For JSON select, ID is usually direct
                      const filtered = attribute.selectApi?.find((item) => item.id?.toString() === idValue?.toString());
                      row[attribute.name] = filtered?.value || "";
                    } else {
                      // apiType === "API"
                      if (typeof valueToProcess === "object" && valueToProcess !== null) {
                        if (attribute.showItem) {
                          let displayValue = valueToProcess[attribute.showItem];
                          if (typeof displayValue === "object" && displayValue !== null) {
                            row[attribute.name] = ""; // valueToProcess.showItem is an object, avoid [object Object]
                          } else {
                            row[attribute.name] = displayValue?.toString() || "";
                          }
                        } else {
                          row[attribute.name] = ""; // valueToProcess is object, but no showItem for this attribute
                        }
                      } else {
                        row[attribute.name] = valueToProcess?.toString() || ""; // Primitive or already resolved
                      }
                    }
                    break;
                  case "multiSelect":
                    const multiSelectArray = data[attribute.name]; // Always use direct data for multiSelect array
                    if (Array.isArray(multiSelectArray)) {
                      if (attribute.apiType === "API") {
                        row[attribute.name] = multiSelectArray
                          .map((element) => {
                            if (typeof element === "object" && element !== null) {
                              if (attribute.showItem) {
                                let displayValue = element[attribute.showItem];
                                if (typeof displayValue === "object" && displayValue !== null) {
                                  return ""; // Element's showItem is an object, avoid [object Object]
                                } else {
                                  return displayValue?.toString(); // Returns null/undefined if displayValue is null/undefined
                                }
                              } else {
                                return ""; // Element is object, but no showItem for the attribute
                              }
                            } else if (element !== null && element !== undefined) {
                              return element.toString(); // Element is a primitive
                            }
                            return null; // Element is null or undefined
                          })
                          .filter((val) => val !== null && val !== undefined && val !== "")
                          .join(", ");
                      } else {
                        // apiType === "JSON"
                        row[attribute.name] = multiSelectArray
                          .map((id) => attribute.selectApi?.find((option) => option.id?.toString() === id?.toString())?.value)
                          .filter(Boolean)
                          .join(", ");
                      }
                    } else {
                      row[attribute.name] = "";
                    }
                    break;
                  case "percentage":
                    const valForPercentage = parseFloat(valueToProcess);
                    if (!isNaN(valForPercentage)) {
                      if (Number.isInteger(valForPercentage)) {
                        row[attribute.name] = valForPercentage.toString() + "%";
                      } else {
                        row[attribute.name] = valForPercentage.toFixed(2) + "%";
                      }
                    } else {
                      row[attribute.name] = valueToProcess?.toString() || "";
                    }
                    break;
                  default:
                    row[attribute.name] = valueToProcess?.toString() || "";
                }
              } catch (error) {
                console.error(`Error processing column ${attribute.name}:`, error);
                row[attribute.name] = "--";
              }
            });
          return row;
        });

        // Add rows to worksheet
        worksheet.addRows(rows);

        // Auto-fit columns with max width limit
        worksheet.columns.forEach((column) => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            maxLength = Math.max(maxLength, columnLength);
          });
          column.width = Math.min(maxLength + 2, 50); // Max width of 50 characters
        });

        // Apply zebra striping
        rows.forEach((row, index) => {
          const rowNumber = index + 2; // +2 because row 1 is header
          const currentRow = worksheet.getRow(rowNumber);
          if (index % 2 === 1) {
            // Odd rows
            currentRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "fafafa" },
            };
          }
          currentRow.height = 25; // Set consistent row height
        });

        // Generate buffer and create download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${shortName}-${new Date().toISOString().split("T")[0]}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);

        setLoaderBox(false);
        toast.success("Excel file downloaded successfully");
      } catch (error) {
        console.error("Export error:", error);
        setLoaderBox(false);
        toast.error("Error downloading excel file: " + (error.message || "Unknown error"));
      }
    };
    useEffect(() => {
      return () => {
        clearTimeout(searchTimeoutRef.current);
      };
    }, []);
    let headerSticky = true;
    const pageCount = Math.ceil(count / perPage);
    useEffect(() => {
      let hasFilterTemp = false;
      if (datefilter) {
        hasFilterTemp = true;
      }
      formInput.map((item) => {
        switch (item.type) {
          case "select":
          case "multiSelect":
            if ((item.filter ?? true) === true && (item.filterType ?? "") !== "tabs") hasFilterTemp = true;
            return true;
          case "date":
            if ((item.filter ?? false) === true) hasFilterTemp = true;
            return true;
          default:
            return true;
        }
      });
      setHasFilter(hasFilterTemp);
    }, [formInput, setHasFilter, datefilter]);

    const TableRows = React.memo(
      ({ users, attributes, shortName, inlineSelectData }) => {
        return users?.response?.length > 0 ? users.response.map((item, index) => <TableRowWithActions key={`${shortName}-${index}`} slNo={index} attributes={attributes} inlineSelectData={inlineSelectData} data={item} />) : null;
      },
      (prevProps, nextProps) => {
        // Optional: Custom comparison function for props
        return prevProps.users === nextProps.users && prevProps.attributes === nextProps.attributes && prevProps.shortName === nextProps.shortName && prevProps.inlineSelectData === nextProps.inlineSelectData;
      }
    );
    const [fullScreen, setFullScreen] = useState(false);
    const surfaceThemeClass = surfaceTheme ? `surface-theme-${surfaceTheme}` : "";
    const toolbarThemeClass = surfaceTheme ? `toolbar-theme-${surfaceTheme}` : "";
    const listThemeClass = surfaceTheme ? `list-theme-${surfaceTheme}` : "";
    const tableThemeClass = surfaceTheme ? `table-theme-${surfaceTheme}` : "";
    const paginationThemeClass = surfaceTheme ? `pagination-theme-${surfaceTheme}` : "";
    const mobileActionsThemeClass = surfaceTheme ? `mobile-actions-theme-${surfaceTheme}` : "";
    const emptyThemeClass = surfaceTheme ? `empty-theme-${surfaceTheme}` : "";
    // Usage in your component
    const tablerender = <TableRows users={users} attributes={attributes} shortName={shortName} inlineSelectData={inlineSelect} />;
    //end crud functions
    return isSlug ? (
      <div className="bg-white fixed top-0 left-0 w-full h-full flex items-center z-[2001] justify-center">
        <div className="text-2xl font-bold text-center">Coming Soon</div>
      </div>
    ) : attributes.length === 0 ? (
      <p>No attributes found for {shortName}. Please ensure that the data is correctly loaded.</p>
    ) : isSingle ? (
      users?.response?.length > 0 && (
        <RowContainer theme={themeColors} className={"data-layout " + viewMode}>
          <Popup openTheme={openTheme} isSingle={isSingle} parentName={shortName} parentIcon={icon} popupMode={popupMode} showInfo={showInfo} popupMenu={popupMenu} selectedMenuItem={selectedMenuItem} formMode={formMode} closeModal={closeModal} themeColors={themeColors} isEditingHandler={isEditingHandler} updateValue={udpateView} setMessage={setMessage} setLoaderBox={setLoaderBox} itemTitle={itemTitle} openData={{ actions, attributes, data: users?.response[0] }} updatePrivilege={updatePrivilege}></Popup>
        </RowContainer>
      )
    ) : viewMode === "list" || viewMode === "subList" || viewMode === "table" || viewMode === "files" || viewMode === "gallery" ? (
        <RowContainer theme={themeColors} className={"data-layout " + viewMode + " " + surfaceThemeClass + (fullScreen ? " !fixed top-0 left-0 right-0 bottom-0 z-50 bg-white transition-all duration-300" : " transition-all duration-300")}>
        {showTitle && <PageHeader dynamicClass={headerStyle} title={shortName} line={false} description={generateDescription()}></PageHeader>}
        <ButtonPanel className={viewMode + " " + toolbarThemeClass + " " + (scrolled ? "scrolled" : "")} theme={themeColors}>
          <div className="flex flex-wrap gap-2 justify-between w-full overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            <div className="flex left gap-2 min-w-max">
              {filterElements?.openbox?.length > 0 && (
                <Filter
                  className={"filter-button" + (showFilterStatus ? "active" : "")}
                  theme={themeColors}
                  onClick={() => {
                    setShowFilterStatus(!showFilterStatus);
                  }}
                >
                  <div className="flex items-center gap-2  justify-end">
                    <GetIcon icon={"filter"} />
                    <span className="text-sm">Filter</span>
                  </div>
                </Filter>
              )}
              <Filter
                theme={themeColors}
                onClick={() => {
                  refreshView(currentIndex);
                }}
              >
                <GetIcon icon={"reload"} />
              </Filter>

              <Search title={"Search"} theme={themeColors} placeholder="Search" value={searchValue} onChange={handleChange}></Search>

              {exportPrivilege && (
                <Filter
                  theme={themeColors}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMessage({
                      type: 2,
                      content: "Do you want export this page to excel?",
                      proceed: "Export Now",
                      onProceed: async () => {
                        await toExcel();
                        return true;
                      },
                      data: currentIndex,
                    });
                  }}
                >
                  <GetIcon icon={"excel"} />
                </Filter>
              )}
              {printPrivilege && (
                <Filter
                  theme={themeColors}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMessage({
                      type: 2,
                      content: "Do you want print?",
                      proceed: "Print Now",
                      onProceed: async () => {
                        await printPage();
                        return false;
                      },
                      data: currentIndex,
                    });
                  }}
                >
                  <GetIcon icon={"print"} />
                </Filter>
              )}
              {filterElements?.left?.length > 0 && (
                <React.Fragment>
                  {filterElements?.left?.map((item, index) => (
                    <FormInput setLoaderBox={setLoaderBox} updateValue={{}} customClass={"filter"} value={filterView[item.name]} key={`input` + index + reset} id={item.name} {...item} filter={{ ...parents }} onChange={(option, name, type) => filterChange(option, name, type, item.parentFilter ?? false)} showLabel={false} required={false} selectType={item.filterType} footnote={null} addNew={null} type={"select"} placeholder={item.label} />
                  ))}
                </React.Fragment>
              )}
            </div>
            <div className="flex gap-2 ">
              {filterElements?.right?.length > 0 && (
                <React.Fragment>
                  {filterElements?.right?.map((item, index) => (
                    <FormInput setLoaderBox={setLoaderBox} updateValue={{}} customClass={"filter"} value={filterView[item.name]} key={`input` + index + reset} id={item.name} {...item} filter={{ ...parents }} onChange={(option, name, type) => filterChange(option, name, type, item.parentFilter ?? false)} showLabel={false} required={false} selectType={item.filterType} footnote={null} addNew={null} type={"select"} placeholder={item.label} />
                  ))}
                </React.Fragment>
              )}
              {count > 0 && (additionalButtons.length > 0 || addPrivilege || bulkUplaod) && (
                <>
                  {/* Desktop View */}
                  <div className="hidden sm:flex gap-2">
                    {additionalButtons.map((btn) => (
                      <AddButton theme={themeColors} onClick={() => btn.onClick(referenceId)}>
                        <GetIcon icon={btn.icon} />
                        <span>{btn.label}</span>
                      </AddButton>
                    ))}
                    {(addPrivilege ? addPrivilege : false) && (
                      <AddButton theme={themeColors} onClick={() => isCreatingHandler(true, refreshView)}>
                        {addLabel?.icon ? <GetIcon icon={addLabel.icon}></GetIcon> : <AddIcon></AddIcon>}
                        <span>{addLabel?.label ?? shortName}</span>
                      </AddButton>
                    )}
                    {(bulkUplaod ? bulkUplaod : false) && (
                      <AddButton onClick={() => setShowBulkUplad((prev) => !prev)}>
                        <UploadIcon></UploadIcon>
                        <span>Bulk Upload {shortName}</span>
                      </AddButton>
                    )}
                    {enableFullScreen && (
                      <Filter
                        theme={themeColors}
                        onClick={() => {
                          setFullScreen((prev) => !prev);
                        }}
                      >
                        <GetIcon icon={fullScreen ? "close" : "enlarge"} />
                      </Filter>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <Filters className={`${showFilterStatus ? "show-filter" : ""} ${toolbarThemeClass}`}>
            {datefilter && <DateRangeSelector onChange={dateRangeChange} themeColors={themeColors}></DateRangeSelector>}
            {filterElements?.openbox?.map((item, index) => {
              let updateValue = {};
              if ((item.type === "select" || item.type === "multiSelect") && (item.filter ?? true) === true) {
                if (Array.isArray(item.updateOn)) {
                  updateValue = {};
                  item.updateOn?.forEach((itemName) => {
                    updateValue[itemName] = filterView[itemName];
                  });
                } else {
                  updateValue = {
                    [item.updateOn]: filterView[item.updateOn],
                  };
                }
              }

              switch (item.type) {
                case "multiSelect":
                  return (item.filter ?? true) === true && (item.filterType ?? "") !== "tabs" && <FormInput setLoaderBox={setLoaderBox} updateValue={updateValue} customClass={"filter"} value={[]} key={`input` + index + reset} id={item.name} {...item} filter={{ ...parents }} onChange={(option, name, type) => filterChange(option, name, type, item.parentFilter ?? false)} showLabel={false} required={false} selectType={"dropdown"} footnote={null} addNew={null} type={"multiSelect"} placeholder={item.label} />;
                case "select":
                  return (item.filter ?? true) === true && (item.filterType ?? "") !== "tabs" && <FormInput setLoaderBox={setLoaderBox} updateValue={updateValue} customClass={"filter"} value={filterView[item.name]} key={`input` + index + reset} id={item.name} {...item} filter={{ ...parents }} onChange={(option, name, type) => filterChange(option, name, type, item.parentFilter ?? false)} showLabel={false} required={false} selectType={"select"} footnote={null} addNew={null} type={"select"} placeholder={item.label} />;
                case "date":
                  return (item.filter ?? false) === true && <FormInput updateValue={updateValue} customClass={""} value={filterView[item.name]} key={`input` + index + reset} id={item.name} {...item} onChange={filterChange} showLabel={false} required={false} />;
                default:
                  return null;
              }
            })}
          </Filters>
        </ButtonPanel>

        {shimmerLoader ? (
          <ListTableSkeleton viewMode={viewMode} displayColumn={displayColumn} tableColumnCount={attributes.filter((attribute) => attribute.view && (attribute.tag ?? false)).length} />
        ) : (
          <React.Fragment>
            {count === 0 && !hasFilter ? (
              <NoDataFound setShowBulkUplad={setShowBulkUplad} bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} addLabel={addLabel} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${emptyThemeClass}`.trim()} description={description}></NoDataFound>
            ) : (
              <React.Fragment>
                {labels.length > 0 && <MetricTile labels={labels} data={counts} />}

                <ListContainer className={`${popupMenu} ${popupMode} ${overflow} ${listThemeClass}`}>
                  <ListContainerData>
                    {viewMode === "table" ? (
                      <TableContaner className={tableThemeClass}>
                        <TableView theme={themeColors}>
                          {showHeaderRow && (
                            <thead>
                              <tr>
                                {[...attributes].map((attribute, index) => {
                                  if (attribute.view && (attribute.tag ?? false)) {
                                    const item = (
                                      <ThView className={headerSticky} key={`list_header_${api}_${shortName}_${attribute.name}_${attribute.label}_${index}`}>
                                        <div>
                                          <span>{attribute.label}</span>
                                          {attribute.sort && (
                                            <IconButton
                                              ClickEvent={() => {
                                                setSortView((prev) => ({
                                                  ...prev,
                                                  [attribute.name]: prev[attribute.name] === "asc" ? "desc" : prev[attribute.name] === "desc" ? "" : "asc",
                                                }));
                                                setDataLoaded(false);
                                              }}
                                              icon="sort"
                                              align={`plain sort ${sortView?.[attribute.name] ?? ""}`}
                                            ></IconButton>
                                          )}
                                        </div>
                                      </ThView>
                                    );
                                    headerSticky = false;
                                    return item;
                                  }
                                  return null;
                                })}
                                <ThView key={"actions"}></ThView>
                              </tr>
                            </thead>
                          )}
                          <tbody>{tablerender}</tbody>
                        </TableView>
                        {initialized && !users && !users?.response && <NoDataFound setShowBulkUplad={setShowBulkUplad} bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()} description={description}></NoDataFound>}
                        {initialized && users?.response?.length === 0 && <NoDataFound setShowBulkUplad={setShowBulkUplad} bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()} description={description}></NoDataFound>}
                      </TableContaner>
                    ) : (
                      <>
                        <Table className={`${viewMode} ${displayColumn} ${count > 0 ? "" : "no-data"}`}>
                          {users?.response?.length > 0 && users.response.map((item, index) => <TableRowWithActions key={`${shortName}-${index}`} slNo={index} attributes={attributes} data={item} />)}
                          {initialized && !users && !users?.response && <NoDataFound setShowBulkUplad={setShowBulkUplad} bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()} description={description}></NoDataFound>}
                          {initialized && users?.response?.length === 0 && <NoDataFound setShowBulkUplad={setShowBulkUplad} bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()} description={description}></NoDataFound>}
                        </Table>
                      </>
                    )}
                  </ListContainerData>
                </ListContainer>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        {count > rowLimit && showPagination && (
          <Pagination
            className={paginationThemeClass}
            onClick={(index, PerPage) => {
              setPerPage(PerPage);
              setCurrentIndex(index);
              setDataLoaded(false);
            }}
            totalRows={count}
            perPage={rowLimit}
            currentIndex={currentIndex}
          ></Pagination>
        )}
        {count > 0 && (additionalButtons.length > 0 || addPrivilege || bulkUplaod) && (
          <div ref={mobileMenuRef} className={`fixed bottom-[70px] right-4 sm:hidden z-50 ${mobileActionsThemeClass}`}>
            {/* If only add button is available, directly trigger add action */}
            {additionalButtons.length === 0 && addPrivilege && !bulkUplaod ? (
              <button onClick={() => isCreatingHandler(true, refreshView)} className="w-12 h-12 bg-primary-base text-white rounded-full shadow-lg flex items-center justify-center">
                <Plus />
              </button>
            ) : (
              <>
                <button onClick={() => setShowMobileActions((prev) => !prev)} className="w-12 h-12 bg-primary-base text-white rounded-full shadow-lg flex items-center justify-center">
                  {showMobileActions ? <X /> : <Plus />}
                </button>

                {/* Mobile Actions Menu */}
                {showMobileActions && (
                  <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-2 min-w-[200px]">
                    {additionalButtons.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          btn.onClick(referenceId);
                          setShowMobileActions(false);
                        }}
                        className="flex items-center gap-2 w-full p-3 hover:bg-bg-soft rounded-lg"
                      >
                        <GetIcon icon={btn.icon} className="text-primary-base" />
                        <span>{btn.label}</span>
                      </button>
                    ))}
                    {(addPrivilege ? addPrivilege : false) && (
                      <button
                        onClick={() => {
                          isCreatingHandler(true, refreshView);
                          setShowMobileActions(false);
                        }}
                        className="flex items-center gap-2 w-full p-3 hover:bg-bg-soft rounded-lg"
                      >
                        {addLabel?.icon ? <GetIcon icon={addLabel.icon} className="text-primary-base" /> : <AddIcon className="text-primary-base" />}
                        <span>{addLabel?.label ?? shortName}</span>
                      </button>
                    )}
                    {(bulkUplaod ? bulkUplaod : false) && (
                      <button
                        onClick={() => {
                          setShowBulkUplad((prev) => !prev);
                          setShowMobileActions(false);
                        }}
                        className="flex items-center gap-2 w-full p-3 hover:bg-bg-soft rounded-lg"
                      >
                        <UploadIcon className="text-primary-base" />
                        <span>Bulk Upload {shortName}</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        {!isCreating ? null : viewMode === "gallery" ? (
          <PopupView
            customClass={"side medium"}
            popupData={
              <ImageGallery
                viewMode="side"
                imageSettings={imageSettings}
                api={`${api}`}
                openData={{
                  api: `${api}`,
                  data: { _id: referenceId, ...parents },
                }}
              />
            }
            themeColors={themeColors}
            closeModal={() => {
              refreshUpdate(true);
              setIsCreating(false);
            }}
            itemTitle={{ name: "title", type: "text", collection: "" }}
            openData={{
              data: {
                key: "print_preparation",
                title: addLabel?.label ?? shortName,
              },
            }}
          />
        ) : (
          <CrudForm formStyle={formStyle} setMessage={setMessage} setLoaderBox={setLoaderBox} formTabTheme={formTabTheme} formLayout={formLayout} parentReference={parentReference} referenceId={referenceId} formMode={formMode} api={api} formType={"post"} header={`Add a ${shortName ? shortName : "Form"}`} button={submitButtonText} formInput={formInput} formValues={addValues} formErrors={errroInput} submitHandler={submitHandler} isOpenHandler={isCreatingHandler} isOpen={isCreating} />
        )}

        {action.data && <Manage setMessage={setMessage} setLoaderBox={setLoaderBox} onClose={closeManage} {...action}></Manage>}

        {isOpen && updateValues && (
          <Popup
            showInfoType={showInfoType}
            parentReference={parentReference}
            referenceId={referenceId}
            headerActions={headerActions}
            editData={{
              parentReference: parentReference,
              referenceId: referenceId,
              formMode: formMode,
              api: api,
              formType: "put",
              updateId: updateId,
              header: `${shortName} details`,
              formInput: formInput,
              formErrors: errroInput,
              formValues: updateValues,
              button: updateButtonText,
              submitHandler: updateHandler,
              isOpenHandler: isEditingHandler,
              isOpen: isEditing,
              profileImage: profileImage,
              parentName: shortName,
              parentIcon: icon,
              setMessage: setMessage,
              setLoaderBox: setLoaderBox,
            }}
            popupMode={popupMode}
            showInfo={showInfo}
            popupMenu={popupMenu}
            parents={{ ...parents, [parentReference]: openData?.data?._id }}
            selectedMenuItem={selectedMenuItem}
            formMode={formMode}
            closeModal={closeModal}
            themeColors={themeColors}
            isEditingHandler={isEditingHandler}
            updateValue={udpateView}
            setMessage={setMessage}
            setLoaderBox={setLoaderBox}
            itemTitle={itemTitle}
            itemDescription={itemDescription}
            parentName={shortName}
            openData={openData}
            updatePrivilege={updatePrivilege}
            profileImage={profileImage}
          ></Popup>
        )}
        {isEditing && <CrudForm formTabTheme={formTabTheme} formStyle={formStyle} setMessage={setMessage} setLoaderBox={setLoaderBox} parentReference={parentReference} referenceId={referenceId} formMode={formMode} api={api} formType={"put"} updateId={updateId} header={`${updateValues.clone === false ? `${shortName}: ` : `Clone ${shortName}: `}  <span style="font-weight:bold">'${updateValues._title}'</span>`} formInput={formInput} formErrors={errroInput} formValues={updateValues} submitHandler={updateHandler} isOpenHandler={isEditingHandler} isOpen={isEditing} button={updateButtonText} />}
        {detailView && <Details formMode={formMode} closeModal={closeModal} themeColors={themeColors} setMessage={setMessage} setLoaderBox={setLoaderBox} itemTitle={itemTitle} openData={openData}></Details>}
        {showSublist && subAttributes?.item?.attributes?.length > 0 && <SubPage themeColors={themeColors} formMode={formMode} closeModal={closeModal} setMessage={setMessage} setLoaderBox={setLoaderBox} itemTitle={itemTitle} subAttributes={subAttributes}></SubPage>}
        {isPrint && (
          <PopupView
            customClass={"print"}
            popupData={<Print orientation={orientation} key={shortName} data={printData} themeColors={themeColors} formMode={formMode} closeModal={() => setIsPrint(false)} setMessage={setMessage} setLoaderBox={setLoaderBox} shortName={shortName} attributes={attributes}></Print>}
            themeColors={themeColors}
            closeModal={() => setIsPrint(false)}
            itemTitle={{ name: "title", type: "text", collection: "" }}
            openData={{
              data: { key: "print_preparation", title: "Print " + shortName },
            }}
          ></PopupView>
        )}
        {showImage && <ImagePopup onClose={() => setShowImage(null)} src={showImage.src}></ImagePopup>}
        {showLoader && !shimmerLoader && <Loader list={"absolute"}></Loader>}
        {bulkUplaod && showBulkUplad && (
          <BulkUplaodForm
            bulkUpload={true}
            delPrivilege={delPrivilege}
            deleteHandler={deleteHandler}
            setMessage={setMessage}
            setLoaderBox={setLoaderBox}
            formMode={"single"}
            formView={formView}
            api={api}
            icon={icon}
            formType={"put"}
            updateId={updateId}
            header={"Bulk Upload " + shortName}
            formInput={formInput}
            formErrors={errroInput}
            formValues={updateValues}
            shortName={shortName}
            parents={{ [parentReference]: referenceId, ...parents }}
            currentApi={currentApi}
            submitHandler={() => {
              refreshView(currentIndex);
              setIsEditing(false);
              setShowBulkUplad(false);
            }}
            isOpenHandler={() => setShowBulkUplad(false)}
            isOpen={isEditing}
          ></BulkUplaodForm>
        )}
        {showPageCount && (
          <PopupView
            // Popup data is a JSX element which is binding to the Popup Data Area like HOC
            popupData={
              <>
                <TabContainer className="page">
                  <div className="head">Items Per Page</div>
                  {[10, 25, 50, 100, 250].map((num) => (
                    <PageNumber
                      theme={themeColors}
                      key={`per-${num}`}
                      className={"nomargin " + (perPage === num)}
                      onClick={() => {
                        setPerPage(num);
                        setDataLoaded(false);
                      }}
                    >
                      {num}
                    </PageNumber>
                  ))}
                </TabContainer>
                <TabContainer className="page">
                  <div className="head">
                    Pages: {pageCount} | Current Page: {pageNumber}
                  </div>
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((num) => (
                    <PageNumber
                      key={`page-${num}`}
                      className={"nomargin " + (pageNumber === num)}
                      onClick={() => {
                        setCurrentIndex((num - 1) * perPage);
                        setDataLoaded(false);
                      }}
                    >
                      {num}
                    </PageNumber>
                  ))}
                </TabContainer>
              </>
            }
            themeColors={themeColors}
            closeModal={() => setShowPageCount(false)}
            itemTitle={{ name: "title", type: "text", collection: "" }}
            openData={{ data: { _id: "", title: "Pagination Setup!" } }} // Pass selected item data to the popup for setting the time and taking menu id and other required data from the list item
            customClass={"small"}
          ></PopupView>
        )}
      </RowContainer>
    ) : (
      <RowContainer className={"data-layout "} key={date}>
        {shimmerLoader && <ListTableSkeleton viewMode={viewMode} displayColumn={displayColumn} tableColumnCount={attributes.filter((attribute) => attribute.view && (attribute.tag ?? false)).length} />}
        {!users && !users?.response && <NoDataFound bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()}></NoDataFound>}
        {users?.response?.length === 0 && <NoDataFound bulkUplaod={bulkUplaod} shortName={shortName} icon={icon} addPrivilege={addPrivilege} isCreatingHandler={isCreatingHandler} refreshView={refreshView} className={`white-list ${displayColumn} ${emptyThemeClass}`.trim()}></NoDataFound>}
        {users?.response?.length > 0 && (
          <CrudForm
            formStyle={formStyle}
            {...{
              parentReference: parentReference,
              referenceId: referenceId,
              formMode: formMode,
              api: api,
              formType: "put",
              updateId: updateId,
              header: ``,
              formInput: formInput,
              formErrors: errroInput,
              formValues: setEditingData(users?.response[0], {}),
              submitHandler: updateHandler,
              isOpenHandler: isEditingHandler,
              isOpen: isEditing,
              profileImage: profileImage,
              parentName: shortName,
              parentIcon: icon,
            }}
            setMessage={setMessage}
            setLoaderBox={setLoaderBox}
            css="plain"
          ></CrudForm>
        )}
      </RowContainer>
    );
  }
);
export default ListItems;
