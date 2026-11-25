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

      width={is480 ? "100%" : is840 ? "25rem" : "40rem"}
      maxWidth="100%"
    >
      {/* Header row: Reviews on left, Write a review button on right */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography
          variant={is480 ? "h5" : "h4"}
          fontWeight={600}
          sx={{ color: "#384959", lineHeight: 1.2 }}
        >
          Reviews
        </Typography>

        {!loggedInUser?.isAdmin && !writeReview && (
          <Button
            disableElevation
            size="small"
            variant="outlined"
            startIcon={<CreateIcon fontSize="small" />}
            onClick={handleOpenWriteReview}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              fontSize: is480 ? "0.8rem" : "0.9rem",
              borderRadius: "8px",
              px: 1.75,
              py: 0.75,
              borderColor: "#6a89a7",
              color: "#384959",
              backgroundColor: "#ffffff",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: "#6a89a7",
                color: "#ffffff",
                borderColor: "#6a89a7",
              },
            }}
          >
            Write a review
          </Button>
        )}
      </Stack>

      {/* Rating summary & breakdown */}
      {reviews?.length ? (
        <Stack rowGap={3}>
          <Stack rowGap={1}>
            <Typography variant="h2" fontWeight={800}>
              {averageRating}.0
            </Typography>
            <Rating readOnly value={averageRating} />
            <Typography variant="h6" color="text.secondary">
              Based on {reviews.length}{" "}
              {reviews.length === 1 ? "Review" : "Reviews"}
            </Typography>
          </Stack>

          <Stack >
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
                  columnGap={1.5}
                >
                  <Typography sx={{ whiteSpace: "nowrap" }}>
                    {number} star
                  </Typography>
                  <LinearProgress
                    sx={{ width: "100%", height: "0.85rem", borderRadius: "4px" }}
                    variant="determinate"
                    value={percentage}
                  />
                  <Typography sx={{ minWidth: "2.5rem", textAlign: "right" }}>
                    {percentage}%
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      ) : (
        <Typography variant="h8" color="text.secondary" fontWeight={400}>
          {loggedInUser?.isAdmin
            ? "There are no reviews currently"
            : "Be the one to post review first"}
        </Typography>
      )}

      {/* Write review form */}
      {writeReview && (
        <Stack
          rowGap={2.5}
          component="form"
          noValidate
          onSubmit={handleSubmit(handleAddReview)}
          sx={{
            backgroundColor: "#ffffff",
            p: 2,
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
          }}
        >
          <TextField
            id="reviewTextField"
            {...register("comment", { required: "Review comment is required" })}
            error={Boolean(errors.comment)}
            helperText={errors.comment ? "Please enter a review comment" : ""}
            multiline
            rows={5}
            fullWidth
            placeholder="Write a review..."
          />

          <Stack>
            <Typography gutterBottom variant="body2">
              How much did you like the product?
            </Typography>
            <motion.div
              style={{ width: "fit-content" }}
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 1 }}
            >
              <Rating
                size="large"
                value={value}
                onChange={(_, newValue) => setValue(newValue || 1)}
              />
            </motion.div>
          </Stack>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            columnGap={1}
          >
            <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.03 }}>
              <motion.div>
                <LoadingButton
                  size={is480 ? "small" : "medium"}
                  loading={reviewStatus === "pending"}
                  type="submit"
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: "6px" }}
                >
                  Add review
                </LoadingButton>
              </motion.div>
              <motion.div>
                <Button
                  onClick={() => setWriteReview(false)}
                  size={is480 ? "small" : "medium"}
                  variant="outlined"
                  sx={{ textTransform: "none", borderRadius: "6px" }}
                >
                  Cancel
                </Button>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      )}

      {/* Reviews list */}
      <Stack rowGap={2}>
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