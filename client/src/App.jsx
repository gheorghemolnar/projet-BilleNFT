import { Outlet, useRoutes } from "react-router-dom";

import { EthProvider } from "./contexts/EthContext";
import Navbar from "./components/Navbar";
import Menu from "./components/Menu";
import Listing from "./components/Listing";
import ListingTickets from "./components/ListingTickets";
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
          path: "/events",
          children: [
            {
              path: "/events/:id/buyticket",
              element: <FormTicket />,
            },
            {
              path: "/events/:id",
              element: <ViewEvent />
            },
            {
              path: "/events/add",
              element: <FormEvent />
            },
          ]
        },
        {
          path: "/mytickets",
          element: <ListingTickets />
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
      <Menu />
      <Outlet />
    </>
  );
}