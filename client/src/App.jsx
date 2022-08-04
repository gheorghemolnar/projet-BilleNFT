import { Outlet, useRoutes } from "react-router-dom";

import { EthProvider } from "./contexts/EthContext";
import Navbar from "./components/Navbar";
import Listing from "./components/Listing";
import FormEvent from "./components/FormEvent";
import ViewEvent from "./components/ViewEvent";
import FormTicket from "./components/FormTicket";
import NoMatch from "./components/NoMatch";
import "./App.css";

export default function App() {
  let routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { 
            index: true, element: <Listing />,
        },
        {
          path: "/events/:id",
          element: <ViewEvent />,
        },
        {
          path: "/addevent",
          element: <FormEvent />,
        },
        {
          path: "/buyticket",
          element: <FormTicket />,
        },
        { path: "*", element: <NoMatch /> },
      ],
    },
  ];
  let element = useRoutes(routes);

  return (
    <EthProvider>
      {element}
    </EthProvider>
  );
}


function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}