import React, { useEffect, useState } from "react";
import { Card, Description, ImageBox, ImageConatner, Text, Title } from "./styles";
import { getData } from "../../../backend/api";
import { GetIcon } from "../../../icons";
import { ElementContainer, TabButtons } from "../elements";
import { NoData } from "../list/styles";
import { avathar } from "../../../images";
const CardView = ({ icon, imagePath, apiType, api = "API", _data = [], noData = "No data found!", otherDetails, tabs = false, selectedCard = () => {}, setSelectedTab = () => {}, selectedTab, tabItemsPath, setLoaderBox }) => {
  const [data, setData] = useState(_data);
  useEffect(() => {
    if (apiType === "API") {
      setLoaderBox(true);
      getData({}, `${api}`).then((response) => {
        console.log(response.data, "logging cardview");
        setData(response.data);
        setLoaderBox(false);
      });
    }
  }, [api, apiType, setLoaderBox]);

  return (
    <ElementContainer className="column">
      {data?.length > 0 ? (
        data.map((item, index) => (
          <Card key={`card-${index}-${item?.id}`} onClick={() => selectedCard(item)}>
            <ImageConatner>
              {imagePath && item[imagePath] !== null && item[imagePath] !== undefined ? (
                <ImageBox
                  onError={(e) => {
                    e.target.src = avathar;
                  }}
                  src={import.meta.env.VITE_CDN + item[imagePath]}
                  alt="Doctor Image"
                />
              ) : (
                <GetIcon icon={"dietitian"} />
              )}

              {icon && <GetIcon icon={icon} />}
            </ImageConatner>
            <Text>
              <Title>{item?.value}</Title>
              <Description>{item?.id}</Description>
              {otherDetails?.length > 0 &&
                otherDetails.map((details) => (
                  <Description>
                    {details?.label}: {item[details?.name]}
                  </Description>
                ))}
              {(tabs ? tabs : false) && (
                <ElementContainer className="row">
                  <TabButtons
                    direct={true}
                    selectedTab={selectedTab}
                    selectedChange={(value) => {
                      setSelectedTab(value);
                    }}
                    tabs={item[tabItemsPath].map((data) => ({
                      key: data?.id,
                      title: data?.value,
                    }))}
                  ></TabButtons>
                </ElementContainer>
              )}
            </Text>
          </Card>
        ))
      ) : (
        <NoData className="white-list">{noData}</NoData>
      )}
    </ElementContainer>
  );
};
export default CardView;
