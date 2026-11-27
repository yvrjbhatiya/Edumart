/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Checkbox from "@mui/material/Checkbox";
import { useDispatch, useSelector } from "react-redux";
import { selectWishlistItems } from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { addToCartAsync, selectCartItems } from "../../cart/CartSlice";
import { motion } from "framer-motion";

export const ProductCard = ({
  id,
  title,
  price,
  thumbnail,
  brand,
  stockQuantity,
  handleAddRemoveFromWishlist,
  isWishlistCard,
  isAdminCard,
}) => {
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const cartItems = useSelector(selectCartItems);
  const dispatch = useDispatch();
  const theme = useTheme();

  // Media Queries
  const is408 = useMediaQuery(theme.breakpoints.down(408));
  const is488 = useMediaQuery(theme.breakpoints.down(488));
  const is752 = useMediaQuery(theme.breakpoints.down(752));

  const isProductAlreadyInWishlist = wishlistItems.some(
    (item) => item.product._id === id
  );
  const isProductAlreadyInCart = cartItems.some(
    (item) => item.product._id === id
  );

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    const data = { user: loggedInUser?._id, product: id };
    dispatch(addToCartAsync(data));
  };

  return (
    <>
      {isProductAlreadyInWishlist !== -1 ? (
        <Stack
          component={isAdminCard || isWishlistCard || is408 ? "" : Paper}
          elevation={0}
          p={{ xs: 1.25, sm: 1.75 }}
          spacing={1.5}
          width={is408 ? "auto" : is488 ? "200px" : is752 ? "300px" : "340px"}
          onClick={() => navigate(`/product-details/${id}`)}
          sx={{
            cursor: "pointer",
            borderRadius: "20px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            transition: "transform .3s ease, box-shadow .3s ease, border-color .3s ease",
            "&:hover": {
              transform: "translateY(-6px)",
              borderColor: "#C7D2FE",
              boxShadow: "0 18px 40px rgba(79, 70, 229, 0.16)",
            },
            "&:hover .product-img": { transform: "scale(1.06)" },
          }}
        >
          {/* Image Section */}
          <Stack
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: "14px",
              background: "linear-gradient(160deg, #F5F7FF 0%, #EEF2FF 100%)",
              p: 1.5,
            }}
          >
            <img
              className="product-img"
              width={"100%"}
              style={{
                aspectRatio: 1 / 1,
                objectFit: "contain",
                height: "fit-content",
                transition: "transform .45s ease",
              }}
              src={thumbnail}
              alt={`${title} photo unavailable`}
            />

            {/* Wishlist heart floats over the image */}
            {!isAdminCard && (
              <motion.div
                style={{ position: "absolute", top: 8, right: 8 }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.3, type: "spring" }}
              >
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={isProductAlreadyInWishlist}
                  onChange={(e) => handleAddRemoveFromWishlist(e, id)}
                  icon={<FavoriteBorder fontSize="small" />}
                  checkedIcon={<Favorite fontSize="small" sx={{ color: "#EF4444" }} />}
                  sx={{
                    p: 0.75,
                    color: "text.secondary",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.12)",
                    "&:hover": { backgroundColor: "#fff" },
                  }}
                />
              </motion.div>
            )}

            {stockQuantity <= 20 && (
              <Typography
                component="span"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  px: 1,
                  py: 0.25,
                  borderRadius: 999,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#B91C1C",
                  backgroundColor: "#FEE2E2",
                }}
              >
                {stockQuantity === 1 ? "Last one!" : "Few left"}
              </Typography>
            )}
          </Stack>

          {/* Details Section */}
          <Stack spacing={0.5} px={0.5} pb={0.5}>
            <Typography
              variant="caption"
              noWrap
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {brand}
            </Typography>
            <Typography
              variant="h6"
              fontWeight={600}
              noWrap
              sx={{ color: "text.primary" }}
            >
              {title}
            </Typography>

            {/* Price and Add to Cart */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              pt={0.75}
              gap={1}
            >
              <Typography
                variant="h5"
                component="span"
                sx={{ color: "text.primary", fontWeight: 800 }}
              >
                ₹{price}
              </Typography>
              {!isWishlistCard &&
                loggedInUser?.isAdmin === false &&
                (isProductAlreadyInCart ? (
                  <motion.div
                    style={{
                      padding: "8px 14px",
                      border: "1.5px solid #C7D2FE",
                      borderRadius: 999,
                      color: "#4F46E5",
                      backgroundColor: "#EEF2FF",
                      fontWeight: 600,
                      cursor: "not-allowed",
                      fontSize: is408 ? ".85rem" : ".78rem",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ✓ In Cart
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={(e) => handleAddToCart(e)}
                    style={{
                      padding: "9px 16px",
                      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      outline: "none",
                      border: "none",
                      borderRadius: 999,
                      cursor: "pointer",
                      color: "white",
                      fontWeight: 600,
                      fontFamily: "inherit",
                      boxShadow: "0 6px 14px rgba(79,70,229,0.3)",
                      fontSize: is408 ? ".85rem" : ".78rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span>Add To Cart</span>
                  </motion.button>
                ))}
            </Stack>
          </Stack>
        </Stack>
      ) : (
        ""
      )}
    </>
  );
};
