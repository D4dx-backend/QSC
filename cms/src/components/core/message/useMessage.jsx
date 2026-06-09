import React, { createContext, useContext, useState, useCallback } from "react";
import Message from "./index";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageState, setMessageState] = useState({ show: false, message: {} });

  const showMessage = useCallback((message) => {
    setMessageState({ show: true, message });
  }, []);

  const closeMessage = useCallback(() => {
    setMessageState((prev) => ({ ...prev, show: false }));
  }, []);

  return (
    <MessageContext.Provider value={{ showMessage, closeMessage }}>
      {children}
      <Message showMessage={messageState.show} message={messageState.message} closeMessage={closeMessage} />
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};
