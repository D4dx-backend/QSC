import "./App.css";
import PageRouter from "./components/router";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Toast, { ToastProvider } from "./components/core/toast";
import { UserProvider } from "./contexts/UserContext.jsx";
import { MessageProvider } from "./components/core/message/useMessage.jsx";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <ToastProvider>
      <MessageProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <UserProvider>
                <PageRouter />
              </UserProvider>
            </GoogleOAuthProvider>
          </QueryClientProvider>
          <Toast />
        </I18nextProvider>
      </MessageProvider>
    </ToastProvider>
  );
}
export default App;
