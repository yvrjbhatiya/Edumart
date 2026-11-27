import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAsync,
  resetProductFetchStatus,
  selectProductFetchStatus,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
} from "../ProductSlice";
import { ProductCard } from "./ProductCard";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import TuneIcon from "@mui/icons-material/Tune";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { selectBrands } from "../../brands/BrandSlice";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { selectCategories } from "../../categories/CategoriesSlice";
import Pagination from "@mui/material/Pagination";
import { ITEMS_PER_PAGE } from "../../../constants";
import {
  createWishlistItemAsync,
  deleteWishlistItemByIdAsync,
  resetWishlistItemAddStatus,
  resetWishlistItemDeleteStatus,
  selectWishlistItemAddStatus,
  selectWishlistItemDeleteStatus,
  selectWishlistItems,
} from "../../wishlist/WishlistSlice";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { toast } from "react-toastify";
import { banner, loadingAnimation } from "../../../assets";
import {
  resetCartItemAddStatus,
  selectCartItemAddStatus,
} from "../../cart/CartSlice";
import { motion } from "framer-motion";
import { ProductBanner } from "./ProductBanner";
import ClearIcon from "@mui/icons-material/Clear";
import Lottie from "lottie-react";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

const bannerImages = [banner];

const productCardShadowSx = {
  width: "100% !important",
};

