import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { ElementContainer } from "../../elements";
import { Title } from "../styles";
import { getData } from "../../../../backend/api";

const StackedBarChart = ({
  title = "Age Group Distribution",
  dataType = "API",
  eventId,
  dataItem = `ticket-registration/age-gender-breakdown/${eventId}`, // Updated endpoint for age group data
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
  ],
  label = "Age Group",
}) => {
  const chartRef = useRef(null);
  const [mainData, setMainData] = useState([]);

  console.log(eventId, "from stacked chart");

  useEffect(() => {
    if (dataType === "API") {
      const fetchData = async () => {
        try {
          const response = await getData({}, dataItem);
          console.log("API Response age:", response); // Log the full response
          if (Array.isArray(response.data.genderDistribution)) {
            // Adjust based on your actual response structure
            setMainData(response.data.genderDistribution); // Set the main data
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching data from API:", error);
        }
      };
      fetchData();
    }
  }, [dataItem, dataType]);

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(mainData)) return;

    // Prepare data for the chart
    const maleCount = mainData.reduce((acc, group) => acc + (group.genderDistribution.Male || 0), 0);
    const femaleCount = mainData.reduce((acc, group) => acc + (group.genderDistribution.Female || 0), 0);
    const unknownCount = mainData.reduce((acc, group) => acc + (group.genderDistribution.Unknown || 0), 0);

    const data = {
      labels: ["Male", "Female", "Unknown"], // Gender categories
      datasets: [
        {
          label: "Registrations",
          data: [maleCount, femaleCount, unknownCount], // Extract total count for each gender
          backgroundColor: columns.map((column) => column.backgroundColor),
          borderColor: columns.map((column) => column.borderColor),
          borderWidth: 1,
        },
      ],
    };

    const ctx = chartRef.current.getContext("2d");

    // Check if there is an existing chart instance
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    chartRef.current.chart = new Chart(ctx, {
      type: "bar",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true, // Show legend
          },
        },
        scales: {
          x: {
            stacked: true, // Stack the data horizontally
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true, // Stack the data vertically
            beginAtZero: true,
            grid: {
              display: true,
              color: "rgba(230, 230, 230, 0.33)",
            },
            ticks: {
              stepSize: 50, // Adjust as per your data
            },
          },
        },
      },
    });
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

export default StackedBarChart;
