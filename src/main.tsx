import "@fontsource/noto-sans/300.css";
import "@fontsource/noto-sans/400.css";
import "@fontsource/noto-sans/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { ShoppingProvider } from "./context/ShoppingContext";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import theme from "./theme";
import "./css/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ShoppingProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ShoppingProvider>
    </ChakraProvider>
  </React.StrictMode>
);
