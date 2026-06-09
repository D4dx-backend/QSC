import React, { useState, useEffect } from "react";
import Message from "../../core/message";
import { NoData } from "../../core/list/styles";
import { getData } from "../../../backend/api";
import { useParams } from "react-router-dom";
import { changeThemeColor } from "../../../store/actions/theme";
import { useDispatch, useSelector } from "react-redux";
import { logo, mobLogo } from "../../../images";
import { MinimalLandingPageSkeleton } from "../../core/loader/shimmer";
import { projectSettings } from "../../project/brand/project";

export const LandingLayout = (WrappedComponent) => (url) => {
  return (props) => {
    const { id, slug } = useParams();
    const [message, setMessage] = useState({
      type: 1,
      content: "Message!",
      okay: "Start Over",
    });
    const themeColors = useSelector((state) => state.themeColors);
    const [showMessage, setShowMessage] = useState(false);
    const [showLoader, setShowLoader] = useState(true); // Initially show loader
    const [isWhitelisted, setIsWhitelisted] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [response, serResponse] = useState(null);

    // const [loaderMessage, setLoaderMessage] = useState(false);
    const [user] = useState(JSON.parse(localStorage.getItem("--token")) ?? null);
    const dispatch = useDispatch();
    const setLoaderBox = (status, message = null) => {
      setShowLoader(status);
      // setLoaderMessage(message);
    };

    const setMessageBox = (messageContent) => {
      setMessage(messageContent);
      setShowMessage(true);
    };

    const closeMessage = () => {
      setMessage({ ...message, onClose: null });
      setShowMessage(false);
    };

    useEffect(() => {
      const fetchData = async () => {
        setIsLoaded(true);
        if (isWhitelisted === null) {
          let hostname = window.location.hostname;
          if (hostname === "localhost" && window.location.port !== "") {
            // Append port number if not default for localhost
            hostname += `:${window.location.port}`;
          }

          const isAdminDomain = window.location.href.includes("app.eventhex.ai") || window.location.href.includes("admin.eventhex.co") || window.location.href.includes("event-hex-saad-vite-mzmxq.ondigitalocean.app") || window.location.href.includes("localhost") || projectSettings.adminDomains?.includes(hostname);
          const response = isAdminDomain
            ? {
                data: {
                  success: true,
                  message: "Domain is whitelisted",
                  isWhitelisted: true,
                  response: {
                    _id: "65f44d2fc067bedb82145f6e",
                    domain: hostname,
                    event: {
                      _id: "66ca1b63a336dc65471c3a15",
                      title: "Eventhex Admin Panel",
                      __v: 0,
                      franchise: {
                        _id: "659fd2669308e8d4d1ffdeea",
                      },
                      logo: logo,
                    },
                    status: true,
                    createdAt: "2024-03-15T13:29:19.953Z",
                    updatedAt: "2024-03-15T13:29:19.953Z",
                    __v: 0,
                    route: "admin",
                  },
                  configs: [],
                },
              }
            : await getData(id ? { event: id, slug, ...user } : { domain: hostname, slug, ...user }, url);
          setIsWhitelisted(response.data?.isWhitelisted);
          const faviconUrl = isAdminDomain ? mobLogo : import.meta.env.VITE_CDN + response.data.response?.event?.logo;
          if (response.data.response?.event?.logo) {
            const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
            link.rel = "icon";
            link.href = faviconUrl;
            document.head.appendChild(link);
          }
          if (response.data?.response?.route === "event" || response.data?.response?.route === "checkout" || response.data?.response?.route === "single") {
            const tempTheme = {
              ...themeColors,
              theme: response.data.response.event.themeColor,
              themeBackground: response.data.response.event.themeColor,
              themeForeground: response.data.response.event.themeTextColor,
              secondaryColor: response.data.response.event.secondaryColor,
              secondaryTextColor: response.data.response.event.secondaryTextColor,
            };
            document.title = `${response.data.response?.event?.title}`;
            // Update meta tags for SEO
            const metaDescription = document.createElement("meta");
            metaDescription.name = "description";
            metaDescription.content = response.data.response?.event?.description;
            document.head.appendChild(metaDescription);

            !id && dispatch(changeThemeColor(tempTheme));

            if (response.data.response?.event?.trackingCode) {
              const trackingCode = response.data.response?.event?.trackingCode;
              const script1 = document.createElement("script");
              script1.innerHTML = ` (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src= 'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f); })(window,document,'script','dataLayer','${trackingCode}'); `;
              document.head.appendChild(script1);

              // Second script
              const script2 = document.createElement("script");
              script2.src = `https://www.googletagmanager.com/ns.html?id='${trackingCode}`;
              script2.async = true;
              document.head.appendChild(script2);
            }
          }
          console.log(response.settings);
          serResponse(response);
          setShowLoader(false); // Hide loader after fetching data}
        }
      };
      if (!isLoaded) {
        fetchData();
      }
    }, [id, isWhitelisted, isLoaded, themeColors, dispatch, slug, user]);

    // const [isWhitelisted] = useState(response.data.isWhitelisted);
    // const [data] = useState(response.data.response);
    // const [config] = useState(response.data.configs ?? []);
    // const [additionalMenus] = useState(response.data.additionalMenusList ?? []);
    // const [theme] = useState(themeColors);
    return isWhitelisted === true ? (
      <React.Fragment>
        <WrappedComponent {...props} theme={themeColors} id={id ?? ""} slug={slug} data={{ ...response.data.response, event: { ...response.data.response.event, settings: response.settings } }} colors={response.data.colors} isWhitelisted={response.data.isWhitelisted} config={response.data.configs ?? []} additionalMenus={response.data.additionalMenusList ?? []} setLoaderBox={setLoaderBox} setMessage={setMessageBox}></WrappedComponent>
        {showMessage && <Message message={message} closeMessage={closeMessage} setLoaderBox={setLoaderBox} showMessage={showMessage}></Message>}
        {showLoader && <MinimalLandingPageSkeleton></MinimalLandingPageSkeleton>}
      </React.Fragment>
    ) : isWhitelisted === null ? (
      <MinimalLandingPageSkeleton></MinimalLandingPageSkeleton>
    ) : (
      <NoData style={{ margin: "auto", display: "flex", height: "100vh", flexDirection: "column", gap: "10px" }} className="noshadow white-list">
        Page Not Found!
      </NoData>
    );
  };
};

export default LandingLayout;
