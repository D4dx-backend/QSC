import React, { useMemo } from "react";
import { RowContainer } from "../../styles/containers/styles";
import { PageHeader } from "../input/heading";
import { getValue } from "../list/functions";
import { Header, Page } from "../list/manage/styles";
import { Overlay } from "../list/create/styles";
import { IconButton } from "../elements";
import HeaderActions from "../list/popup/headerActions";

const PopupView = React.memo(
  ({ headerActions=[], themeColors, closeModal, itemTitle, description = "", popupData, customClass, openData }) => {
    const titleValue = useMemo(() => {
      return (itemTitle.collection?.length > 0 ? openData?.data?.[itemTitle.collection]?.[itemTitle.name] : openData?.data?.[itemTitle.name]) ?? "Please update the itemTitle.";
    }, [itemTitle, openData]);

    return (
      <Overlay key={openData.data._id} className={`${customClass ?? "medium"}`}>
        <Page className={`${customClass ?? "medium"} popup-child`}>
          <Header className="custom flex items-center justify-between">
            {itemTitle.render ? itemTitle.render(titleValue, openData) : <PageHeader title={getValue(itemTitle, titleValue)} line={false} description={description}></PageHeader>}
            <div className="flex items-center gap-2 right-0 left-auto text-right justify-end w-full">
              {headerActions.length === 0 ? null : <HeaderActions openData={openData} actions={headerActions}></HeaderActions>}
              <IconButton icon="back" theme={themeColors} ClickEvent={closeModal}></IconButton>
            </div>
          </Header>
          <RowContainer theme={themeColors} className={`${customClass ?? "medium"} popup-data`}>
            {popupData}
          </RowContainer>
        </Page>
      </Overlay>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.themeColors === nextProps.themeColors && prevProps.itemTitle === nextProps.itemTitle && prevProps.description === nextProps.description && prevProps.customClass === nextProps.customClass && prevProps.openData.data._id === nextProps.openData.data._id;
  }
);

export default PopupView;
