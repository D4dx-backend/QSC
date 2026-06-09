import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { ElementContainer } from "../../elements";
import { Title } from "../styles";
import { getData } from "../../../../backend/api";

const BarChart = ({
  title = "Gender Distribution",
  dataType = "API",
  eventId,
  dataItem = `ticket-registration/gender-breakdown/${eventId}`, // Updated endpoint
  columns = [
    {
      name: "Male",
      label: "Male",
      backgroundColor: "rgb(52, 125, 185)", // Blue color for Male
      borderColor: "rgb(52, 125, 185)",
    },
    {
      name: "Female",
      label: "Female",
      backgroundColor: "rgb(255, 204, 0)", // Yellow color for Female
      borderColor: "rgb(255, 204, 0)",
    },
    {
      name: "Other",
      label: "Other",
      backgroundColor: "rgb(255, 99, 132)", // Red color for Other
      borderColor: "rgb(255, 99, 132)",
    },
  ],
  label = "Gender",
}) => {
  const chartRef = useRef(null);
  const [mainData, setMainData] = useState([]);

  useEffect(() => {
    if (dataType === "API") {
      const fetchData = async () => {
        try {
          const response = await getData({}, dataItem);
          console.log(response, "genderBreakDown");

          const genderData = columns.map((column) => {
            const foundData = response.data.genderBreakdown.find((item) => item.gender === column.label);
            return {
              gender: column.label,
              totalCount: foundData ? foundData.totalCount : 0,
            };
          });
          setMainData(genderData); // Ensure this is not causing multiple re-renders
        } catch (error) {
          console.error("Error fetching data from API:", error);
        }
      };

      // Only fetch data if it's not already fetched
      if (!mainData.length) {
        fetchData();
      }
    }
  }, [dataItem, dataType, columns, mainData]);

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(mainData)) return;

    const data = {
      labels: columns.map((column) => column.label),
      datasets: [
        {
          label: "Gender Distribution",
          data: mainData.map((item) => item.totalCount), // Total count for each gender
          backgroundColor: columns.map((column) => column.backgroundColor),
          borderColor: columns.map((column) => column.borderColor),
          borderWidth: 1,
        },
      ],
    };

    const ctx = chartRef.current.getContext("2d");

    if (chartRef.current.chart) {
      // If chart exists, update its data and call update
      chartRef.current.chart.data = data;
      chartRef.current.chart.update();
    } else {
      chartRef.current.chart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          scales: {
            x: {
              grid: {
                display: false,
              },
              border: {
                display: false,
              },
              ticks: {
                display: true,
              },
            },
            y: {
              grid: {
                display: true,
                color: "rgba(230, 230, 230, 0.33)",
              },
              ticks: {
                beginAtZero: true,
                stepSize: 100,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [mainData, columns]);

  return (
    <ElementContainer className="dashitem column">
      <Title>
        <span>{title}</span>
      </Title>
      <canvas ref={chartRef} />
    </ElementContainer>
  );
};

export default BarChart;
