import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./i18n/i18n.setup.ts";
import { store } from "./stores/index.ts";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <App />
    </Provider>
);
