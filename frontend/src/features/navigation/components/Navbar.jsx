import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, Badge, Stack, Divider } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../user/UserSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectCartItems } from "../../cart/CartSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { logoPng } from "../../../assets";

export const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    { name: "Home", to: "/" },
    ...(!loggedInUser?.isAdmin ? [{ name: "Profile", to: "/profile" }] : []),
    {
      name: loggedInUser?.isAdmin ? "Orders" : "My orders",
      to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders",
    },
    { name: "Logout", to: "/logout" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "white",
        boxShadow: "none",
        color: "text.primary",
      }}
    >
      <Toolbar
        sx={{
          p: 1,
          height: "4rem",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 1rem",
        }}
      >
        {/* Left side - Logo & Title */}
        <Stack
          component={Link}
          to="/"
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          <Box
            component="img"
            src={logoPng}
            alt="Edumart logo"
            sx={{
              height: "3rem",
              width: "3rem",
              objectFit: "contain",
              display: "block",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#384959",
              letterSpacing: "0.5px",
              lineHeight: 1,
            }}
          >
            EDUMART
          </Typography>
        </Stack>

        {/* Right side - User menu/icons OR Login button */}
        <Stack direction="row" spacing={2} alignItems="center">
          {loggedInUser ? (
            <>
              {/* User Menu */}
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userInfo?.name} src="null" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {/* User name at the top of dropdown */}
                <MenuItem sx={{ pointerEvents: "none" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: "#384959" }}
                  >
                    {userInfo?.name}
                  </Typography>
                </MenuItem>
                <Divider />

                {loggedInUser?.isAdmin && (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      component={Link}
                      sx={{ textDecoration: "none", color: "#384959" }}
                      to="/admin/add-product"
                    >
                      Add new Product
                    </Typography>
                  </MenuItem>
                )}
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Typography
                      component={Link}
                      sx={{ textDecoration: "none", color: "#384959" }}
                      to={setting.to}
                    >
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

              {/* Cart Icon */}
              {!loggedInUser?.isAdmin && cartItems?.length > 0 && (
                <Badge badgeContent={cartItems.length} color="error">
                  <IconButton onClick={() => navigate("/cart")}>
                    <ShoppingCartOutlinedIcon sx={{ color: "#384959" }} />
                  </IconButton>
                </Badge>
              )}

              {/* Wishlist Icon (only for non-admin users) */}
              {!loggedInUser?.isAdmin && (
                <Badge badgeContent={wishlistItems?.length} color="error">
                  <IconButton component={Link} to="/wishlist">
                    <FavoriteBorderIcon sx={{ color: "#384959" }} />
                  </IconButton>
                </Badge>
              )}

              {/* Admin Badge */}
              {loggedInUser?.isAdmin && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{
                    borderRadius: "16px",
                    textTransform: "none",
                    px: 2,
                    color: "#384959",
                    backgroundColor: "#bdddfc",
                  }}
                >
                  Admin
                </Button>
              )}
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="small"
              disableElevation
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                px: 2.5,
                py: 0.75,
                fontWeight: 600,
                backgroundColor: "#384959",
                "&:hover": {
                  backgroundColor: "#2b3946",
                },
              }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
      <Divider />
    </AppBar>
  );
};

export default Navbar;
