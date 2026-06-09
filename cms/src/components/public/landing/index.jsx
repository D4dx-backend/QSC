import React, { useEffect } from "react";
import Hero from "./Hero";
import withLayout from "../layout";
import Header from "./Header";
import Footer from "./footer/footer";

//src/components/styles/page/index.js
//if you want to write custom style wirte in above file
const Landing = (props) => {
  //to update the page title
  useEffect(() => {
    document.title = `Quran Study Centre, Kerala`;
  }, []);

  return (
    <>
      <Header {...props} />
      <Hero {...props} />
      <Footer {...props} />
    </>
  );
};

export default withLayout(Landing);
