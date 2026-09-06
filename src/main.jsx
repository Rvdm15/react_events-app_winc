import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { Provider } from "./components/ui/provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { Toaster } from "./components/ui/toaster";
import { EventsProvider } from "./context/EventsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />, // toont de pagina met alle Events
        // loader: postListLoader,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />, // toont 1 specifiek Event
        // loader: postLoader,
        // action: addComment,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider>
      <EventsProvider>
        <RouterProvider router={router} />
        <Toaster />
      </EventsProvider>
    </Provider>
  </React.StrictMode>,
);
