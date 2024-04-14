import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  Error,
  Landing,
  Layout,
  LocalSpot,
  LocalSpots,
  Login,
  Signup,
} from "./pages";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Landing />,
        },
        {
          path: "local-spots",
          element: <LocalSpots />,
        },
        {
          path: "local-spots/:name/:id",
          element: <LocalSpot />,
        },
      ],
    },
    {
      path: "/log-in",
      element: <Login />,
    },
    {
      path: "/sign-up",
      element: <Signup />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
