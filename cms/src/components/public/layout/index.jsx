import React, { useState } from "react";
import Loader from "../../core/loader";
import Message from "../../core/message";
// import Login from "../../../public/login";
const withLayout = (WrappedComponent) => {
  return (props) => {
    const [message, setMessage] = useState({
      type: 1,
      content: "Message!",
      okay: "Start Over",
    });
    const [showMessage, setShowMessage] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const setLoaderBox = (status) => {
      setShowLoader(status);
    };
    const setMessageBox = (messageContent) => {
      setMessage(messageContent);
      setShowMessage(true);
    };
    const closeMessage = () => {
      setMessage({ ...message, onClose: null });
      setShowMessage(false);
    };
    return (
      <React.Fragment>
        <WrappedComponent {...props} setLoaderBox={setLoaderBox} setMessage={setMessageBox}></WrappedComponent>
        {showMessage && <Message message={message} closeMessage={closeMessage} setLoaderBox={setLoaderBox} showMessage={showMessage}></Message>}
        {showLoader && <Loader></Loader>}
      </React.Fragment>
    );
  };
};

export default withLayout;
