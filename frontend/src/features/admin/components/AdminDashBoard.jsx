import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import { selectBrands } from "../../brands/BrandSlice";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { selectCategories } from "../../categories/CategoriesSlice";
import { ProductCard } from "../../products/components/ProductCard";
import {
  deleteProductByIdAsync,
  fetchProductsAsync,
  selectProductIsFilterOpen,
  selectProductTotalResults,
  selectProducts,
  toggleFilters,
  undeleteProductByIdAsync,
} from "../../products/ProductSlice";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ClearIcon from "@mui/icons-material/Clear";
import { ITEMS_PER_PAGE } from "../../../constants";

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
];

export const AdminDashBoard = () => {
  const [filters, setFilters] = useState({});
  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const [sort, setSort] = useState(null);
  const [page, setPage] = useState(1);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch();
  const theme = useTheme();
  const is500 = useMediaQuery(theme.breakpoints.down(500));
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  const totalResults = useSelector(selectProductTotalResults);

  const is600 = useMediaQuery(theme.breakpoints.down(600));
  const is488 = useMediaQuery(theme.breakpoints.down(488));

  useEffect(() => {
    setPage(1);
  }, [totalResults]);

  useEffect(() => {
    const finalFilters = { ...filters };

    finalFilters["pagination"] = { page: page, limit: ITEMS_PER_PAGE };
    finalFilters["sort"] = sort;

    dispatch(fetchProductsAsync(finalFilters));
  }, [filters, sort, page]);

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

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync(productId));
  };

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId));
  };

  const handleFilterClose = () => {
    dispatch(toggleFilters());
  };

  return (
    <>
      <motion.div
        style={{
          position: "fixed",
          backgroundColor: "white",
          height: "100vh",
          padding: "1rem",
          overflowY: "scroll",
          width: is500 ? "100vw" : "30rem",
          zIndex: 500,
        }}
        variants={{ show: { left: 0 }, hide: { left: -500 } }}
        initial={"hide"}
        transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
        animate={isProductFilterOpen === true ? "show" : "hide"}
      >
        {/* fitlers section */}
        <Stack
          mb={"5rem"}
          sx={{ scrollBehavior: "smooth", overflowY: "scroll" }}
        >
          <IconButton
            onClick={handleFilterClose}
            style={{ position: "absolute", top: 15, right: 15 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ClearIcon fontSize="medium" />
            </motion.div>
          </IconButton>

          {/* brand filters */}
          <Stack mt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<AddIcon />}
                aria-controls="brand-filters"
                id="brand-filters"
              >
                <Typography>Brands</Typography>
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
                        control={<Checkbox />}
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
          <Stack mt={2}>
            <Accordion>
              <AccordionSummary
                expandIcon={<AddIcon />}
                aria-controls="category-filters"
                id="category-filters"
              >
                <Typography>Category</Typography>
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
                        control={<Checkbox />}
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

      <Stack rowGap={5} mt={is600 ? 2 : 5} mb={"3rem"}>
        {/* sort options */}
        <Stack
          flexDirection={"row"}
          mr={"2rem"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          columnGap={5}
        >
          <Stack alignSelf={"flex-end"} width={"12rem"}>
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

        <Grid
          gap={2}
          container
          flex={1}
          justifyContent={"center"}
          alignContent={"center"}
        >
          {products.map((product) => (
            // One card: product details + admin actions live together inside it
            <Stack
              key={product._id}
              sx={{
                backgroundColor: "background.paper",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                transition: "transform .3s ease, box-shadow .3s ease, border-color .3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "#C7D2FE",
                  boxShadow: "0 18px 40px rgba(79, 70, 229, 0.16)",
                },
                // the inner ProductCard has its own border/hover; flatten it so
                // we don't get a card inside a card
                "& > *:first-of-type > *": {
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  transform: "none",
                  "&:hover": {
                    border: "none",
                    boxShadow: "none",
                    transform: "none",
                  },
                },
              }}
            >
              <Stack sx={{ opacity: product.isDeleted ? 0.6 : 1 }}>
                <ProductCard
                  id={product._id}
                  title={product.title}
                  thumbnail={product.thumbnail}
                  brand={product.brand.name}
                  price={product.price}
                  isAdminCard={true}
                />
              </Stack>

              {/* actions (inside the card) */}
              <Stack
                direction="row"
                columnGap={is488 ? 1 : 1.5}
                sx={{
                  px: { xs: 1.5, sm: 2.25 },
                  pb: { xs: 1.5, sm: 2.25 },
                  pt: 0.5,
                }}
              >
                <Button
                  component={Link}
                  to={`/admin/product-update/${product._id}`}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1, borderRadius: 999 }}
                >
                  Update
                </Button>
                {product.isDeleted === true ? (
                  <Button
                    onClick={() => handleProductUnDelete(product._id)}
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ py: 1, borderRadius: 999 }}
                  >
                    Un-delete
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleProductDelete(product._id)}
                    variant="outlined"
                    color="error"
                    fullWidth
                    sx={{
                      py: 1,
                      borderRadius: 999,
                      "&:hover": { backgroundColor: "#FEF2F2" },
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Stack>
            </Stack>
          ))}
        </Grid>

        <Stack
          alignSelf={is488 ? "center" : "flex-end"}
          mr={is488 ? 0 : 5}
          rowGap={2}
          p={is488 ? 1 : 0}
        >
          <Pagination
            size={is488 ? "medium" : "large"}
            page={page}
            onChange={(e, page) => setPage(page)}
            count={Math.ceil(totalResults / ITEMS_PER_PAGE)}
            variant="outlined"
            shape="rounded"
          />
          <Typography textAlign={"center"}>
            Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {page * ITEMS_PER_PAGE > totalResults
              ? totalResults
              : page * ITEMS_PER_PAGE}{" "}
            of {totalResults} results
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};