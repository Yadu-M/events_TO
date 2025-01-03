import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { Event } from "./Event.tsx";
import { Error } from "./Error.tsx";

const rootElemet = document.getElementById("root");

if (rootElemet)
  createRoot(rootElemet).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} errorElement={<Error />} />
          <Route
            path="event/:eventId"
            element={<Event />}
            errorElement={<Error key={1}/>}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
