import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ShoppingCart from "./components/ShoppingCart";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ItemDetail from "./pages/ItemDetail";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/shop/:productCategory" element={<Shop />} />
      <Route path="/itemdetail/:id" element={<ItemDetail />} />
    </>
  )
);

function App() {
  return (
    <>
      <Navbar />
      <ShoppingCart />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
