import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
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
          element: <Navigate to="my-info" replace />,
        },
        {
          path: "profile/my-info",
          element: <Profile />,
        },
        {
          path: "profile/my-collections",
          element: <MyCollections />,
        },
        {
          path: "profile/my-articles",
          element: <MyArticles />,
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
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        transition={Zoom}
      />
    </>
  );
}

export default App;
