import React, { useState } from "react";
import "./Navbar.css";
import image1 from "../images/amaz.png";
import imgIND from "../images/ind.png";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { useDispatch, useSelector } from "react-redux";
import { logoutRedux } from "../redux/userSlice";
function Navbar() {
  const [{ basket }] = useStateValue();
  const userData = useSelector((state) => state.users);
  console.log(userData);
  const dispatch= useDispatch()
  //handle language
  const [showLanguage, hideLanguage] = useState(false);
  const handleLanguage = () => {
    hideLanguage((preve) => !preve);
  };
//handle login logout
const [ShowLoginOut, hideLoginOut] = useState(false);
const handleLoginOut = () => {
  hideLoginOut((preve) => !preve);
}
const handleLogout = () => {
  dispatch(logoutRedux())
}

  return (
    <div className="mainCont">
      <div className="main-div1">
        <div className="logo">
          <Link to="/">
            <img className="logo-img" src={image1} alt="image" />
          </Link>
        </div>
        <div className="nav-option2">
          <LocationOnIcon />
          <div className="location-nav" >
          {userData.name ? (
            <span className="option-line1">{"Deliver to " + userData.name}</span>
          ) :(
            <span className="option-line1">Delivery address</span>
          )}
          {userData.city ? (
             <span className="option-line2">{ userData.city + " "+ userData.pincode}</span>
          ) : (
            <span className="option-line2">City & PinCode</span>
          )}
            </div>
        </div>
        <div className="header-search">
          <input className="header-searchInput" type="text" />
          <SearchIcon className="header-searchIcon" />
        </div>
        <div className="header-nav">
          <div className="nav-option3" onClick={handleLanguage}>
            <img className="Flag-img" src={imgIND} />
            <span className="language">EN</span>
          </div>
          {/* {showLanguage && (
            <div className="language-cont">
              <span>English</span>
              <span>English</span>
              <span>English</span>
              <span>English</span>
              <span>English</span>
            </div>
          )} */}
         
            <div className="nav-option" onClick={handleLoginOut}>
              {userData.name ? (
                <span className="option-line1">{"Hello " + userData.name}</span>
              ) : (
                <span className="option-line1">Hello, Sign in</span>
              )}
              <span className="option-line2">Account & Lists</span>
            </div>
          { ShowLoginOut && (
             
          <div className="LoginOut-cont">
            {userData.name ?<span onClick={handleLogout}>Log Out</span>: <Link to="/Login"><span>Login</span></Link>}
          </div>
          
          )}
          <Link to="/orders">
          <div className="nav-option">
            <span className="option-line1">Returns</span>
            <span className="option-line2">& Orders</span>
          </div>
          </Link>
          <Link to="/checkout">
            <div className="nav-option-cart">
              <ShoppingCartIcon
                sx={{ fontSize: 35 }}
                className="ShoppingCartI"
              />
              <span className="cart">Cart {basket?.length}</span>
            </div>
          </Link>
        </div>
      </div>
      <div className="main-div2">
        <div className="options-div2">
          <MenuIcon />
          <span>All</span>
        </div>
        <div className="options-div2">
          <span>Amazon miniTV</span>
        </div>
        <div className="options-div2">
          <span>Sell</span>
        </div>
        <div className="options-div2">
          <span>Amazon Pay</span>
        </div>
        <div className="options-div2">
          <span>Gift Cards</span>
        </div>
        <div className="options-div2">
          <span>Fashion</span>
        </div>
        <div className="options-div2">
          <span>Buy Again</span>
        </div>
        <div className="options-div2">
          <span>Gift Ideas</span>
        </div>
        <div className="options-div2">
          <span>Today's Deals</span>
        </div>
        <div className="options-div2">
          <span>Coupons</span>
        </div>
        <div className="options-div2">
          <span>Browsing History</span>
        </div>
        <div className="options-div2">
          <span>Books</span>
        </div>
        <div className="options-div2">
          <span>Customer Service</span>
        </div>
        <div className="options-div2">
          <span>Eshant's Amazon.in</span>
        </div>
        <div className="options-div2">
          <span>Healt, Household & Personal Care</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
