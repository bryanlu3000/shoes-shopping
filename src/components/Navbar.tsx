import { useState } from "react";
import { useShopping } from "../context/ShoppingContext";
import { useAuthContext } from "../context/AuthContext";
import { useAppSelector } from "../redux/reduxTypedHooks";
import { getCartItems } from "../redux/ShopSlice";
import { Circle, useDisclosure } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import ShoppingCart from "./ShoppingCart";
import SignoutAlert from "./SignoutAlert";
import "../css/navbar.css";

export default function Navbar() {
  const [navToggle, setNavToggle] = useState(false);
  const [stickyToggle, setStickyToggle] = useState(false);
  const { isHomepage, openShoppingCart } = useShopping();
  const { isLogin } = useAuthContext();
  const cartItems = useAppSelector(getCartItems);

  window.onscroll = () => {
    if (window.scrollY > 0) setStickyToggle(true);
    else setStickyToggle(false);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <>
      <nav
        className={`navbar ${stickyToggle && "sticky"} ${
          isHomepage ? "homepage" : "otherpage"
        }`}
      >
        <div className="nav-container container flex">
          <Link to="/" className="brand">
            Brand
          </Link>

          <ul className={`nav-ul flex ${navToggle && "active"}`}>
            <li>
              <Link to="/"> Event </Link>
            </li>
            <li>
              <Link to="/shop/all"> Shop </Link>
            </li>
            <li>
              <Link to="/about"> About </Link>
            </li>
            <div className="nav-close-btn">
              <i
                className="fas fa-times close-btn"
                onClick={() => setNavToggle((prev) => !prev)}
              ></i>
            </div>
          </ul>

          <div className="nav-icons flex">
            <div className="nav-btn">
              {isLogin ? (
                <>
                  <i className="fa fa-sign-out" onClick={() => onOpen()}></i>
                  <span className="tooltip-text">Sign out</span>
                </>
              ) : (
                <>
                  <i
                    className="fa fa-user"
                    onClick={() => navigate("/signin")}
                  ></i>
                  <span className="tooltip-text">Sign in</span>
                </>
              )}
            </div>

            <div className="nav-btn">
              <i className="fa fa-shopping-cart" onClick={openShoppingCart}>
                {cartItems.length > 0 && (
                  <Circle
                    size="12px"
                    bg="tomato"
                    style={{ position: "absolute", top: "-20%", right: "-30%" }}
                  ></Circle>
                )}
              </i>
              <span className="tooltip-text">Shopping Cart</span>
            </div>

            <div className="nav-menu-btn">
              <i
                className="fas fa-bars menu-btn"
                onClick={() => setNavToggle((prev) => !prev)}
              ></i>
            </div>
          </div>
        </div>
      </nav>

      <ShoppingCart />
      <SignoutAlert isOpen={isOpen} onClose={onClose} />
    </>
  );
}
