import React, { useState, useEffect } from "react";
import { getData } from "../../../../backend/api";
import { buildApiUrl } from "../../../../backend/baseUrl";
import axios from "axios";
import styled from "styled-components";

import { Container, SectionTitle, Label, Checkbox, Select, Footer, ResetButton, Button } from "./styles"; // Import your styled components

const EditDashboard = ({ eventId, setEventName, setIsPopupOpen, eventName, closeModal }) => {
  const [defaultMetrics, setDefaultMetrics] = useState({});
  const [metricsFromForms, setMetricsFromForms] = useState({});
  const [graphTypes, setGraphTypes] = useState([]);
  const [savedMetrics, setSavedMetrics] = useState(null); // State to hold saved data
  const [ticketFormDataId, setTicketFormDataId] = useState(null);

  const MetricRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  `;
  // const onCancel = () => {
  //   // Logic to handle cancellation
  //   console.log("Cancel action performed");
  // };

  const handleCancel = () => {
    closeModal(); // Call the function to close the popup
  };

  useEffect(() => {
    const fetchDefaultMetrics = async () => {
      try {
        // Fetch default metrics data
        const recentRegistrations = await getData({}, `ticket-registration/recent-registration/${eventId}`);
        const hourlyRegistrationRate = await getData({}, `ticket-registration/hourly-registration-rate/${eventId}`);
        const ticketTypeBreakdown = await getData({}, `ticket-registration/ticketTypeBreakdown/${eventId}`);

        // Map graph types to specific metrics
        const doughnutGraphType = graphTypes.find((type) => type.name === "doughnut");
        const lineGraphType = graphTypes.find((type) => type.name === "line");

        // Set default metrics with associated graph types
        setDefaultMetrics({
          recentRegistrations: {
            ...recentRegistrations.data,
            enabled: true,
            graphType: lineGraphType?._id || "defaultGraphType", // Assign line graph type
          },
          hourlyRegistrationRate: {
            ...hourlyRegistrationRate.data,
            enabled: true,
            graphType: lineGraphType?._id || "defaultGraphType", // Assign line graph type
          },
          ticketTypeBreakdown: {
            ...ticketTypeBreakdown.data,
            enabled: true,
            graphType: doughnutGraphType?._id || "defaultGraphType", // Assign doughnut graph type
          },
        });
      } catch (error) {
        console.error("Error fetching default metrics:", error);
      }
    };

    // Ensure graphTypes are loaded before fetching default metrics
    if (graphTypes.length > 0) {
      fetchDefaultMetrics();
    }
  }, [eventId, graphTypes]); // Include graphTypes in dependencies

  useEffect(() => {
    const fetchGraphTypes = async () => {
      try {
        const response = await getData({}, "graph-type");
        // console.log("Full API response:", response);

        // Set graph types from API response
        setGraphTypes(response.data.response);
      } catch (error) {
        console.error("Error fetching graph types:", error);
      }
    };

    fetchGraphTypes();
  }, []);

  useEffect(() => {
    const fetchTicketFormDataId = async () => {
      try {
        const response = await getData({}, `ticket-form-data`);

        const ticketFormDataArray = response.data.response;

        const formData = ticketFormDataArray.find((form) => form.type === "select" && form.add === true);

        if (formData) {
          setTicketFormDataId(formData._id); // Set state correctly here
          console.log("Fetched Ticket Form Data ID:", formData._id);
        } else {
          console.log("No matching ticket form data found.");
        }
      } catch (error) {
        console.error("Error fetching ticket form data:", error);
      }
    };

    fetchTicketFormDataId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("API calling");
        const response = await axios.get(buildApiUrl(`ticket-registration/loadDynamicData/${eventId}`));

        if (response.status < 200 || response.status >= 300) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;
        console.log(data, "Data from API"); // Log entire response

        // Filter data to get only the ones where 'enabled' is true
        const enabledData = data.filter((item) => item.enable === true);
        console.log(enabledData, "Filtered Data (enabled true)"); // Log the filtered data

        setMetricsFromForms(enabledData); // Set filtered data in the state
      } catch (error) {
        console.error("Error fetching dashboard data", error.message);
      }
    };

    if (eventId) {
      const handler = setTimeout(() => {
        fetchData();
      }, 300);

      return () => clearTimeout(handler);
    } else {
      console.error("Event ID is not defined");
    }
  }, [eventId]);

  useEffect(() => {
    console.log("Metrics From Forms Updated:", metricsFromForms); // Log updated state
  }, [metricsFromForms]);

  // Rendering logic
  console.log(metricsFromForms, "Metrics from Forms state"); // Log state

  const handleCheckboxChange = async (metrics, metricId) => {
    if (Array.isArray(metrics)) {
      // Find the index of the metric in the array
      const metricIndex = metrics.findIndex((metric) => metric._id === metricId);

      if (metricIndex === -1) {
        console.error("Metric not found:", metricId);
        return;
      }

      // Create a new metrics array and toggle `enable` and `graphTypeEnable`
      const updatedMetrics = metrics.map((metric, index) =>
        index === metricIndex
          ? {
              ...metric,
              enable: !metric.enable, // Toggle `enable`
              graphTypeEnable: !metric.enable ? true : false, // Set `graphTypeEnable` to true when re-enabled
            }
          : metric
      );

      // Update state
      setMetricsFromForms(updatedMetrics);

      // Optionally, send updated data to the API
      try {
        const response = await axios.post(buildApiUrl("ticket-registration/dashboard/save-selection"), { metrics: updatedMetrics });
        console.log("Metrics saved successfully:", response);
      } catch (error) {
        console.error("Error saving metrics:", error.message);
      }
    } else {
      console.error("Expected metrics to be an array.");
    }
  };

  const handleGraphTypeChange = (metrics, metricKey, graphTypeName) => {
    console.log(metrics, metricKey, graphTypeName, "category, metric, graphType");

    const selectedGraphType = graphTypes.find((type) => type.name === graphTypeName);

    if (selectedGraphType) {
      const updatedMetrics = { ...metrics };

      // Check if the metricKey exists in metrics
      if (updatedMetrics[metricKey]) {
        console.log(`Updating metric ${metricKey} from graphType ${updatedMetrics[metricKey].graphType} to ${selectedGraphType._id}`);

        // Update the graphType for the specific metric
        updatedMetrics[metricKey] = {
          ...updatedMetrics[metricKey],
          graphType: selectedGraphType._id,
        };

        // Log the updated metrics
        console.log(`Updated metrics structure:`, JSON.stringify(updatedMetrics, null, 2));

        // Update the state
        setMetricsFromForms(updatedMetrics);
        console.log("Metrics from forms state updated:", updatedMetrics);
      } else {
        console.warn(`Metric key ${metricKey} is not valid`);
      }
    } else {
      console.warn(`Graph type ${graphTypeName} is not valid`);
    }
  };

  // console.log(metricsFromForms, "metricsFromForms");

  const defaultGraphTypes = {
    recentRegistrations: graphTypes.find((type) => type.name === "line")?._id,
    hourlyRegistrationRate: graphTypes.find((type) => type.name === "line")?._id,
    ticketTypeBreakdown: graphTypes.find((type) => type.name === "doughnut")?._id,
  };

  const [selectedGraphTypes] = useState(defaultGraphTypes);

  const handleSave = async () => {
    try {
      // Prepare combinedMetrics object
      const combinedMetrics = {
        event: eventId,
        ticketFormData: ticketFormDataId, // Add ticketFormDataId here
        metrics: Object.keys(defaultMetrics)
          .map((metric) => ({
            name: metric,
            enabled: defaultMetrics[metric]?.enabled || false,
            graphType: defaultMetrics[metric]?.graphType || defaultGraphTypes[metric] || null, // Should be ObjectId
          }))
          .concat(
            // Adding metrics from forms
            Object.keys(metricsFromForms).map((metric) => ({
              name: metric,
              enabled: metricsFromForms[metric]?.enabled || false,
              graphType: metricsFromForms[metric]?.graphType || defaultGraphTypes[metric] || null, // Should be ObjectId
            }))
          ),
      };

      // Log combinedMetrics to verify structure
      console.log("Combined Metrics before API call:", combinedMetrics);

      // Proceed with the API request
      const response = await axios.post(buildApiUrl("ticket-registration/dashboard/save-selection"), combinedMetrics);

      // Log API Response for debugging
      console.log("API Response:", response.data);

      // Update the metricsFromForms state based on the API response
      if (response.data && response.data.data && response.data.data.metrics) {
        const updatedMetrics = {};
        response.data.data.metrics.forEach((selection) => {
          updatedMetrics[selection.name] = {
            enabled: selection.enabled, // Updated to use the correct property
            graphType: selection.graphType, // No need for the conditional check if the structure is consistent
          };
        });

        // Update the state with the newly fetched metrics
        setMetricsFromForms(updatedMetrics);
        console.log(updatedMetrics, "Updated Metrics from Response");

        // Optionally set saved metrics if needed
        setSavedMetrics(response.data);
        setEventName(!eventName); // Toggle event name
        setIsPopupOpen(false); // Close popup if applicable

        // Check for success status in response
        if (response.data.status === 200) {
          console.log("Dashboard selection saved successfully:", response.data);
        } else {
          console.error("Save failed with status:", response.data.status, "Response:", response.data);
        }
      } else {
        console.error("Unexpected response structure:", response.data);
      }
    } catch (error) {
      console.error("Error saving dashboard selection:", error);
    }
  };

  // Optionally use a useEffect to load the last saved metrics when the component mounts
  useEffect(() => {
    if (savedMetrics) {
      const updatedDefaultMetrics = {};
      savedMetrics.metrics.forEach((metric) => {
        updatedDefaultMetrics[metric.name] = {
          enabled: metric.enabled,
          graphType: metric.graphType || defaultGraphTypes[metric.name] || null,
        };
      });
      setDefaultMetrics(updatedDefaultMetrics);
    }
  }, [savedMetrics, defaultGraphTypes]);

  return (
    <Container>
      <SectionTitle>Default Metrics</SectionTitle>
      {Object.keys(defaultMetrics).map((metric, index) => (
        <MetricRow key={index}>
          <Label>
            <Checkbox
              checked={defaultMetrics[metric]?.enabled}
              onChange={() => handleCheckboxChange(defaultMetrics, metric)} // Pass the correct metric name for toggling
            />
            {metric || "Unnamed Metric"}
          </Label>
          <Select value={metric.graphType || ""} onChange={(e) => handleGraphTypeChange(defaultMetrics, metric, e.target.value)}>
            {graphTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </Select>
        </MetricRow>
      ))}

      <SectionTitle>Metrics From Forms</SectionTitle>

      {Array.isArray(metricsFromForms) && metricsFromForms.length > 0 ? (
        metricsFromForms.map((metric, index) => (
          <MetricRow key={metric._id || index}>
            <Label>
              <Checkbox
                checked={metric.enable} // Maps to enable field in API response
                onChange={() => handleCheckboxChange(metricsFromForms, metric._id)}
              />
              {metric.type || "Unnamed Metric"} {/* Display type or fallback */}
            </Label>
            <Select
              value={metric.graphTypeEnable ? metric.graphType : ""} // Show only if `graphTypeEnable` is true
              onChange={(e) => handleGraphTypeChange(metricsFromForms, metric._id, e.target.value)}
              disabled={!metric.graphTypeEnable || !metric.enable} // Disable if either `graphTypeEnable` or `enable` is false
            >
              {graphTypes.map((type) => (
                <option key={type._id} value={type._id} disabled={!type.enabled}>
                  {type.name}
                </option>
              ))}
            </Select>
          </MetricRow>
        ))
      ) : (
        <div>No metrics available</div>
      )}
      <Footer>
        <ResetButton>Reset</ResetButton>
        <div>
          <Button cancel onClick={handleCancel}>
            Cancel
          </Button>{" "}
          {/* Close the edit form */}{" "}
          <Button style={{ marginLeft: "1rem" }} onClick={handleSave}>
            Save
          </Button>
        </div>
      </Footer>
    </Container>
  );
};

export default EditDashboard;