export const ProductList = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(null);
  const theme = useTheme();

  const trendingRef = useRef(null);
  const mostViewedRef = useRef(null);

  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const products = useSelector(selectProducts);
  const totalResults = useSelector(selectProductTotalResults);
  const loggedInUser = useSelector(selectLoggedInUser);

  const productFetchStatus = useSelector(selectProductFetchStatus);

  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus);
  const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus);

  const cartItemAddStatus = useSelector(selectCartItemAddStatus);

  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);

  const dispatch = useDispatch();

  const trendingProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return [...products]
      .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
      .slice(0, 8);
  }, [products]);

  const mostViewedProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];
    return [...products].reverse().slice(0, 8);
  }, [products]);

  const handleScrollShelf = (ref, direction) => {
    if (!ref.current) return;
    const distance = is600 ? 260 : 360;
    ref.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, brand: filterArray });
  };

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category);

    if (e.target.checked) {
      filterSet.add(e.target.value);
    } else {
      filterSet.delete(e.target.value);
    }

    const filterArray = Array.from(filterSet);
    setFilters({ ...filters, category: filterArray });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };

    finalFilters["pagination"] = { page: page, limit: ITEMS_PER_PAGE };
    finalFilters["sort"] = sort;

    if (!loggedInUser?.isAdmin) {
      finalFilters["user"] = true;
    }

    dispatch(fetchProductsAsync(finalFilters));
  }, [dispatch, filters, loggedInUser?.isAdmin, page, sort]);

  const handleAddRemoveFromWishlist = (e, productId) => {
    if (e.target.checked) {
      const data = { user: loggedInUser?._id, product: productId };
      dispatch(createWishlistItemAsync(data));
    } else if (!e.target.checked) {
      const index = wishlistItems.findIndex(
        (item) => item.product._id === productId,
      );
      dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
    }
  };

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
        "Error removing product from wishlist, please try again later",
      );
    }
  }, [wishlistItemDeleteStatus]);

  useEffect(() => {
    if (cartItemAddStatus === "fulfilled") {
      toast.success("Product added to cart");
    } else if (cartItemAddStatus === "rejected") {
      toast.error("Error adding product to cart, please try again later");
    }
  }, [cartItemAddStatus]);

  useEffect(() => {
    if (productFetchStatus === "rejected") {
      toast.error("Error fetching products, please try again later");
    }
  }, [productFetchStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetProductFetchStatus());
      dispatch(resetWishlistItemAddStatus());
      dispatch(resetWishlistItemDeleteStatus());
      dispatch(resetCartItemAddStatus());
    };
  }, [dispatch]);

  const handleFilterToggle = () => {
    dispatch(toggleFilters());
  };

  const renderShelf = ({
    title,
    subtitle,
    icon,
    items,
    shelfRef,
    accentColor = "primary.main",
    titleColor = "text.primary",
    subtitleColor = "text.secondary",
  }) => {
    if (!items || items.length === 0) return null;

    return (
      <Stack
        p={{ xs: 0.5, sm: 1, md: 1.5 }}
        rowGap={2}
        sx={{
          minWidth: 0,
          maxWidth: "100%",
          maxWidth: 1400,
          width: { xs: "calc(100% - 24px)", sm: "calc(100% - 32px)", md: "calc(100% - 48px)" },
          alignSelf: "center",
          backgroundColor: "transparent",
        }}
      >
        {/* Section Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ minWidth: 0 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{ minWidth: 0 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: { xs: 34, sm: 38 },
                height: { xs: 34, sm: 38 },
                flexShrink: 0,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                color: "#fff",
                boxShadow: "0 8px 18px rgba(79,70,229,0.3)",
              }}
            >
              {icon}
            </Box>
            <Stack sx={{ minWidth: 0 }}>
              <Typography
                variant={is600 ? "h6" : "h5"}
                fontWeight={700}
                color={titleColor}
                noWrap
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  color={subtitleColor}
                  sx={{
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* Scroll Controls */}
          <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
            <IconButton
              size="small"
              onClick={() => handleScrollShelf(shelfRef, "left")}
              aria-label={`Scroll ${title} left`}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              <ArrowBackIosNewIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleScrollShelf(shelfRef, "right")}
              aria-label={`Scroll ${title} right`}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                color: "text.primary",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              <ArrowForwardIosIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Horizontal Product Strip */}
        <Stack
          ref={shelfRef}
          direction="row"
          spacing={{ xs: 1.5, sm: 2.5 }}
          sx={{
            width: "100%",
            minWidth: 0,
            overflowX: "auto",
            scrollBehavior: "smooth",
            py: 0.75,
            "&::-webkit-scrollbar": {
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#CBD5E1",
              borderRadius: "999px",
            },
          }}
        >
          {items.map((product) => (
            <Box
              key={product._id}
              sx={{
                flexShrink: 0,
                width: { xs: "240px", sm: "280px", md: "320px" },
                "& > *": productCardShadowSx,
              }}
            >
              <ProductCard
                id={product._id}
                title={product.title}
                thumbnail={product.thumbnail}
                brand={product.brand?.name}
                price={product.price}
                stockQuantity={product.stockQuantity}
                handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      {productFetchStatus === "pending" ? (
        <Stack
          width={is500 ? "35vh" : "25rem"}
          height={"calc(100vh - 4rem)"}
          justifyContent={"center"}
          marginRight={"auto"}
          marginLeft={"auto"}
        >
          <Lottie animationData={loadingAnimation} />
        </Stack>
      ) : (
        <>
          {/* Filters sidebar */}
          <motion.div
            style={{
              position: "fixed",
              top: 0,
              backgroundColor: theme.palette.background.paper,
              height: "100vh",
              padding: "1rem",
              overflowY: "auto",
              width: is500 ? "100vw" : "30rem",
              maxWidth: "100vw",
              zIndex: 1200,
              borderTopRightRadius: is500 ? 0 : "24px",
              borderBottomRightRadius: is500 ? 0 : "24px",
              boxShadow: isProductFilterOpen
                ? "8px 0 40px rgba(15, 23, 42, 0.2)"
                : "none",
            }}
            variants={{ show: { left: 0 }, hide: { left: "-100%" } }}
            initial={"hide"}
            transition={{ ease: "easeInOut", duration: 0.45, type: "spring" }}
            animate={isProductFilterOpen === true ? "show" : "hide"}
          >
            <Stack mb={"4rem"}>
              <IconButton
                onClick={handleFilterToggle}
                style={{ position: "absolute", top: 15, right: 15 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ClearIcon fontSize="medium" />
                </motion.div>
              </IconButton>

              {/* brand filters */}
              <Stack
                mt={8}
                sx={{
                  backgroundColor: "background.default",
                  padding: ".5rem",
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Accordion elevation={0}>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="brand-filters"
                    id="brand-filters"
                  >
                    <Typography fontWeight={600} color="primary.main">
                      Brands
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleBrandFilters}>
                      {brands?.map((brand) => (
                        <motion.div
                          key={brand._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox color="primary" />}
                            label={brand.name}
                            value={brand._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>

              {/* category filters */}
              <Stack
                mt={2}
                sx={{
                  backgroundColor: "background.default",
                  padding: ".5rem",
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Accordion elevation={0}>
                  <AccordionSummary
                    expandIcon={<AddIcon />}
                    aria-controls="category-filters"
                    id="category-filters"
                  >
                    <Typography fontWeight={600} color="primary.main">
                      Category
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0 }}>
                    <FormGroup onChange={handleCategoryFilters}>
                      {categories?.map((category) => (
                        <motion.div
                          key={category._id}
                          style={{ width: "fit-content" }}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FormControlLabel
                            sx={{ ml: 1 }}
                            control={<Checkbox color="primary" />}
                            label={category.name}
                            value={category._id}
                          />
                        </motion.div>
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Stack>
          </motion.div>

          <Stack
            pb={"3rem"}
            rowGap={{ xs: 2.5, sm: 3.5, md: 4 }}
            sx={{
              width: "100%",
              maxWidth: "100vw",
              overflowX: "clip",
              backgroundColor: "background.default",
            }}
          >
            {/* Banners section (visible on mobile & desktop) */}
            <Stack
              sx={{
                width: "100%",
                marginTop: { xs: "0.5rem", sm: "1rem" },
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <ProductBanner images={bannerImages} />
            </Stack>

            {/* Trending Products Section */}
            {renderShelf({
              title: "Trending Now",
              subtitle: "Popular picks & top offers shoppers are grabbing",
              icon: <TrendingUpIcon fontSize="small" />,
              items: trendingProducts,
              shelfRef: trendingRef,
              accentColor: "primary.main",
              titleColor: "text.primary",
              subtitleColor: "text.secondary",
            })}

            <Divider sx={{ mx: { xs: 1.5, sm: 3, md: 4 }, borderColor: "transparent" }} />

            {/* Most Viewed Section */}
            {renderShelf({
              title: "Most Viewed",
              subtitle: "Frequently explored items across Edumart",
              icon: <VisibilityOutlinedIcon fontSize="small" />,
              items: mostViewedProducts,
              shelfRef: mostViewedRef,
              accentColor: "primary.main",
              titleColor: "text.primary",
              subtitleColor: "text.secondary",
            })}

            <Divider sx={{ mx: { xs: 1.5, sm: 3, md: 4 }, borderColor: "transparent" }} />

            {/* All Products Catalog */}
            <Stack
              rowGap={{ xs: 2.5, sm: 3.5 }}
              sx={{ minWidth: 0 }}
              id="products-section"
            >
              {/* Section Heading + Filter & Sort Toolbar */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                mx={{ xs: 1.5, sm: 3, md: 4 }}
                justifyContent={"space-between"}
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
              >
                <Stack>
                  <Typography
                    variant={is600 ? "h6" : "h5"}
                    fontWeight={700}
                    color={"text.primary"}
                  >
                    Explore All Products
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {totalResults || products.length} items available
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                  flexWrap="wrap"
                >
                  {!loggedInUser?.isAdmin ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<TuneIcon />}
                      onClick={handleFilterToggle}
                      sx={{
                        px: 2,
                        py: 0.8,
                        backgroundColor: "background.paper",
                      }}
                    >
                      Filters
                    </Button>
                  ) : null}

                  <Stack
                    sx={{
                      width: { xs: "100%", sm: "12rem" },
                      minWidth: "9rem",
                    }}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="sort-dropdown">Sort</InputLabel>
                      <Select
                        variant="standard"
                        labelId="sort-dropdown"
                        label="Sort"
                        onChange={(e) => setSort(e.target.value)}
                        value={sort}
                      >
                        <MenuItem value={null}>Reset</MenuItem>
                        {sortOptions.map((option) => (
                          <MenuItem key={option.name} value={option}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                </Stack>
              </Stack>

              {/* Product Grid */}
              <Grid
                container
                spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                justifyContent={"center"}
                alignItems={"stretch"}
                px={{ xs: 1.5, sm: 3, md: 4 }}
                sx={{ width: "100%", maxWidth: 1400, mx: "auto", margin: "0 auto" }}
              >
                {products.map((product) => (
                  <Grid
                    item
                    key={product._id}
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      "& > *": productCardShadowSx,
                    }}
                  >
                    <ProductCard
                      id={product._id}
                      title={product.title}
                      thumbnail={product.thumbnail}
                      brand={product.brand?.name}
                      price={product.price}
                      stockQuantity={product.stockQuantity}
                      handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                    />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              <Stack
                alignSelf={{ xs: "center", sm: "flex-end" }}
                mx={{ xs: 1.5, sm: 3, md: 4 }}
                rowGap={1.5}
                pt={1}
              >
                <Pagination
                  color="primary"
                  size={is488 ? "small" : "large"}
                  page={page}
                  onChange={(e, page) => setPage(page)}
                  count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
                  variant="outlined"
                  shape="rounded"
                />
                <Typography
                  variant="body2"
                  textAlign={{ xs: "center", sm: "right" }}
                  color="text.secondary"
                >
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {page * ITEMS_PER_PAGE > totalResults
                    ? totalResults
                    : page * ITEMS_PER_PAGE}{" "}
                  of {totalResults} results
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};