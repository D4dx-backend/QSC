import React, { useState } from "react";
import styled from "styled-components";
import { getData } from "../../../backend/api";
import { useEffect } from "react";
import withLayout from "../layout";
import Header from "./Header";
import Footer from "./footer/footer";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 16px;
  color: #1a4993;
  // padding: 10px;
  margin-top: 20px;
  width: 85%;
  @media (max-width: 768px) {
    width: 92%;
    font-size: 15px;
  }
`;

const StyledButton = styled.button`
  background-image: linear-gradient(#fcfcfc, #f9f9f9 50%, #e9e9e9 50%, #fcfcfc);
  border: 1px solid #ddd;
  color: black;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 80px;
  cursor: pointer;
  margin: 3px 3px;

  &:hover {
    background-image: linear-gradient(to bottom, #f5f2f2 50%, #fff 50%); /* Gradient colors on hover */
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #d3d2d2;
  width: 85%;
  border-radius: 3px;
  margin: 20px 0;
  padding-top: 30px;
  padding-bottom: 150px;
  @media (max-width: 768px) {
    width: 92%;
    padding-top: 16px;
    padding-bottom: 40px;
  }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: #005ca3;
  font-weight: 800;
  transition: color 0.3s;
  font-size: 16px;

  &:hover {
    color: brown;
  }

  p {
    margin: 5px;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    padding-left: 14px;
    font-size: 14px;
  }
`;

const Arrow = styled.span`
  margin-right: 10px;
`;

const TabBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  width: 85%;
  margin-top: 10px;
  @media (max-width: 768px) {
    width: 92%;
  }
`;

const QuestionPapersComponent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [syllabusActiveTab, setSyllabusActiveTab] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [syllabusTabs, setSyllabusTabs] = useState([]);
  const [bannerImage, setBannerImage] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    getData({}, "about-us").then((res) => {
      setImage(res.data.response[0].image);
      setBannerImage(res.data.response[0].landingMainbanner);
    });
  }, [image]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    getData({}, "old-question-papers")
      .then((res) => {
        if (res && res.data.response) {
          const grouped = {};
          res.data.response.forEach((item) => {
            if (!grouped[item.year]) grouped[item.year] = { year: item.year, items: [] };
            grouped[item.year].items.push(item);
          });
          setTabs(Object.values(grouped).sort((a, b) => String(b.year).localeCompare(String(a.year))));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    getData({}, "syllabus")
      .then((res) => {
        // Process the response and set the tabs state
        if (res && res.data.response) {
          console.log("REs;;;", res.data);
          // Group items with the same title (year) together
          const syllabusTabs = {};
          res.data.response.forEach((item) => {
            if (syllabusTabs[item.year]) {
              // If a tab with this year already exists, push the item to its items array
              syllabusTabs[item.year].items.push(item);
            } else {
              // Otherwise, create a new tab with this year and add the item to its items array
              syllabusTabs[item.year] = {
                year: item.year,
                items: [item],
              };
            }
          });
          // Convert the syllabusTabs object into an array
          const tabsArray = Object.values(syllabusTabs);
          setSyllabusTabs(tabsArray);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Run this effect only once when the component mounts

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
  const handleSyllabusTabClick = (index) => {
    setSyllabusActiveTab(index);
  };

  return (
    <>
      <Header />
      <Main style={{ paddingTop: "133px" }}>
        <img src={import.meta.env.VITE_APP_CDN + bannerImage} style={{ width: "100%", height: "auto" }} alt="GroupImage" />
        <Title>Download Question Papers Now!</Title>
        <TabBox>
          {tabs.map((tab, index) => (
            <StyledButton key={index} onClick={() => handleTabClick(index)}>
              {tab.year}
            </StyledButton>
          ))}
        </TabBox>
        <ContentBox>
          {tabs.length === 0 ? (
            <p style={{ textAlign: "center", color: "#888" }}>
              No question papers found.
            </p>
          ) : (
            tabs[activeTab]?.items.map((item, index) => (
              <ListItem key={index}>
                <Arrow>&#11208;</Arrow>
                <a href={import.meta.env.VITE_APP_CDN + item.attachment} target="_blank" rel="noopener noreferrer" download={import.meta.env.VITE_APP_CDN + item.attachment} style={{ color: "#1a4993" }}>
                  <p>{item.title}</p>
                </a>
              </ListItem>
            ))
          )}
        </ContentBox>
        <Title>Download Syllabus Now!</Title>
        <TabBox>
          {syllabusTabs.map((tab, index) => (
            <StyledButton key={index} onClick={() => handleSyllabusTabClick(index)}>
              {tab.year}
            </StyledButton>
          ))}
        </TabBox>
        <ContentBox>
          {syllabusTabs.length > 0 &&
            syllabusTabs[syllabusActiveTab].items.map((item, index) => (
              <ListItem key={index}>
                <Arrow>&#11208;</Arrow>
                <a href={import.meta.env.VITE_APP_CDN + item.attachment} target="_blank" rel="noopener noreferrer" download={import.meta.env.VITE_APP_CDN + item.attachment} style={{ color: "#1a4993" }}>
                  <p>{item.syllabus}</p>
                </a>
              </ListItem>
            ))}
        </ContentBox>
      </Main>
      <Footer />
    </>
  );
};

export default withLayout(QuestionPapersComponent);
