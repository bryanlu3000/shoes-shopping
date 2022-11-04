import "@fontsource/noto-sans/300.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ShoppingContextProvider } from "./context/ShoppingContext";
import { AuthContextProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import theme from "./theme";
import "./css/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <ShoppingContextProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
          </Provider>
        </ShoppingContextProvider>
      </AuthContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);
