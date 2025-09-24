import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./i18n";

import { useBootstrap } from "./hooks/ui/useBootstrap";

import { PreLoader } from "./components/ui/loaders/PreLoader";
import { router } from "./router";

import { store } from "./store/store";

import "./index.css";

const Root = () => {
  const { ready, fadeOut } = useBootstrap();

  if (!ready) {
    return <PreLoader fadeOut={fadeOut} />;
  }

  return <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>,
);
