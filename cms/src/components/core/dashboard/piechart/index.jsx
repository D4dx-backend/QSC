import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { ElementContainer, Select } from "../../elements";
import { Title } from "../styles";
import { getData } from "../../../../backend/api";
// import DashTable from "../dashtable";
const colors = [
  "#F4C430", // Golden yellow
  "#6E3FF3", // Royal blue
  "#DC143C", // Crimson red
  "#3CB371", // Medium sea green
  "#87CEEB", // Sky blue
  "#FF7F50", // Coral
  "#9370DB", // Medium purple
  "#008080", // Teal
  "#FF69B4", // Hot pink
  "#00CED1", // Dark turquoise
  "#8B008B", // Dark magenta
  "#00FA9A", // Spring green
  "#FF8C00", // Dark orange
  "#1E90FF", // Dodger blue
  "#7B68EE", // Medium slate blue
];
const PieChart = ({
  title = "Target vs Reality",
  type = "pie", //doughnut
  cutout = "70%",
  dataType = "",
  filterType = "JSON",
  // filters = [
  //   { id: 1, value: "January" },
  //   { id: 2, value: "February" },
  //   { id: 3, value: "March" },
  // ],
  filters = null,
  columns = [],
  dataItem = [
    { label: "January", value: 1000 },
    { label: "February", value: 1200 },
    { label: "March", value: 1500 },
    { label: "April", value: 1400 },
    { label: "May", value: 1600 },
  ],
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
    // const maxValue = Math.max(...mainData.map((item) => item.value));
    const tempData = [...mainData].sort((a, b) => b.value - a.value);

    const data = {
      labels: tempData.map((item) => item.label ?? ""),
      datasets: [
        {
          data: tempData.map((item) => item.value ?? 0),
          fill: true,
          tension: 1,
          borderRadius: 0,
          borderSkipped: true,
          backgroundColor: tempData.map((key, index) => {
            return colors[index];
          }),
        },
      ],
    };

    const ctx = chartRef.current.getContext("2d");

    // Check if there is an existing chart instance
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type,
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        aspectRatio: 5 / 2, // 3:2 aspect ratio
        cutout,
        plugins: {
          legend: {
            display: true,
            position: "right",
            align: "center",
            fullWidth: false,
            reverse: false,
            labels: {
              color: "black",
              font: {
                size: 12,
                style: "normal",
              },
            },
          },
        },
      },
    });
  }, [type, cutout, mainData]);
  return (
    <ElementContainer className="dashitem column">
      <Title>
        <span>{title}</span>
        {filters && (
          <Select
            label="Month"
            align="right small"
            value={filter}
            selectApi={filterItems}
            onSelect={(item) => {
              setFilter(item.id ?? null);
            }}
          ></Select>
        )}
      </Title>
      <canvas ref={chartRef} />
      {/* <DashTable plain={true} columns={columns} dataItem={dataItem}></DashTable> */}
    </ElementContainer>
  );
};

export default PieChart;
