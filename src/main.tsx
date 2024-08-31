import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import AppContextProvider from "./contexts/AppContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContextProvider>
          <AuthProvider>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </AuthProvider>
        </AppContextProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
