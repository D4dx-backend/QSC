import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { ElementContainer, Select } from "../../elements";
import { Amount, Legend, TitleHead, Title } from "../styles";
import { GetIcon } from "../../../../icons";
import { getData } from "../../../../backend/api";

const ComparisonBarChart = ({
  title = "Visitor Comparison",
  dataType = "API",
  filterType = "JSON",
  filters = [
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
  ],
  dataItem = "dashboard/linegraph",
  columns = [
    {
      name: "Unique",
      icon: "user",
      label: "Unique Users",
      backgroundColor: "rgb(185, 174, 52)",
      borderColor: "rgb(185, 174, 52)",
    },
    {
      name: "Loyal",
      icon: "user",
      label: "Loyal Users",
      backgroundColor: "rgb(52, 125, 185)",
      borderColor: "rgb(52, 125, 185)",
    },
  ],
  label = "Month",
}) => {
  const chartRef = useRef(null);
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

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(mainData)) return;

    const data = {
      labels: mainData.map((item) => item[label]),
      datasets: columns.map((column) => ({
        name: column.name,
        label: column.label,
        data: mainData.map((item) => item[column.name]),
        tension: 0.1,
        backgroundColor: column.backgroundColor,
        borderColor: column.borderColor,
        cubicInterpolationMode: "monotone", // Use 'monotone' for curved lines
        pointRadius: 0, // Remove points
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 10,
        borderSkipped: false,
      })),
    };
    const ctx = chartRef.current.getContext("2d");

    // Check if there is an existing chart instance
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false, // Remove y-axis grid lines
            },
            border: {
              display: false,
            },
            ticks: {
              display: false, // Keep y-axis ticks
            },
            title: {
              display: false,
              text: "Y Axis Title",
            },
          },
          y: {
            grid: {
              display: false, // Remove y-axis grid lines
            },
            border: {
              display: false,
            },
            ticks: {
              display: false, // Keep y-axis ticks
            },
            title: {
              display: false,
              text: "Y Axis Title",
            },
          },
        },
        plugins: {
          clip: {
            roundTop: 10, // Set the radius for the top corners
            roundBottom: 10, // Set the radius for the bottom corners
          },
          roundedBars: {
            radius: 10, // Set the radius for the top and bottom corners of the bars
          },
          legend: {
            display: false,
            position: "bottom",
            align: "center",
            fullWidth: false,
            reverse: false,
            labels: {
              color: "black",
              font: {
                size: 12,
                style: "normal",
              },
              padding: 20,
              boxWidth: 40,
              usePointStyle: true,
            },
          },
        },
      },
    });
  }, [mainData, columns, label]);
  const columnSums = columns.map((column) => {
    const sum = Array.isArray(mainData) && mainData?.reduce((acc, curr) => acc + curr[column.name], 0);
    return { ...column, sum };
  });
  return (
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
      <canvas ref={chartRef} />
      <ElementContainer className=" justify">
        {columnSums.map((column, index) => (
          <Legend key={index}>
            <GetIcon icon={column.icon}></GetIcon>
            <TitleHead>
              <Amount>{(column.prefix || "") + column.sum + (column.suffix || "")}</Amount>
              <span>{column.label || ""}</span>
            </TitleHead>
          </Legend>
        ))}
      </ElementContainer>
    </ElementContainer>
  );
};

export default ComparisonBarChart;
