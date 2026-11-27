import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductByIdAsync,
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProducts,
  selectSelectedProduct,
} from "../ProductSlice";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  addToCartAsync,
  resetCartItemAddStatus,
  selectCartItemAddStatus,
  selectCartItems,
} from "../../cart/CartSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import {
  fetchReviewsByProductIdAsync,
  resetReviewFetchStatus,
  selectReviewFetchStatus,
  selectReviews,
} from "../../review/ReviewSlice";
import { Reviews } from "../../review/components/Reviews";
import { ProductCard } from "./ProductCard";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Favorite from "@mui/icons-material/Favorite";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { useTheme } from "@mui/material";
import Lottie from "lottie-react";
import { loadingAnimation } from "../../../assets";

const cardSx = {
  backgroundColor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: { xs: "20px", md: "28px" },
  boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 16px 40px rgba(15,23,42,.06)",
};

const perks = [
  {
    icon: <LocalShippingOutlinedIcon />,
    title: "Free Delivery",
    text: "Enter your postal code for availability",
  },
  {
    icon: <CachedOutlinedIcon />,
    title: "Easy Returns",
    text: "Free 30 days delivery returns",
  },
  {
    icon: <VerifiedUserOutlinedIcon />,
    title: "Secure Payments",
    text: "Your details are always protected",
  },
];

