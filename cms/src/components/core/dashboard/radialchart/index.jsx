import React, { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer, Label } from "recharts";
import { ElementContainer, Select } from "../../elements";
import { Title } from "../styles";
import { getData } from "../../../../backend/api";

const colors = ["#F4C430", "#6E3FF3", "#DC143C", "#3CB371", "#87CEEB", "#FF7F50", "#9370DB", "#008080", "#FF69B4", "#00CED1", "#8B008B", "#00FA9A", "#FF8C00", "#1E90FF", "#7B68EE"];

const RadialChart = ({
  title = "Target vs Reality",
  dataType = "",
  filterType = "JSON",
  filters = null,
  dataItem = [
    { label: "January", value: 1000 },
    { label: "February", value: 1200 },
    { label: "March", value: 1500 },
    { label: "April", value: 1400 },
    { label: "May", value: 1600 },
  ],
}) => {
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

  const chartData = mainData.map((item, index) => ({
    name: item.label,
    value: item.value,
    fill: colors[index % colors.length],
  }));

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
          />
        )}
      </Title>
      <ResponsiveContainer width="100%" height={400}>
        <RadialBarChart innerRadius="0%" outerRadius="80%" data={chartData} barGap={2} barCategoryGap={3} startAngle={90} endAngle={-270} style={{ background: "transparent" }}>
          <RadialBar
            minAngle={0}
            cornerRadius={10}
            label={{
              position: "inside",
              fill: "#666",
              formatter: (value) => value,
            }}
            clockWise={false}
            dataKey="value"
          >
            <Label value={title} position="insideBottom" fill="#666" style={{ fontSize: "14px", fontWeight: "bold" }} />
          </RadialBar>
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            wrapperStyle={{
              top: 0,
              right: 0,
              backgroundColor: "#f5f5f5",
              border: "1px solid #d5d5d5",
              borderRadius: 3,
              lineHeight: "40px",
            }}
          />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </ElementContainer>
  );
};

export default RadialChart;
