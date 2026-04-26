import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import store from "./reducers";
import { Provider } from "react-redux";

try {
  const root = createRoot(document.getElementById("root"));

  root.render(
    <Suspense
      fallback={
        <div id="sus-fallback">
          <h1>Loading</h1>
        </div>
      }
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>,
  );
} catch (e) {
  console.error('[index.jsx] Fatal error during app initialization:', e);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h1>Initialization Error</h1>
      <p>Error: ${e.message}</p>
      <pre>${e.stack}</pre>
    </div>
  `;
}
