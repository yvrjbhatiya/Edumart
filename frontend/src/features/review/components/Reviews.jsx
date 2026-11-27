import {
  Button,
  LinearProgress,
  Rating,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReviewAsync,
  resetReviewAddStatus,
  resetReviewDeleteStatus,
  resetReviewUpdateStatus,
  selectReviewAddStatus,
  selectReviewDeleteStatus,
  selectReviewStatus,
  selectReviewUpdateStatus,
  selectReviews,
} from "../ReviewSlice";
import { ReviewItem } from "./ReviewItem";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { selectLoggedInUser } from "../../auth/AuthSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import { MotionConfig, motion } from "framer-motion";
import { useTheme } from "@mui/material";

export const Reviews = ({ productId, averageRating }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reviews = useSelector(selectReviews);
  const [value, setValue] = useState(1);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const loggedInUser = useSelector(selectLoggedInUser);
  const reviewStatus = useSelector(selectReviewStatus);

  const reviewAddStatus = useSelector(selectReviewAddStatus);
  const reviewDeleteStatus = useSelector(selectReviewDeleteStatus);
  const reviewUpdateStatus = useSelector(selectReviewUpdateStatus);

  const [writeReview, setWriteReview] = useState(false);
  const theme = useTheme();

  const is840 = useMediaQuery(theme.breakpoints.down(840));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  useEffect(() => {
    if (reviewAddStatus === "fulfilled") {
      toast.success("Review added");
      reset();
      setValue(1);
    } else if (reviewAddStatus === "rejected") {
      toast.error("Error posting review, please try again later");
    }
  }, [reviewAddStatus, reset]);

  useEffect(() => {
    if (reviewDeleteStatus === "fulfilled") {
      toast.success("Review deleted");
    } else if (reviewDeleteStatus === "rejected") {
      toast.error("Error deleting review, please try again later");
    }
  }, [reviewDeleteStatus]);

  useEffect(() => {
    if (reviewUpdateStatus === "fulfilled") {
      toast.success("Review updated");
    } else if (reviewUpdateStatus === "rejected") {
      toast.error("Error updating review, please try again later");
    }
  }, [reviewUpdateStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetReviewAddStatus());
      dispatch(resetReviewDeleteStatus());
      dispatch(resetReviewUpdateStatus());
    };
  }, [dispatch]);

  const ratingCounts = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews?.forEach((review) => {
    ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
  });

  const handleAddReview = (data) => {
    const review = {
      ...data,
      rating: value,
      user: loggedInUser._id,
      product: productId,
    };
    dispatch(createReviewAsync(review));
    setWriteReview(false);
  };

  const handleOpenWriteReview = () => {
    if (!loggedInUser) {
      navigate("/login");
      return;
    }
    setWriteReview(true);
  };

  return (
    <Stack
      width={{ xs: "100%", sm: is840 ? "100%" : "40rem" }}
      maxWidth="100%"
      sx={{ minWidth: 0 }}
    >
      {/* Header row: Reviews on left, Write a review button on right */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={{ xs: 1, sm: 2 }}
        sx={{
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          minWidth: 0,
        }}
      >
        <Typography
          variant={is480 ? "h5" : "h4"}
          fontWeight={700}
          sx={{ color: "#0F172A", lineHeight: 1.2 }}
        >
          Reviews
        </Typography>

        {!loggedInUser?.isAdmin && !writeReview && (
          <Button
            disableElevation
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<CreateIcon fontSize="small" />}
            onClick={handleOpenWriteReview}
            sx={{
              fontSize: { xs: "0.78rem", sm: "0.88rem" },
              px: { xs: 1.25, sm: 1.75 },
              py: 0.75,
              backgroundColor: "background.paper",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Write a review
          </Button>
        )}
      </Stack>

      {/* Rating summary & breakdown */}
      {reviews?.length ? (
        <Stack rowGap={{ xs: 2, sm: 3 }}>
          <Stack rowGap={0.75}>
            <Typography variant="h2" fontWeight={800} color="primary.dark">
              {averageRating}.0
            </Typography>
            <Rating readOnly value={averageRating} size={is480 ? "small" : "medium"} />
            <Typography variant="h6" color="text.secondary">
              Based on {reviews.length}{" "}
              {reviews.length === 1 ? "Review" : "Reviews"}
            </Typography>
          </Stack>

          <Stack rowGap={{ xs: 1.25, sm: 1.75 }}>
            {[5, 4, 3, 2, 1].map((number) => {
              const percentage = parseInt(
                (ratingCounts[number] / reviews.length) * 100
              );
              return (
                <Stack
                  key={number}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  columnGap={{ xs: 1, sm: 1.5 }}
                  sx={{ minWidth: 0 }}
                >
                  <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{ whiteSpace: "nowrap", minWidth: { xs: "3.1rem", sm: "3.5rem" } }}
                  >
                    {number} star
                  </Typography>
                  <LinearProgress
                    color="primary"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      height: { xs: "0.65rem", sm: "0.8rem" },
                    }}
                    variant="determinate"
                    value={percentage}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      minWidth: { xs: "2.2rem", sm: "2.6rem" },
                      textAlign: "right",
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body1" color="text.secondary" fontWeight={400}>
          {loggedInUser?.isAdmin
            ? "There are no reviews currently"
            : "Be the one to post review first"}
        </Typography>
      )}

      {/* Write review form */}
      {writeReview && (
        <Stack
          component="form"
          noValidate
          onSubmit={handleSubmit(handleAddReview)}
          sx={{
            backgroundColor: "background.default",
            p: { xs: 1.5, sm: 2.5 },
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            width: "100%",
            minWidth: 0,
          }}
        >
          <TextField
            id="reviewTextField"
            {...register("comment", { required: "Review comment is required" })}
            error={Boolean(errors.comment)}
            helperText={errors.comment ? "Please enter a review comment" : ""}
            multiline
            rows={is480 ? 4 : 5}
            fullWidth
            placeholder="Write a review..."
          />

          <Stack>
            <Typography gutterBottom variant="body2" color="text.secondary">
              How much did you like the product?
            </Typography>
            <motion.div
              style={{ width: "fit-content" }}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 1 }}
            >
              <Rating
                size={is480 ? "medium" : "large"}
                value={value}
                onChange={(_, newValue) => setValue(newValue || 1)}
              />
            </motion.div>
          </Stack>

          <Stack
            direction="row"
            justifyContent={{ xs: "stretch", sm: "flex-end" }}
            alignItems="center"
            gap={1}
            flexWrap="wrap"
          >
            <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.03 }}>
              <motion.div style={{ flex: is480 ? 1 : "initial" }}>
                <LoadingButton
                  fullWidth={is480}
                  size="small"
                  loading={reviewStatus === "pending"}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Add review
                </LoadingButton>
              </motion.div>
              <motion.div style={{ flex: is480 ? 1 : "initial" }}>
                <Button
                  fullWidth={is480}
                  onClick={() => setWriteReview(false)}
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </Button>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      )}

      {/* Reviews list */}
      <Stack rowGap={1.5} sx={{ minWidth: 0 }}>
        {reviews?.map((review) => (
          <ReviewItem
            key={review._id}
            id={review._id}
            userid={review.user._id}
            comment={review.comment}
            createdAt={review.createdAt}
            rating={review.rating}
            username={review.user.name}
          />
        ))}
      </Stack>
    </Stack>
  );
};