export const ProductDetails = () => {
  const { id } = useParams();
  const product = useSelector(selectSelectedProduct);
  const allProducts = useSelector(selectProducts);
  const loggedInUser = useSelector(selectLoggedInUser);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartItemAddStatus = useSelector(selectCartItemAddStatus);
  const [quantity, setQuantity] = useState(1);
  const reviews = useSelector(selectReviews);
  const theme = useTheme();
  const carouselRef = useRef(null);

  const is500 = useMediaQuery(theme.breakpoints.down(500));

  const wishlistItems = useSelector(selectWishlistItems);

  const isProductAlreadyInCart = cartItems.some(
    (item) => item.product._id === id
  );
  const isProductAlreadyinWishlist = wishlistItems.some(
    (item) => item.product._id === id
  );

  const productFetchStatus = useSelector(selectProductFetchStatus);
  const reviewFetchStatus = useSelector(selectReviewFetchStatus);

  const totalReviewRating = reviews.reduce(
    (acc, review) => acc + review.rating,
    0
  );
  const totalReviews = reviews.length;
  const averageRating = totalReviews
    ? parseInt(Math.ceil(totalReviewRating / totalReviews))
    : 0;

  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const navigate = useNavigate();

  // Trending products: exclude current item, prioritize higher-rated / stocked items
  const trendingProducts = (allProducts || [])
    .filter((item) => item._id !== id)
    .slice(0, 10);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductByIdAsync(id));
      dispatch(fetchReviewsByProductIdAsync(id));
    }
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProductsAsync({}));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (wishlistItemAddStatus === "fulfilled") {
      toast.success("Product added to wishlist");
    } else if (wishlistItemAddStatus === "rejected") {
      toast.error("Error adding product to wishlist, please try again later");
    }
  }, [wishlistItemAddStatus]);

  useEffect(() => {
    if (wishlistItemDeleteStatus === "fulfilled") {
      toast.success("Product removed from wishlist");
    } else if (wishlistItemDeleteStatus === "rejected") {
      toast.error(
        "Error removing product from wishlist, please try again later"
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching product details, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    if (reviewFetchStatus === "rejected") {
      toast.error("Error fetching product reviews, please try again later");
    }
  }, [reviewFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(resetProductFetchStatus());
      dispatch(resetReviewFetchStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const handleAddToCart = () => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    const item = { user: loggedInUser._id, product: id, quantity };
    dispatch(addToCartAsync(item));
    setQuantity(1);
  };

  const handleDecreaseQty = () => {
    if (quantity !== 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQty = () => {
    if (quantity < 20 && quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddRemoveFromWishlist = (e) => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: id };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex((item) => item.product._id === id);
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

  const handleScrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = 340;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // stock badge colours
  const stock = product?.stockQuantity;
  const stockInfo =
    stock <= 10
      ? { label: `Only ${stock} left`, bg: "#FEE2E2", fg: "#B91C1C" }
      : stock <= 20
      ? { label: "Only few left", bg: "#FEF3C7", fg: "#B45309" }
      : { label: "In Stock", bg: "#DCFCE7", fg: "#15803D" };

  const qtyBtnSx = {
    width: 36,
    height: 36,
    color: "primary.main",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
    "&:hover": { backgroundColor: "#EEF2FF" },
  };

  const arrowBtnSx = {
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "background.paper",
    "&:hover": { borderColor: "primary.main", color: "primary.main" },
  };

  return (
    <>
      {!(
        productFetchStatus === "rejected" && reviewFetchStatus === "rejected"
      ) && (
        <Stack
          sx={{
            alignItems: "center",
            pb: 6,
            minHeight: "100vh",
          }}
        >
          {productFetchStatus === "pending" || reviewFetchStatus === "pending" ? (
            <Stack
              width={is500 ? "35vh" : "25rem"}
              height={"calc(100vh - 4rem)"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Lottie animationData={loadingAnimation} />
            </Stack>
          ) : (
            <Stack
              width="100%"
              sx={{
                maxWidth: 1400,
                px: { xs: 1.5, sm: 3 },
                rowGap: { xs: 3, md: 5 },
              }}
            >
              {/* Back link */}
              <Box sx={{ pt: { xs: 2, md: 3 } }}>
                <Button
                  onClick={() => navigate(-1)}
                  startIcon={<ArrowBackIcon />}
                  sx={{ color: "text.secondary", "&:hover": { color: "primary.main", backgroundColor: "#EEF2FF" } }}
                >
                  Back
                </Button>
              </Box>

              {/* Product hero: image + details */}
              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 2.5, md: 4 },
                  gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
                  alignItems: "start",
                }}
              >
                {/* Main product image */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{
                    ...cardSx,
                    position: { md: "sticky" },
                    top: { md: 96 },
                    p: { xs: 2, md: 4 },
                    background: "linear-gradient(160deg, #F5F7FF 0%, #EEF2FF 100%)",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: 280,
                      height: 280,
                      top: -90,
                      right: -90,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    component="img"
                    src={product?.thumbnail}
                    alt={`${product?.title}`}
                    sx={{
                      position: "relative",
                      display: "block",
                      width: "100%",
                      maxHeight: { xs: 340, md: 520 },
                      aspectRatio: "1 / 1",
                      objectFit: "contain",
                      mx: "auto",
                      transition: "transform .5s ease",
                      "&:hover": { transform: "scale(1.04)" },
                    }}
                  />
                </Box>

                {/* Right - product details */}
                <Stack
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{ ...cardSx, p: { xs: 2.5, md: 4 }, rowGap: 3 }}
                >
                  <Stack rowGap={1.25}>
                    {product?.brand?.name && (
                      <Chip
                        label={product.brand.name}
                        sx={{
                          alignSelf: "flex-start",
                          backgroundColor: "#EEF2FF",
                          color: "primary.main",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      />
                    )}

                    <Typography variant="h3" component="h1" sx={{ lineHeight: 1.15 }}>
                      {product?.title}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ columnGap: 1.5, rowGap: 1 }}
                    >
                      <Rating value={averageRating} readOnly />
                      <Typography variant="body2" color="text.secondary">
                        (
                        {totalReviews === 0
                          ? "No reviews"
                          : totalReviews === 1
                          ? `${totalReviews} Review`
                          : `${totalReviews} Reviews`}
                        )
                      </Typography>
                      <Chip
                        label={stockInfo.label}
                        sx={{
                          backgroundColor: stockInfo.bg,
                          color: stockInfo.fg,
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h2"
                      component="p"
                      sx={{
                        fontSize: { xs: "2rem", md: "2.5rem" },
                        background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        width: "fit-content",
                      }}
                    >
                      ₹{product?.price}
                    </Typography>
                  </Stack>

                  <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {product?.description}
                  </Typography>

                  {!loggedInUser?.isAdmin && (
                    <Stack rowGap={2}>
                      <Stack direction="row" alignItems="center" sx={{ columnGap: 2, flexWrap: "wrap", rowGap: 1.5 }}>
                        <Typography variant="body2" fontWeight={700} color="text.secondary">
                          Quantity
                        </Typography>
                        {/* quantity stepper */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            p: 0.5,
                            borderRadius: 999,
                            backgroundColor: "#F1F3FB",
                            columnGap: 1,
                          }}
                        >
                          <IconButton
                            onClick={handleDecreaseQty}
                            aria-label="Decrease quantity"
                            sx={qtyBtnSx}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={handleIncreaseQty}
                            aria-label="Increase quantity"
                            sx={qtyBtnSx}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={1.5} alignItems="stretch">
                        {isProductAlreadyInCart ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={() => navigate("/cart")}
                            sx={{ py: 1.4, borderRadius: 999, fontSize: "0.95rem" }}
                          >
                            Go to Cart
                          </Button>
                        ) : (
                          <Button
                            component={motion.button}
                            whileTap={{ scale: 0.97 }}
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            startIcon={<ShoppingBagOutlinedIcon />}
                            onClick={handleAddToCart}
                            sx={{ py: 1.4, borderRadius: 999, fontSize: "0.95rem" }}
                          >
                            Add To Cart
                          </Button>
                        )}

                        <Tooltip title={isProductAlreadyinWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                          <Box
                            component={motion.div}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: "1.5px solid",
                              borderColor: isProductAlreadyinWishlist ? "#FCA5A5" : "#C7D2FE",
                              backgroundColor: isProductAlreadyinWishlist ? "#FEF2F2" : "#fff",
                              borderRadius: 999,
                              px: 0.5,
                              transition: "all .2s ease",
                            }}
                          >
                            <Checkbox
                              checked={isProductAlreadyinWishlist}
                              onChange={(e) => handleAddRemoveFromWishlist(e)}
                              icon={<FavoriteBorder />}
                              checkedIcon={<Favorite sx={{ color: "#EF4444" }} />}
                              inputProps={{ "aria-label": "Toggle wishlist" }}
                            />
                          </Box>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  )}

                  {/* Perks */}
                  <Box
                    sx={{
                      display: "grid",
                      gap: 1.25,
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)", md: "1fr" , lg: "repeat(3, 1fr)" },
                    }}
                  >
                    {perks.map((perk) => (
                      <Stack
                        key={perk.title}
                        direction={{ xs: "row", sm: "column", md: "row", lg: "column" }}
                        spacing={1.25}
                        alignItems={{ xs: "center", sm: "flex-start", md: "center", lg: "flex-start" }}
                        sx={{
                          p: 1.75,
                          borderRadius: "16px",
                          backgroundColor: "#F8FAFF",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px",
                            color: "primary.main",
                            backgroundColor: "#EEF2FF",
                          }}
                        >
                          {perk.icon}
                        </Box>
                        <Stack>
                          <Typography variant="body1" fontWeight={700}>
                            {perk.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {perk.text}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Box>
                </Stack>
              </Box>

              {/* Reviews section */}
              <Stack sx={{ ...cardSx, p: { xs: 2, sm: 3, md: 4 } }}>
                <Reviews productId={id} averageRating={averageRating} />
              </Stack>

              {/* Trending Products Carousel */}
              {trendingProducts.length > 0 && (
                <Stack rowGap={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                  >
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "10px",
                          color: "#fff",
                          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                          boxShadow: "0 8px 18px rgba(79,70,229,0.3)",
                        }}
                      >
                        <TrendingUpIcon fontSize="small" />
                      </Box>
                      <Stack>
                        <Typography variant="h5" fontWeight={700}>
                          You may also like
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: { xs: "none", sm: "block" } }}
                        >
                          Trending picks from Edumart
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={0.75}>
                      <IconButton
                        size="small"
                        onClick={() => handleScrollCarousel("left")}
                        aria-label="Scroll trending products left"
                        sx={arrowBtnSx}
                      >
                        <ArrowBackIosNewIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleScrollCarousel("right")}
                        aria-label="Scroll trending products right"
                        sx={arrowBtnSx}
                      >
                        <ArrowForwardIosIcon fontSize="inherit" />
                      </IconButton>
                    </Stack>
                  </Stack>

                  <Stack
                    ref={carouselRef}
                    direction="row"
                    spacing={2.5}
                    sx={{
                      overflowX: "auto",
                      scrollBehavior: "smooth",
                      scrollSnapType: "x proximity",
                      py: 1,
                      px: 0.5,
                      "&::-webkit-scrollbar": { height: "6px" },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "#CBD5E1",
                        borderRadius: "999px",
                      },
                    }}
                  >
                    {trendingProducts.map((item) => (
                      <Box
                        key={item._id}
                        sx={{
                          flexShrink: 0,
                          scrollSnapAlign: "start",
                          width: { xs: "240px", sm: "280px", md: "320px" },
                          "& > *": { width: "100% !important" },
                        }}
                      >
                        <ProductCard
                          id={item._id}
                          title={item.title}
                          price={item.price}
                          thumbnail={item.thumbnail}
                          brand={item.brand?.name}
                          stockQuantity={item.stockQuantity}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
};