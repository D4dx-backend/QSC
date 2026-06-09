import { useEffect, useState } from "react";
import { ElementContainer, Select } from "../../elements";
import { Title } from "../styles";
import { Slider, StatusBox, Switch, SwitchInput, Table } from "./styles";
import { getData } from "../../../../backend/api";

const DashTable = ({
  plain = false,
  themeColors,
  title = "Top Recipes",
  dataType = "JSON",
  filterType = "JSON",
  filters = [
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
  ],
  dataItem = "dashboard/datatable",
  columns = [
    { name: "name", label: "Name", type: "text" },
    { name: "popularity", label: "Popularity", type: "percentagebar" },
    { name: "sales", label: "Sales", type: "percentage" },
    {
      name: "status",
      label: "Status",
      type: "status",
      list: [
        { label: "Active", color: "green" },
        { label: "Inactive", color: "lightgray" },
      ],
    },
    { name: "switch", label: "Switch", type: "switch" },
  ],
}) => {
  function getPercentageColor(percentage) {
    // Convert percentage to a value between 0 and 1
    const normalizedPercentage = percentage / 100;

    // Calculate the RGB values for the gradient from red to green
    const r = Math.round(255 * (1 - normalizedPercentage));
    const g = Math.round(255 * normalizedPercentage);
    const b = 0;

    // Return the color as an RGB string
    return `rgb(${r}, ${g}, ${b})`;
  }
  const [filterItems, setFilterItems] = useState(filters);
  const [mainData, setMainData] = useState(dataItem);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    if (dataType === "API") {
      const fetchData = async (api) => {
        try {
          const response = await getData(filter ? { filter } : {}, api);
          setMainData(response.data);
        } catch (error) {
          console.error("Error fetching data from API:", error);
        }
      };
      fetchData(dataItem);
    }
  }, [dataItem, dataType, filter]);

  useEffect(() => {
    if (filterType === "API") {
      const fetchData = async (api) => {
        try {
          const response = await getData({}, api);
          setFilterItems(response.data);
        } catch (error) {
          console.error("Error fetching filter items from API:", error);
        }
      };
      fetchData(filters);
    }
  }, [filters, filterType]);
  return plain ? (
    <Table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(mainData) &&
          mainData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.name}>
                  {column.type === "percentagebar" && (
                    <div className="percentage-bar">
                      <div
                        className="percentage-fill"
                        style={{
                          backgroundColor: getPercentageColor(row[column.name]),
                          color: getPercentageColor(row[column.name]),
                          width: `${row[column.name]}%`,
                        }}
                      />
                    </div>
                  )}
                  {column.type === "percentage" && (
                    <span
                      style={{
                        borderColor: getPercentageColor(row[column.name]),
                        color: getPercentageColor(row[column.name]),
                      }}
                      className="percentage-value"
                    >
                      {row[column.name]}%
                    </span>
                  )}
                  {column.type === "status" && <StatusBox color={column.list.find((item) => row[column.name] === item.label)?.color}>{row[column.name]}</StatusBox>}
                  {column.type === "switch" && (
                    <Switch theme={themeColors}>
                      <SwitchInput type="checkbox" theme={themeColors} />
                      <Slider theme={themeColors} checked={row[column.name]} />
                    </Switch>
                  )}
                  {column.type !== "percentagebar" && column.type !== "percentage" && column.type !== "status" && column.type !== "switch" && row[column.name]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </Table>
  ) : (
    <ElementContainer className="dashitem column">
      <Title>
        <span>{title}</span>
        <Select
          label="Month"
          align="right small"
          value={filter}
          selectApi={filterItems}
          onSelect={(item) => {
            console.log("Selected Value", filter, item);
            setFilter(item.id ?? null);
          }}
        ></Select>
      </Title>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(mainData) &&
            mainData.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.name}>
                    {column.type === "percentagebar" && (
                      <div className="percentage-bar">
                        <div
                          className="percentage-fill"
                          style={{
                            backgroundColor: getPercentageColor(row[column.name]),
                            color: getPercentageColor(row[column.name]),
                            width: `${row[column.name]}%`,
                          }}
                        />
                      </div>
                    )}
                    {column.type === "percentage" && (
                      <span
                        style={{
                          borderColor: getPercentageColor(row[column.name]),
                          color: getPercentageColor(row[column.name]),
                        }}
                        className="percentage-value"
                      >
                        {row[column.name]}%
                      </span>
                    )}
                    {column.type === "status" && <StatusBox color={column.list.find((item) => row[column.name] === item.label)?.color}>{row[column.name]}</StatusBox>}
                    {column.type === "switch" && (
                      <Switch theme={themeColors}>
                        <SwitchInput type="checkbox" theme={themeColors} />
                        <Slider theme={themeColors} checked={row[column.name]} />
                      </Switch>
                    )}
                    {column.type !== "percentagebar" && column.type !== "percentage" && column.type !== "status" && column.type !== "switch" && row[column.name]}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </Table>
    </ElementContainer>
  );
};

export default DashTable;
