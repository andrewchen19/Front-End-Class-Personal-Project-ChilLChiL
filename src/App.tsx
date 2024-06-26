import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

// toastify
import { ToastContainer, Zoom } from "react-toastify";

import {
  Article,
  Articles,
  EditArticle,
  Error,
  ForeignSpot,
  ForeignSpots,
  Landing,
  Layout,
  LocalSpot,
  LocalSpots,
  Login,
  MyArticles,
  MyCollections,
  PostArticle,
  Profile,
  ProfileLayout,
  Signup,
} from "./pages";

// framer motion
import { AnimatePresence } from "framer-motion";

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
        {
          path: "articles",
          element: <Articles />,
        },
        {
          path: "articles/:id",
          element: <Article />,
        },
        {
          path: "foreign-spots",
          element: <ForeignSpots />,
        },
        {
          path: "foreign-spots/:name/:id",
          element: <ForeignSpot />,
        },
        {
          path: "profile",
          element: <ProfileLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="/profile/my-info" replace />,
            },
            {
              path: "my-info",
              element: <Profile />,
            },
            {
              path: "my-collections",
              element: <MyCollections />,
            },
            {
              path: "my-articles",
              element: <MyArticles />,
            },
          ],
        },
        {
          path: "profile/post-article",
          element: <PostArticle />,
        },
        {
          path: "profile/edit-article/:id",
          element: <EditArticle />,
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
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        theme="dark"
        hideProgressBar
        transition={Zoom}
      />
    </>
  );
}

export default App;
