import React, { useEffect } from "react";

const FontLoader = React.memo(({ fontName }) => {
  useEffect(() => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}:wght@100..800&display=swap`;

    // Create a new link element for font loading
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = fontUrl;

    // Append the font link to the document head
    document.head.appendChild(fontLink);

    // Define the CSS rule for global styles
    const cssRule = `  
      * {  
        font-family: "${fontName}", sans-serif;  
        box-sizing: border-box;  
      }  
    `;

    // Create a style element for global styles
    const styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(cssRule));

    // Append the style element to the document head
    document.head.appendChild(styleElement);

    // Clean up function
    return () => {
      // Remove the font link from the document head
      document.head.removeChild(fontLink);

      // Remove the style element from the document head
      document.head.removeChild(styleElement);
    };
  }, [fontName]); // Re-run effect if the fontName changes

  return null;
});

export default FontLoader;
