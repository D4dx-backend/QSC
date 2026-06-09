import React, { useState } from "react";
import { Button, ElementContainer, TextBox } from "../../../core/elements";
import styled from "styled-components";
import { getData } from "../../../../backend/api"; // Assuming you have a getData function for fetching data
import withLayout from "../../layout";

const TextDiv = styled.div`
  display: flex;
  gap: 10px;
  width: 50%;
  justify-content: center;
  align-items: end;
  @media (max-width: 768px) {
    /* For tab view and smaller screens */
    width: 100%; /* Optionally adjust the width for smaller screens */
  }
  @media (max-width: 500px) {
    /* For tab view and smaller screens */
    flex-direction: column;
    justify-content: center;
    align-items: start;
    width: 100%; /* Optionally adjust the width for smaller screens */
  }
`;
const ButtonDiv = styled.div`
  /* margin-top: 23px; */
`;
const Table = styled.table`
  border-collapse: collapse;
  width: 50%; // Default width
  margin-right: auto;

  @media (max-width: 768px) {
    width: 100%; // Ensure full width on smaller screens
  }
`;

const Results = (props) => {
  console.log(props);

  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [exam, setExam] = useState("");
  const [status, setStatus] = useState("");
  const [result, setResult] = useState([]);
  const [published, setPublished] = useState(false);

  const getApproved = (regno, refreshView) => {
    console.log({ regno });
    props.setLoaderBox(true);
    getData({ regno }, "exam-registration/download-state-certificate")
      .then((response) => {
        console.log(response.data.url);
        props.setLoaderBox(false);
        if (response.data) {
          // props.setMessage({ content: response.data.message });
          window.open(import.meta.env.VITE_APP_CDN + response.data.url, "_blank");
          refreshView();
        } else {
          console.error("Response data is undefined.");
        }
      })
      .catch((error) => {
        props.setLoaderBox(false);
        console.error("API request error:", error);
      });
  };

  // Calculate the grade based on the score
  const calculateGrade = (score) => {
    if (score >= 90 && score <= 100) {
      return "A+";
    } else if (score >= 80 && score <= 89) {
      return "A";
    } else if (score >= 70 && score <= 79) {
      return "B+";
    } else if (score >= 60 && score <= 69) {
      return "B";
    } else if (score >= 50 && score <= 59) {
      return "C+";
    } else if (score >= 40 && score <= 49) {
      return "C";
    } else if (score >= 1 && score <= 39) {
      return "D+";
    } else {
      return "Grade Not Published"; // Handle invalid scores
    }
  };

  const renderGradeTable = () => {
    return (
      <div style={{ marginTop: "20px", textAlign: "left" }}>
        <Table>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Mark
              </th>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>90 - 100</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>A+</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>80 - 89</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>A</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>70 - 79</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>B+</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>60 - 69</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>B</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>50 - 59</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>C+</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>40 - 49</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>C</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>30 - 39</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>D+</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <ElementContainer
      className="dashboard"
      style={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "0px",
        flexWrap: "nowrap",
      }}
    >
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <h2 style={{ marginTop: "0px", marginBottom: "10px" }}>Exam Result</h2>
        <h4 style={{ marginTop: "10px", color: "Red" }}>ഖുർആൻ സ്റ്റഡി സെന്റർ കേരള 2025 വാർഷിക പരീക്ഷ എഴുതിയ ,എല്ലാ വിഭാഗങ്ങളിലുമുള്ള പഠിതാക്കളുടെ റിസൽട്ട് പബ്ലിഷ് ചെയ്തിട്ടുണ്ട്. പഠിതാക്കളുടെ രജിസ്റ്റർ നമ്പർ അല്ലെങ്കിൽ മൊബൈൽ നമ്പർ താഴെ നൽകി, Search Result ക്ലിക്ക് ചെയ്താൽ ലഭിച്ച ഗ്രേഡ് കാണാം. Download Certificate click ചെയ്താൽ ഗ്രേഡ് രേഖപ്പെടുത്തിയ സർട്ടിഫിക്കറ്റ് pdf ഫയൽ ആയി ലഭിക്കുന്നതാണ്. </h4>
        <TextDiv>
          <TextBox
            className="text-box"
            label="Enter Register Number / Mobile Number"
            value={regNo}
            onChange={(value) => {
              console.log("Text Changed", value);
              setRegNo(value);
            }}
          ></TextBox>
          <ButtonDiv>
            <Button
              className="btn-search"
              type={"secondary"}
              align="right"
              icon={"search"}
              ClickEvent={() => {
                getData({ regno: regNo }, "exam-registration/result").then((response) => {
                  if (response.status === 200) {
                    const responseData = response.data.response[0];
                    setName(responseData.nameOfApplicant);
                    setExam(responseData.nameOfExamAppearingNow.examType);
                    setStatus(responseData.status || "Regular");

                    const resultData = response?.data?.result;
                    setResult(resultData);

                    // Check if result exists and has score/grade (marks have been entered)
                    if (resultData && resultData.score && resultData.grade) {
                      setPublished(true);
                    } else {
                      // Student exists but no marks entered yet
                      setPublished(false);
                    }
                  } else if (response.success === false) {
                    // Invalid register number/mobile number
                    props.setMessage({
                      type: 1,
                      content: "Please check Register number / Mobile number",
                      proceed: "Okay",
                    });
                    setName("");
                    setExam("");
                    setResult([]);
                    setPublished(false);
                  } else {
                    // Other errors
                    props.setMessage({
                      type: 1,
                      content: "Please check Register number / Mobile number",
                      proceed: "Okay",
                    });
                    console.warn("No exam data found");

                    setName("");
                    setExam("");
                    setResult([]);
                    setPublished(false);
                  }
                });
              }}
              value="Search Result"
            ></Button>
          </ButtonDiv>
        </TextDiv>
        {published && (result?.score && result?.grade ? <h2 style={{ marginTop: "10px", color: "green" }}>Result Published</h2> : <h2 style={{ marginTop: "10px", color: "Red" }}>Result Not Available</h2>)}

        {name && (
          <>
            <p
              style={{
                textAlign: "left",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <b>Name :</b> {name}
            </p>
            <p
              style={{
                textAlign: "left",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <b>Exam :</b> {exam?.split(":")[0]}{" "}
            </p>
            {status && (
              <p
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <b>Status :</b>{" "}
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 10px",
                    borderRadius: 4,
                    background: status === "Private" ? "#FEF3C7" : "#DCFCE7",
                    color: status === "Private" ? "#92400E" : "#166534",
                    fontWeight: 600,
                  }}
                >
                  {status}
                </span>
              </p>
            )}
            {result && result.score && result.grade && (
              <p
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <b>Grade :</b> {calculateGrade(result?.score)}
              </p>
            )}
            {result && result.score && result.rank && (
              <p
                style={{
                  textAlign: "left",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <b>Rank :</b>{" "}
                <span style={{ color: "#1a4993", fontWeight: 700 }}>
                  #{result.rank}
                </span>{" "}
                <span style={{ color: "#666", fontSize: 13 }}>
                  (of {result.totalCandidates} — {result.scopeLabel})
                </span>
              </p>
            )}
          </>
        )}
        <ButtonDiv style={{ marginTop: "20px" }}>
          <Button key={""} className="btn-download" icon={"download"} value={"Download Certificate"} ClickEvent={() => getApproved(regNo)} />
        </ButtonDiv>
        <div>{renderGradeTable()}</div>
      </div>
    </ElementContainer>
  );
};

export default withLayout(Results);
