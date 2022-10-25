import { useState } from "react";
import { useShopping } from "../context/ShoppingContext";
import { useAppSelector } from "../redux/reduxTypedHooks";
import { getCartItems } from "../redux/ShopSlice";
import { Circle } from "@chakra-ui/react";
import "../css/navbar.css";

export default function Navbar() {
  const [navToggle, setNavToggle] = useState(false);
  const [stickyToggle, setStickyToggle] = useState(false);
  const { isHomepage, onOpen } = useShopping();
  const cartItems = useAppSelector(getCartItems);

  window.onscroll = () => {
    if (window.scrollY > 0) setStickyToggle(true);
    else setStickyToggle(false);
  };

  return (
    <nav
      className={`navbar ${stickyToggle && "sticky"} ${
        isHomepage ? "homepage" : "otherpage"
      }`}
    >
      <div className="nav-container container flex">
        <a href="/" className="brand">
          Brand
        </a>
        <ul className={`nav-ul flex ${navToggle && "active"}`}>
          <li>
            <a href="/"> Event </a>
          </li>
          <li>
            <a href="/shop/all"> Shop </a>
          </li>
          <li>
            <a href="#"> About </a>
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
            <i className="fa fa-user"></i>
            <span className="tooltip-text">Sign In</span>
          </div>
          <div className="nav-btn">
            <i className="fa fa-shopping-cart" onClick={onOpen}>
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
  );
}
