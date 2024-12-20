import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import AdBanner from "./AdBanner";
import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SignIn from "auth/SignIn";

const Header = ({ LoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserData(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handlePlaceAdClick = (e) => {
    e.preventDefault();
    if (isLoggedIn && userData) {
      navigate('/my-profile/placeAd');
    } else {
      setIsSignInOpen(true);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openSignInModal = () => {
    setIsSignInOpen(true);
    setIsSignupOpen(false);
  };

  const closeSignInModal = () => {
    setIsSignInOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupOpen(true);
    setIsSignInOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUserData(storedUser);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    // Dispatch storage event manually since it doesn't fire for same window
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user',
      newValue: null,
      oldValue: localStorage.getItem('user')
    }));
    setUserData(null);
    setIsLoggedIn(false);
    handleMenuClose();
  };
  return (
    <header className="header">
      <div className="top-header">
        <div className="container d-flex justify-content-between align-items-center">
          <div style={{ marginRight: "15px" }} className="logo">
            <Link to="/" className="nav-link">
              {" "}
              <img
                src={`${process.env.PUBLIC_URL}/logo.png`}
                alt="logo"
                className="logo-img"
              />
            </Link>
          </div>
          <AdBanner
            size="medium"
            image="https://xclusiveboatclub.com/wp-content/uploads/2024/08/third-header-webp.webp"
          />
          <nav className="top-nav">
            <ul
              className="list-unstyled d-flex mb-0 align-items-center"
              style={{ width: "max-content" }}
            >
              <li>
                <a href="#" className="nav-link">
                  <i className="fas fa-bell"></i> Notifications
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <i className="fas fa-search"></i> My Searches
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <i className="fas fa-heart"></i> Favorites
                </a>
              </li>
              <li>
                <a href="#" className="nav-link">
                  <i className="fas fa-comment"></i> Chats
                </a>
              </li>
              {isLoggedIn && userData ? (
                <li>
                  <Button
                    onClick={handleMenuOpen}
                    endIcon={<ArrowDropDownIcon />}
                    style={{ textTransform: "none" }}
                  >
                    <Avatar sx={{ width: 32, height: 32, marginRight: 1 }}>
                      {getInitials(userData.username)}
                    </Avatar>
                    {userData.username.length > 10
                      ? `${userData.username.substring(0, 10)}...`
                      : userData.username}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/my-profile/myAds"
                    >
                      My Ads
                    </MenuItem>
                    
                    <MenuItem
                      onClick={handleMenuClose}
                      component={Link}
                      to="/my-profile"
                    >
                      My Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Sign out</MenuItem>
                  </Menu>
                </li>
              ) : (
                <li>
                  <a href="#" className="nav-link" onClick={openSignInModal}>
                    Log in or sign up
                  </a>
                </li>
              )}
               <Link to="/my-profile/placeAd">
                <li>
                  <button className="btn " style={{backgroundColor:'#003478' , color:'white'}} onClick={handlePlaceAdClick}>
                    Place Your Ad
                  </button>
                </li>
              </Link>
            </ul>
          </nav>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <GiHamburgerMenu size={24} />
          </button>
        </div>
      </div>
      <nav className={`main-nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="container">
          <ul className="list-unstyled d-flex justify-content-between mb-0">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/buysellboats" className="nav-link"  component={Link}>
                Buy & Sell Boats <span className="badge bg-success">NEW</span>
              </Link>
            </li>
            <li>
              <Link to="/tips-advice" className="nav-link">
                Tips & Advice
              </Link>
            </li>
            <li>
              <Link to="/marinas" className="nav-link">
                Marinas
              </Link>
            </li>
            <li>
              <Link to="/fishing-tour" className="nav-link">
                Fishing
              </Link>
            </li>
            <li>
              <Link to="/water-sport" className="nav-link">
                Water Sports
              </Link>
            </li>
            <li>
              <Link to="/scubas" className="nav-link">
                Scuba
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* SignIn Modal */}
      <SignIn
        open={isSignInOpen}
        onClose={closeSignInModal}
        openSignup={openSignupModal}
        isSignupOpen={isSignupOpen}
        closeSignup={closeSignupModal}
        onOpenSignIn={openSignInModal}
        onLogin={handleLogin}
      />
    </header>
  );
};

export default Header;
