import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { ElementContainer } from "../../elements";
import { Title } from "../styles";

// Utility function to generate unique IDs
const generateUniqueId = () => {
  return "chart-" + Math.random().toString(36).substr(2, 9);
};

const LineGraph = ({
  title = "Visitor Insights",
  dataType = "JSON",
  filterType = "JSON",
  filters = [
    { id: 1, value: "January" },
    { id: 2, value: "February" },
    { id: 3, value: "March" },
  ],
  dataItem = [],
  columns = [{ name: "click", label: "Clicks", borderColor: "rgb(9, 75, 150)" }],
  label = "id",
  showTitle = true,
  chartId, // Optional prop for external ID control
}) => {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [mainData] = useState(dataItem);
  // Generate unique ID once when component mounts
  const [uniqueId] = useState(() => chartId || generateUniqueId());

  useEffect(() => {
    if (filterType === "API") {
      const fetchData = async (api) => {
        try {
          // API fetching logic here
        } catch (error) {
          console.error("Error fetching filter items from API:", error);
        }
      };
      fetchData(filters);
    }
  }, [filters, filterType]);

  useEffect(() => {
    const createChart = () => {
      if (!canvasRef.current || !Array.isArray(mainData)) return;

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Destroy existing chart if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const data = {
        labels: mainData.map((item) => item[label]),
        datasets: columns.map((column) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);

          const rgbMatch = column.borderColor.match(/\d+/g);
          if (rgbMatch && rgbMatch.length === 3) {
            const [r, g, b] = rgbMatch;
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          } else {
            gradient.addColorStop(0, "rgba(185, 174, 52, 0)");
            gradient.addColorStop(1, "rgba(185, 174, 52, 0)");
          }

          return {
            name: column.name,
            label: column.label,
            data: mainData.map((item) => item[column.name]),
            fill: true,
            backgroundColor: gradient,
            borderColor: column.borderColor,
            tension: 0.1,
            cubicInterpolationMode: "linear",
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: column.borderColor,
            pointHoverBorderColor: "white",
            pointHoverBorderWidth: 3,
          };
        }),
      };

      chartInstanceRef.current = new Chart(ctx, {
        id: uniqueId, // Add unique ID to chart configuration
        type: "line",
        data: {
          labels: data.labels,
          datasets: data.datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "index",
            intersect: false,
          },
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
                font: {
                  family: "Dosis, sans-serif",
                },
              },
              title: {
                display: false,
              },
            },
            y: {
              grid: {
                display: true,
                color: "rgba(200, 200, 200, 0.2)",
                drawBorder: false,
                drawTicks: false,
              },
              border: {
                display: false,
              },
              ticks: {
                display: true,
                font: {
                  family: "Dosis, sans-serif",
                },
              },
              title: {
                display: false,
              },
            },
          },
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
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
                usePointStyle: false,
              },
            },
          },
        },
        plugins: [
          {
            id: "hoverLine",
            beforeDraw: (chart) => {
              if (chart.tooltip._active && chart.tooltip._active.length) {
                const activePoint = chart.tooltip._active[0];
                const { ctx } = chart;
                const { x } = activePoint.element;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;
                const gradientStroke = ctx.createLinearGradient(0, topY, 0, bottomY);
                gradientStroke.addColorStop(0, "rgba(9, 75, 150, 0)");
                gradientStroke.addColorStop(0.5, "rgb(9, 75, 150)");
                gradientStroke.addColorStop(1, "rgba(9, 75, 150, 0)");
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = gradientStroke;
                ctx.stroke();
                ctx.restore();
              }
            },
          },
        ],
      });
    };

    createChart();

    // Cleanup function
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [mainData, columns, label, uniqueId]);

  return (
    <ElementContainer className="dashitem column" style={{ height: "100%", width: "100%" }}>
      {showTitle && (
        <Title>
          <span>{title}</span>
        </Title>
      )}
      <div style={{ height: "100%", width: "100%" }}>
        <canvas id={uniqueId} ref={canvasRef} />
      </div>
    </ElementContainer>
  );
};

export default LineGraph;
