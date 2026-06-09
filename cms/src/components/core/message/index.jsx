import { useTranslation } from "react-i18next";
import FormInput from "../input";
import { Content, Footer, Overlay, Page } from "./styles";
import { useEffect } from "react";
import { GetIcon } from "../../../icons";

const Message = (props) => {
  const { t } = useTranslation();

  const closeModal = async () => {
    try {
      if (typeof props.message.onClose === "function") {
        await props.message.onClose().then((status) => {
          (status ?? true) && props.closeMessage();
        });
      } else {
        props.closeMessage();
      }
    } catch (error) {
      console.error("Error in onClose:", error);
    }
  };

  const proceedAction = async () => {
    try {
      if (typeof props.message.onProceed === "function") {
        await props.message.onProceed(props.message?.data, props.message?.data?._id).then((status) => {
          (status ?? true) && props.closeMessage();
        });
      } else {
        props.closeMessage();
      }
    } catch (error) {
      console.error("Error in onProceed:", error);
    }
  };

  useEffect(() => {
    if (props.message.type === 1) {
      const timer = setTimeout(() => {
        typeof props.message.onClose === "function" && props.message.onClose();
        props.closeMessage();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [props]);

  const renderNotification = () => (
    <Overlay className={`${props.showMessage ? "" : "hidden"} notification`}>
      <Page className="notification">
        <Content className={`notification ${props.message.icon ?? "info"}`}>
          {props.message.icon && <GetIcon icon={props.message.icon} />}
          <div>
            {props.message.title && <strong style={{ display: "block", fontSize: "15px", marginBottom: "4px", fontWeight: "500" }}>{props.message.title}</strong>}
            <div dangerouslySetInnerHTML={{ __html: props.message.content }} />
          </div>
          <button onClick={closeModal} className="close-button" aria-label="Close notification">
            <GetIcon icon="close" />
          </button>
        </Content>
      </Page>
    </Overlay>
  );

  const renderConfirmation = () => (
    <Overlay className={`${props.showMessage ? "" : "hidden"} confirmation`}>
      <Page className="confirmation">
        <Content>
          <div dangerouslySetInnerHTML={{ __html: props.message.content }} />
        </Content>
        <Footer>
          <FormInput type="close" value={props.message.okay ? props.message.okay : t("cancel")} onChange={closeModal} />
          <FormInput type="submit" name="submit" value={props.message.proceed ? props.message.proceed : t("proceed")} onChange={proceedAction} />
        </Footer>
      </Page>
    </Overlay>
  );

  if (!props.showMessage) return null;

  return props.message.type === 1 ? renderNotification() : renderConfirmation();
};

export default Message;
