import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { GetIcon } from "../../../../icons";
import { ElementContainer, Select } from "../../elements";
import { Count, IconWrapper, Tile, TileContainer, TitleBox, TitleHead } from "./styles";
import { getData } from "../../../../backend/api";
// import { SubPageHeader } from "../../input/heading";

const HighlightCards = memo(
  ({
    title = "No Title Found",
    description = "",
    dataType = "API",
    filterType = "JSON",
    parents = {},
    filters = [
      { id: 1, value: "January" },
      { id: 2, value: "February" },
      { id: 3, value: "March" },
    ],
    dataItem = "dashboard",
    hideFilter = true,
  }) => {
    const [filterItems, setFilterItems] = useState(filters);
    const [mainData, setMainData] = useState([]);
    const [filter, setFilter] = useState("");
    const [dataLoaded, setDataLoaded] = useState(false);

    const fetchData = useCallback(async (api, params) => {
      try {
        const response = await getData(params, api);
        if (response.status === 200) {
          return response.data;
        } else {
          return [];
        }
      } catch (error) {
        console.error(`Error fetching data from ${api}:`, error);
        return [];
      }
    }, []);

    useEffect(() => {
      const fetchMainData = async () => {
        if (dataType === "API" && !dataLoaded) {
          const data = await fetchData(dataItem, filter ? { ...parents, filter } : parents);
          setMainData(data);
          setDataLoaded(true);
        }
      };
      fetchMainData();
    }, [dataItem, dataType, filter, parents, fetchData, dataLoaded]);

    useEffect(() => {
      const fetchFilterItems = async () => {
        if (filterType === "API" && !dataLoaded) {
          const data = await fetchData(filters);
          setFilterItems(data);
          setDataLoaded(true);
        }
      };
      fetchFilterItems();
    }, [filters, filterType, fetchData, dataLoaded]);

    const renderedTiles = useMemo(() => {
      return mainData?.slice(0, 4).map((item, index) => (
        <Tile key={index}>
          <IconWrapper>
            <GetIcon icon={item.icon} />
          </IconWrapper>
          <TitleBox>
            <TitleHead>{item.title}</TitleHead>
            <Count>{item.count}</Count>
          </TitleBox>
        </Tile>
      ));
    }, [mainData]);

    const handleFilterSelect = useCallback(
      (item) => {
        setFilter(item.id ?? "");
        setDataLoaded(false);
      },
      [setFilter, setDataLoaded]
    );

    return (
      <ElementContainer className="tiles column">
        {/* <SubPageHeader line={true} title={title} description={description} /> */}
        {!hideFilter && <Select label="Month" align="right small" value={filter} selectApi={filterItems} onSelect={handleFilterSelect} />}

        <TileContainer>{renderedTiles}</TileContainer>
      </ElementContainer>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.title === nextProps.title && prevProps.description === nextProps.description && prevProps.dataType === nextProps.dataType && prevProps.filterType === nextProps.filterType && JSON.stringify(prevProps.parents) === JSON.stringify(nextProps.parents) && JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters) && prevProps.dataItem === nextProps.dataItem && prevProps.hideFilter === nextProps.hideFilter;
  }
);

export default HighlightCards;
