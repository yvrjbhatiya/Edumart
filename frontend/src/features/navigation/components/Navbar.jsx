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
import { Box, Button, Badge, Stack, Divider, useScrollTrigger } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../user/UserSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectCartItems } from "../../cart/CartSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { logoPng } from "../../../assets";

const iconBtnSx = {
  color: "text.primary",
  backgroundColor: "rgba(79,70,229,0.06)",
  "&:hover": { backgroundColor: "rgba(79,70,229,0.14)", color: "primary.main" },
};

export const Navbar = () => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = useSelector(selectUserInfo);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const cartItems = useSelector(selectCartItems);
  const navigate = useNavigate();
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 8 });

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

  const menuLinkSx = {
    textDecoration: "none",
    color: "text.primary",
    fontWeight: 500,
    width: "100%",
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.96)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: scrolled ? "divider" : "transparent",
        boxShadow: scrolled ? "0 8px 24px rgba(15,23,42,0.06)" : "none",
        transition: "all .3s ease",
      }}
    >
      <Toolbar
        sx={{
          height: { xs: "3.75rem", sm: "4.25rem" },
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 1.5, sm: 3 },
        }}
      >
        {/* Left side - Logo & Title */}
        <Stack
          component={Link}
          to="/"
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ textDecoration: "none", cursor: "pointer" }}
        >
          <Box
            component="img"
            src={logoPng}
            alt="Edumart logo"
            sx={{
              height: { xs: "2.4rem", sm: "2.8rem" },
              width: { xs: "2.4rem", sm: "2.8rem" },
              objectFit: "contain",
              display: "block",
              transition: "transform .4s ease",
              "&:hover": { transform: "rotate(-8deg) scale(1.06)" },
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EDUMART
          </Typography>
        </Stack>

        {/* Right side - User menu/icons OR Login button */}
        <Stack direction="row" spacing={{ xs: 0.75, sm: 1.5 }} alignItems="center">
          {loggedInUser ? (
            <>
              {/* Wishlist Icon (only for non-admin users) */}
              {!loggedInUser?.isAdmin && (
                <Tooltip title="Wishlist">
                  <Badge badgeContent={wishlistItems?.length} color="error">
                    <IconButton component={Link} to="/wishlist" sx={iconBtnSx} aria-label="Wishlist">
                      <FavoriteBorderIcon fontSize="small" />
                    </IconButton>
                  </Badge>
                </Tooltip>
              )}

              {/* Cart Icon */}
              {!loggedInUser?.isAdmin && cartItems?.length > 0 && (
                <Tooltip title="Cart">
                  <Badge badgeContent={cartItems.length} color="error">
                    <IconButton onClick={() => navigate("/cart")} sx={iconBtnSx} aria-label="Cart">
                      <ShoppingBagOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Badge>
                </Tooltip>
              )}

              {/* Admin Badge */}
              {loggedInUser?.isAdmin && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "primary.main",
                    backgroundColor: "#EEF2FF",
                    border: "1px solid #C7D2FE",
                  }}
                >
                  Admin
                </Box>
              )}

              {/* User Menu */}
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.25 }}>
                  <Avatar
                    alt={userInfo?.name}
                    src="null"
                    sx={{
                      width: 38,
                      height: 38,
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                      boxShadow: "0 0 0 3px rgba(79,70,229,.15)",
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{ sx: { minWidth: 200 } }}
              >
                {/* User name at the top of dropdown */}
                <MenuItem sx={{ pointerEvents: "none" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {userInfo?.name}
                  </Typography>
                </MenuItem>
                <Divider />

                {loggedInUser?.isAdmin && (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography component={Link} sx={menuLinkSx} to="/admin/add-product">
                      Add new Product
                    </Typography>
                  </MenuItem>
                )}
                {settings.map((setting) => (
                  <MenuItem key={setting.name} onClick={handleCloseUserMenu}>
                    <Typography component={Link} sx={menuLinkSx} to={setting.to}>
                      {setting.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="small"
              sx={{ px: 3, py: 0.9 }}
            >
              Login
            </Button>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
