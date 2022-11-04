import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ItemDetail from "./pages/ItemDetail";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import About from "./pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "shop/:productCategory",
        element: <Shop />,
      },
      {
        path: "itemdetail/:id",
        element: <ItemDetail />,
      },
      {
        path: "signin",
        element: <Signin />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
