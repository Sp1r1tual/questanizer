import React from "react";
import ReactDOM from "react-dom/client";
import { reportWebVitals } from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { checkAuth } from "./store/auth/authThunks";
import { setAuthChecked } from "./store/auth/authSlice";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

const token = localStorage.getItem("token");

if (token) {
    store.dispatch(checkAuth()).finally(() => {
        renderApp();
    });
} else {
    store.dispatch(setAuthChecked(true));
    renderApp();
}

function renderApp() {
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </React.StrictMode>
    );
    reportWebVitals();
}
