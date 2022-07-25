import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import RouterComponent from "./components/router";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterComponent />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

