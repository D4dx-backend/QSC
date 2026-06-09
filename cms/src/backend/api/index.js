import { GetAccessToken, SetAccessToken } from "../authentication";
import axios from "axios";
import { buildApiUrl } from "../baseUrl";

// You can now use the formData object as needed, such as sending it via AJAX or submitting a form

const postData = async (fields, url, dispatch, navigate) => {
  const data = new Promise(async (resolve, reject) => {
    try {
      let token = GetAccessToken();
      let isUploading = false;
      let requestData;

      // Check if we need to upload files
      const checkForFiles = (obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (value instanceof File) return true;
          if (Array.isArray(value) && value.length > 0 && value.some((item) => item instanceof File)) return true;
          // Check if it's a FileList object
          if (value instanceof FileList && value.length > 0) return true;
          // Check if it's an object with File values
          if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof FileList)) {
            for (const subValue of Object.values(value)) {
              if (subValue instanceof File) return true;
            }
          }
        }
        return false;
      };

      isUploading = checkForFiles(fields);
      console.log("File upload check:", { isUploading, fields });

      if (isUploading) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            return;
          }
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value instanceof FileList) {
            // Handle FileList objects
            if (value.length > 0) {
              for (let i = 0; i < value.length; i++) {
                formData.append(key, value[i]);
              }
            }
          } else if (typeof value === "object") {
            if (value === null) {
              return; // Skip null values
            } else if (value?.[0] instanceof File) {
              if (value.length > 0) {
                value.forEach((item) => {
                  formData.append(key, item);
                });
              }
            } else if (Array.isArray(value)) {
              if (value.length > 0) {
                value.forEach((item, index) => {
                  formData.append(`${key}[${index}]`, item);
                });
              }
              // For FormData, we don't append anything for empty arrays
            } else if ("value" in value) {
              formData.append(key, value._id);
            } else {
              // Skip empty objects or objects with no meaningful data
              if (Object.keys(value).length > 0) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                  formData.append(`${key}[${subKey}]`, subValue);
                });
              }
            }
          } else {
            formData.append(key, value);
          }
        });
        requestData = formData;
      } else {
        // Use JSON for regular data (preserves empty arrays properly)
        requestData = JSON.stringify(fields);
      }

      const response = await axios.post(buildApiUrl(url), requestData, {
        headers: {
          "Content-Type": isUploading ? "multipart/form-data" : "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const tokenUpdated = response.headers.get("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return resolve({ status: response.status, data: [] });
      }

      return resolve({ status: response.status, data: response.data });
    } catch (error) {
      console.log("error", error);
      resolve({
        status: error?.response?.status,
        customMessage: error?.response?.data?.customMessage ?? "Something went wrong!",
        data: error?.response?.data,
      });
    }
  });

  return data;
};
const postDataCustom = async (fields, ulr, dispatch, navigate) => {
  const data = new Promise(async (resolve, reject) => {
    try {
      let token = GetAccessToken();
      const formData = new FormData();

      let isUploading = false;
      Object.entries(fields).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }
        if (value instanceof File) {
          isUploading = true;
          formData.append(key, value);
        } else if (typeof value === "object") {
          if (value === null) {
            formData.append(key, item);
          } else if (value?.[0] instanceof File) {
            isUploading = true;
            if (value.length > 0) {
              value.forEach((item) => {
                formData.append(key, item);
              });
            } else {
              formData.append(key, value[0]);
            }
          } else if (Array.isArray(value)) {
            if (value.length > 0) {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            }
            // For FormData, we don't append anything for empty arrays
          } else if ("value" in value) {
            formData.append(key, value._id);
          } else {
            Object.entries(value).forEach(([subKey, subValue]) => {
              formData.append(`${key}[${subKey}]`, subValue);
            });
          }
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.post(`${ulr}`, formData, {
        headers: {
          "Content-Type": isUploading ? "multipart/form-data" : "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const tokenUpdated = response.headers.get("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }
      if (response.status === 401) {
        try {
          localStorage.clear();
          window.location.href = "/";
          return resolve({ status: response.status, data: [] });
        } catch (error) {
          console.log(error);
        }
      }

      resolve({ status: response.status, data: response.data });
    } catch (error) {
      // console.log("error", error);
      resolve({
        status: error?.response?.status,
        customMessage: error?.response?.data?.customMessage ?? "Something went wrong!",
        data: error?.response?.data,
      });
    }
  });

  return data;
};
const putData = async (fields, ulr, dispatch, navigate) => {
  console.log("PutData", fields, { ulr });
  try {
    let token = GetAccessToken();
    let isUploading = false;
    let requestData;

    // Check if we need to upload files
    const checkForFiles = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value instanceof File) return true;
        if (Array.isArray(value) && value.length > 0 && value.some((item) => item instanceof File)) return true;
        // Check if it's a FileList object
        if (value instanceof FileList && value.length > 0) return true;
        // Check if it's an object with File values
        if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof FileList)) {
          for (const subValue of Object.values(value)) {
            if (subValue instanceof File) return true;
          }
        }
      }
      return false;
    };

    isUploading = checkForFiles(fields);

    if (isUploading) {
      // Use FormData for file uploads
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof FileList) {
          // Handle FileList objects
          if (value.length > 0) {
            for (let i = 0; i < value.length; i++) {
              formData.append(key, value[i]);
            }
          }
        } else if (typeof value === "object") {
          if (value === null) {
            return; // Skip null values
          } else if (value?.[0] instanceof File) {
            if (value.length > 0) {
              value.forEach((item) => {
                formData.append(key, item);
              });
            }
          } else if (Array.isArray(value)) {
            if (value.length > 0) {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}]`, item);
              });
            }
            // For FormData, we don't append anything for empty arrays
          } else if ("value" in value) {
            formData.append(key, value._id);
          } else {
            // Skip empty objects or objects with no meaningful data
            if (Object.keys(value).length > 0) {
              Object.entries(value).forEach(([subKey, subValue]) => {
                formData.append(`${key}[${subKey}]`, subValue);
              });
            }
          }
        } else {
          formData.append(key, value);
        }
      });
      requestData = formData;
    } else {
      // Use JSON for regular data (preserves empty arrays properly)
      requestData = JSON.stringify(fields);
    }

    console.log(fields);
    const response = await axios.put(buildApiUrl(ulr), requestData, {
      headers: {
        "Content-Type": isUploading ? "multipart/form-data" : "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const tokenUpdated = response.headers.get("Token-Updated");
    if (tokenUpdated === "true") {
      const newToken = response.headers.get("Authorization").split(" ")[1];
      SetAccessToken(newToken);
    }

    if (response.status === 401) {
      try {
        localStorage.clear();
        window.location.href = "/";
        return { status: response.status, data: [] };
      } catch (error) {
        console.log(error);
      }
    }

    return { status: response.status, data: response.data };
  } catch (error) {
    console.log(error);
    return {
      status: error.response?.status,
      customMessage: error.response?.data?.customMessage ?? "Something went wrong!",
      data: error?.response?.data,
    };
  }
};
const bulkUploadData = async (formData, url, signal, dispatch, navigate) => {
  try {
    let token = GetAccessToken();

    const response = await axios.post(buildApiUrl(url), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + token,
      },
      signal: signal,
    });
    const tokenUpdated = response.headers.get("Token-Updated");
    if (tokenUpdated === "true") {
      const newToken = response.headers.get("Authorization").split(" ")[1];
      SetAccessToken(newToken);
    }
    // Handle unauthorized access
    if (response.status === 401) {
      // dispatch(clearLogin()); // Uncomment if you have a clearLogin action
      navigate("/");
      navigate(0);
    }

    return { status: response.status, data: response.data };
  } catch (error) {
    console.log("error", error);
    return {
      status: error.response?.status ?? error,
      data: error.response?.data?.message || "An error occurred while uploading.", // Provide a default message
    };
  }
};

const getData = async (fields, ulr, dispatch, navigate) => {
  const data = new Promise(async (resolve, reject) => {
    try {
      let params = new URLSearchParams();

      // Function to recursively add parameters
      const addParams = (obj, prefix = "") => {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let paramKey = prefix ? `${prefix}[${key}]` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
              addParams(obj[key], paramKey);
            } else {
              params.append(paramKey, obj[key]);
            }
          }
        }
      };

      // Add all fields to params
      addParams(fields);

      let token = GetAccessToken();
      const hasQueryString = ulr.includes("?");
      const separator = hasQueryString ? "&" : "?";
      const fullUrl = `${buildApiUrl(ulr)}${separator}${params.toString()}`;

      const response = await axios.get(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const tokenUpdated = response.headers.get("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }
      if (response.status === 401) {
        try {
          localStorage.clear();
          window.location.href = "/";
        } catch (error) {
          console.log(error);
        }
      }
      resolve({ status: response.status, data: response.data });
    } catch (error) {
      if (error.response?.status) {
        if (error.response?.status === 401) {
          try {
            localStorage.clear();
            window.location.href = "/";
          } catch (error) {
            console.log(error);
          }
        }
      }
      resolve({
        status: error.response?.status,
        data: error.response?.data?.message,
      });
    }
  });
  return data;
};
const getCustomData = async (fields, ulr, dispatch, navigate) => {
  const data = new Promise(async (resolve, reject) => {
    try {
      let params = new URLSearchParams();

      // Function to recursively add parameters
      const addParams = (obj, prefix = "") => {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let paramKey = prefix ? `${prefix}[${key}]` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
              addParams(obj[key], paramKey);
            } else {
              params.append(paramKey, obj[key]);
            }
          }
        }
      };

      // Add all fields to params
      addParams(fields);

      let token = GetAccessToken();
      const hasQueryString = ulr.includes("?");
      const separator = hasQueryString ? "&" : "?";
      const fullUrl = `${ulr}${separator}${params.toString()}`;

      const response = await axios.get(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const tokenUpdated = response.headers.get("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }
      if (response.status === 401) {
        try {
          localStorage.clear();
          window.location.href = "/";
        } catch (error) {
          console.log(error);
        }
      }
      resolve({ status: response.status, data: response.data });
    } catch (error) {
      if (error.response?.status) {
        if (error.response?.status === 401) {
          try {
            localStorage.clear();
            window.location.href = "/";
          } catch (error) {
            console.log(error);
          }
        }
      }
      resolve({
        status: error.response?.status,
        data: error.response?.data?.message,
      });
    }
  });
  return data;
};
const deleteData = async (fields, ulr, dispatch, navigate) => {
  const data = new Promise(async (resolve, reject) => {
    try {
      let token = GetAccessToken();
      let queryString = Object.keys(fields)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(fields[key] ?? "")}`)
        .join("&");
      const response = await axios.delete(`${buildApiUrl(ulr)}?${queryString}`, {
        headers: { Authorization: "Bearer " + token },
      });
      const tokenUpdated = response.headers.get("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }
      if (response.status === 401) {
        try {
          localStorage.clear();
          window.location.href = "/";
        } catch (error) {
          console.log(error);
        }
      }
      resolve({ status: response.status, data: response.data });
    } catch (error) {
      console.log("API Eror", error.message);
      resolve({
        status: error.response?.status,
        data: error.response?.data,
        customMessage: error.response?.data?.customMessage ?? "Something went wrong!",
      });
    }
  });

  return data;
};
const getBlobData = async (fields, ulr, dispatch, navigate) => {
  console.log("getBlobData called with URL:", ulr);
  const data = new Promise(async (resolve, reject) => {
    try {
      let params = new URLSearchParams();

      // Function to recursively add parameters
      const addParams = (obj, prefix = "") => {
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            let paramKey = prefix ? `${prefix}[${key}]` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
              addParams(obj[key], paramKey);
            } else {
              params.append(paramKey, obj[key]);
            }
          }
        }
      };

      // Add all fields to params
      addParams(fields);

      let token = GetAccessToken();
      console.log("Token retrieved:", token ? "Yes" : "No");

      const hasQueryString = ulr.includes("?");
      const separator = hasQueryString ? "&" : "?";
      const fullUrl = `${buildApiUrl(ulr)}${separator}${params.toString()}`;
      console.log("Making request to:", fullUrl);

      const response = await axios.get(fullUrl, {
        headers: {
          Accept: "application/pdf",
          Authorization: "Bearer " + token,
        },
        responseType: "arraybuffer",
      });
      console.log("Response received:", {
        status: response.status,
        hasData: !!response.data,
        headers: response.headers,
      });

      // Check token update in headers (fixed from headers.get to direct access)
      const tokenUpdated = response.headers["token-updated"];
      if (tokenUpdated === "true") {
        console.log("Updating token");
        const newToken = response.headers["authorization"]?.split(" ")[1];
        if (newToken) {
          SetAccessToken(newToken);
        }
      }

      if (response.status === 401) {
        console.error("Unauthorized access");
        try {
          localStorage.clear();
          window.location.href = "/";
          return resolve({ status: response.status, data: null });
        } catch (error) {
          console.error("Error during unauthorized handling:", error);
        }
      }

      // Convert array buffer to blob
      const blob = new Blob([response.data], { type: "application/pdf" });
      console.log("Blob created:", {
        size: blob.size,
        type: blob.type,
      });

      resolve({
        status: response.status,
        data: blob,
        headers: response.headers,
      });
    } catch (error) {
      console.error("getBlobData error:", error);
      if (error.response?.status === 401) {
        try {
          localStorage.clear();
          window.location.href = "/";
        } catch (cleanupError) {
          console.error("Error during error handling:", cleanupError);
        }
      }
      resolve({
        status: error.response?.status,
        data: null,
        error: error.message || "Failed to fetch PDF",
      });
    }
  });
  return data;
};
const postJson = async (payload, url, dispatch, navigate) => {
  const data = new Promise(async (resolve) => {
    try {
      const token = GetAccessToken();
      const response = await axios.post(buildApiUrl(url), payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const tokenUpdated = response.headers.get?.("Token-Updated");
      if (tokenUpdated === "true") {
        const newToken = response.headers.get("Authorization").split(" ")[1];
        SetAccessToken(newToken);
      }

      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return resolve({ status: response.status, data: [] });
      }

      return resolve({ status: response.status, data: response.data });
    } catch (error) {
      console.log("error", error);
      resolve({
        status: error?.response?.status,
        customMessage: error?.response?.data?.customMessage ?? "Something went wrong!",
        data: error?.response?.data,
      });
    }
  });

  return data;
};
// Post JSON to an absolute URL (external services)
const postJsonAbsolute = async (payload, absoluteUrl) => {
  const data = new Promise(async (resolve) => {
    try {
      const token = GetAccessToken();
      const response = await axios.post(`${absoluteUrl}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? "Bearer " + token : undefined,
        },
      });

      return resolve({ status: response.status, data: response.data });
    } catch (error) {
      resolve({
        status: error?.response?.status,
        data: error?.response?.data,
        customMessage: error?.response?.data?.customMessage ?? "Something went wrong!",
      });
    }
  });

  return data;
};
// Patch JSON to the API (used for bulk updates / targeted PATCH endpoints)
const patchJson = async (payload, url) => {
  return new Promise(async (resolve) => {
    try {
      const token = GetAccessToken();
      const response = await axios.patch(buildApiUrl(url), payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      if (response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
        return resolve({ status: response.status, data: [] });
      }
      return resolve({ status: response.status, data: response.data });
    } catch (error) {
      resolve({
        status: error?.response?.status,
        customMessage: error?.response?.data?.customMessage ?? "Something went wrong!",
        data: error?.response?.data,
      });
    }
  });
};
export { getData, postData, putData, deleteData, bulkUploadData, getCustomData, postDataCustom, getBlobData, postJson, postJsonAbsolute, patchJson };
