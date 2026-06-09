import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./style.css";
// import { Container, Section } from "../../../core/layout/styels";
import withLayout from "../../layout";
import { getData } from "../../../../backend/api";
import Header from "../Header";
import Footer from "../footer/footer";

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: #1a4993;
  padding: 10px;
  margin-top: 20px;
  font-weight: 100;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 26px;
  color: black;
  max-width: 100%;
  padding: 0 100px;
  @media only screen and (max-width: 768px) { 
    padding 0 20px;
  }
`;

const ContainerBox = styled.div`
  background-color: #f5f7fa;
  padding: 0 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    padding: 0 10px;
  }
`;

const About = () => {
  const [bannerImage, setBannerImage] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getData({}, "about-us").then((res) => {
      setImage(res.data.response[0].image);
      setBannerImage(res.data.response[0].landingMainbanner);
      setDescription(res.data.response[0].description);
    });
  }, [image]);
  return (
    <>
    <Header />
    <Section style={{paddingTop:'133px'}}>
      <Container style={{display:'flex',flexDirection:'column'}}>
        <img
          src={import.meta.env.VITE_APP_CDN + bannerImage}
          style={{ width: "100%", height: "auto" }}
          alt="GroupImage"
        />
        <Title>Quran Study Centre Kerala</Title>
        <Description dangerouslySetInnerHTML={{ __html: description }}></Description>
        <ContainerBox>
          <div className="mission">
            <img
              src={import.meta.env.VITE_APP_CDN + image}
              style={{ width: "300px", height: "400px" }}
              alt="GroupImage"
            />
          </div>
          <div className="mission-text">
            <div className="mission-title">Our Vision</div>
            <p>
              The vision of the Quran Study Centre in Kerala is rooted in
              fostering a profound understanding and appreciation of the Quran's
              teachings within the community.
            </p>

            <div className="mission-title">Our Mission</div>
            <p>
              <ul className="blog-details-list mt-30">
                <li>
                  It envisions a society where the values of tolerance, respect,
                  and solidarity are deeply ingrained, fostering harmonious
                  coexistence and mutual understanding among people of diverse
                  backgrounds.
                </li>
                <li>
                  To create empowered and sensitized generation who could peer
                  into the keyhole of tomorrow to build a brave new world for
                  humanity with abiding Islamic ethos, justice and values.
                </li>
                <li>
                  To produce empowered men and women with firm faith in God,
                  capable of discharging their responsibilities rhythmically.
                </li>
                <li>
                  To contribute to the creation of a truly vibrant ideal
                  society.
                </li>
              </ul>
            </p>
          </div>
        </ContainerBox>
      </Container>
    </Section>
    <Footer />
    </>
  );
};

export default withLayout(About);