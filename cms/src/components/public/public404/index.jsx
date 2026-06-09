import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addPageObject } from "../../../store/actions/pages";
import { NoData } from "../../core/list/styles";
import Loader from "../../core/loader";
import { useRef } from "react";

const Public404 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const param = useParams();
  const [slug] = useState(param["*"]);
  const userData = useSelector((state) => state.pages);
  const [page, setPage] = useState(null);
  useEffect(() => {
    const alldata = userData[`whitelisted-domains/page-details?slug=${slug}`] ?? {
      data: null,
      isLoading: true,
      error: null,
    };
    // setLoaderBox(alldata.isLoading);
    if (alldata.data?.configs) {
      if (alldata.data.configs.targetType === "External Url") {
        window.location.href = alldata.data.configs.url;
      } else {
        setPage(alldata.data);
        document.title = `${alldata.data.configs.title} - ${alldata.data?.response.event?.title}`;
        // Update meta tags for SEO
        const metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        metaDescription.content = alldata.data?.response.event?.description;
        document.head.appendChild(metaDescription);

        const faviconUrl = import.meta.env.VITE_APP_CDN + alldata.data?.response.event?.logo;
        if (alldata.data?.response.event?.logo) {
          const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
          link.rel = "icon";
          link.href = faviconUrl;
          document.head.appendChild(link);
        }
        if (alldata.data.response?.event?.trackingCode) {
          const trackingCode = alldata.data.response?.event?.trackingCode;
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
    }
  }, [userData, slug]);
  const iframeRef = useRef(null);
  useEffect(() => {
    dispatch(addPageObject(`whitelisted-domains/page-details?slug=${slug}`, 0, { domain: window.location.hostname }, 0));
  }, [dispatch, slug]);
  return page ? (
    page?.isWhitelisted ? (
      page.configs.targetType === "IFrame" ? (
        <React.Fragment>
          <iframe ref={iframeRef} onLoad={() => setIsLoading(false)} style={{ display: "flex", height: "100vh", width: "100%", overflow: "auto" }} title="QTicket" src={page.configs.url} frameBorder="0" />
          {isLoading && <Loader></Loader>}
        </React.Fragment>
      ) : (
        <div>{page.configs.pageData}</div>
      )
    ) : (
      <NoData style={{ margin: "auto", display: "flex", height: "100vh", flexDirection: "column", gap: "10px" }} className="noshadow white-list">
        Something Went Wrong!
      </NoData>
    )
  ) : (
    <Loader></Loader>
  );
};

export default Public404;
