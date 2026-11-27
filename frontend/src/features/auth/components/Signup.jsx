import {
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect } from "react";
import Lottie from "lottie-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ecommerceOutlookAnimation,
  shoppingBagAnimation,
} from "../../../assets";
import { useDispatch, useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import {
  selectLoggedInUser,
  signupAsync,
  selectSignupStatus,
  selectSignupError,
  clearSignupError,
  resetSignupStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";

export const Signup = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectSignupStatus);
  const error = useSelector(selectSignupError);
  const loggedInUser = useSelector(selectLoggedInUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const theme = useTheme();
  const is900 = useMediaQuery(theme.breakpoints.down(900));
  const is480 = useMediaQuery(theme.breakpoints.down(480));

  // handles user redirection
  useEffect(() => {
    if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    } else if (loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  // handles signup error and toast them
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === "fullfilled") {
      toast.success(
        "Welcome! Verify your email to start shopping on mern-ecommerce."
      );
      reset();
    }
    return () => {
      dispatch(clearSignupError());
      dispatch(resetSignupStatus());
    };
  }, [status]);

  // this function handles signup and dispatches the signup action with credentails that api requires
  const handleSignup = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(signupAsync(cred));
  };

  return (
    <Stack
      width={"100vw"}
      minHeight={"100vh"}
      flexDirection={"row"}
      sx={{ overflowX: "hidden", backgroundColor: "background.default" }}
    >
      {!is900 && (
        <Stack
          flex={1}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: 4,
            background:
              "linear-gradient(150deg, #312E81 0%, #4F46E5 55%, #7C3AED 100%)",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              borderRadius: "50%",
              pointerEvents: "none",
            },
            "&::before": {
              width: 420,
              height: 420,
              top: -140,
              left: -120,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%)",
            },
            "&::after": {
              width: 360,
              height: 360,
              bottom: -120,
              right: -100,
              background:
                "radial-gradient(circle, rgba(251,191,36,0.3) 0%, rgba(251,191,36,0) 70%)",
            },
          }}
        >
          <Stack sx={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
            <Lottie animationData={ecommerceOutlookAnimation} />
          </Stack>
          <Typography
            variant="h4"
            sx={{ color: "#fff", textAlign: "center", position: "relative", zIndex: 1 }}
          >
            Everything a student needs, in one place.
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.78)",
              textAlign: "center",
              mt: 1,
              position: "relative",
              zIndex: 1,
            }}
          >
            Books, gear and study essentials, delivered.
          </Typography>
        </Stack>
      )}

      <Stack flex={1} justifyContent={"center"} alignItems={"center"} py={4} px={2}>
        <Stack
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Stack rowGap={".4rem"}>
            <Typography
              variant="h1"
              sx={{
                wordBreak: "break-word",
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.6rem", sm: "3.4rem" },
              }}
              fontWeight={800}
            >
              Edumart
            </Typography>
            <Typography
              alignSelf={"flex-end"}
              color={"GrayText"}
              variant="body2"
            >
              ~ Study Made Simple
            </Typography>
          </Stack>
        </Stack>

        <Stack
          mt={4}
          spacing={2}
          width={is480 ? "100%" : "28rem"}
          maxWidth={"100%"}
          sx={{
            backgroundColor: "background.paper",
            p: { xs: 2.5, sm: 4 },
            borderRadius: "24px",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 24px 60px rgba(79, 70, 229, 0.12)",
          }}
          component={"form"}
          noValidate
          onSubmit={handleSubmit(handleSignup)}
        >
          <MotionConfig whileHover={{ y: -5 }}>
            <motion.div>
              <TextField
                fullWidth
                {...register("name", { required: "Username is required" })}
                placeholder="Username"
              />
              {errors.name && (
                <FormHelperText error>{errors.name.message}</FormHelperText>
              )}
            </motion.div>

            <motion.div>
              <TextField
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Email"
              />
              {errors.email && (
                <FormHelperText error>{errors.email.message}</FormHelperText>
              )}
            </motion.div>

            <motion.div>
              <TextField
                type="password"
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                    message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`,
                  },
                })}
                placeholder="Password"
              />
              {errors.password && (
                <FormHelperText error>{errors.password.message}</FormHelperText>
              )}
            </motion.div>

            <motion.div>
              <TextField
                type="password"
                fullWidth
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value, fromValues) =>
                    value === fromValues.password || "Passwords doesn't match",
                })}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <FormHelperText error>
                  {errors.confirmPassword.message}
                </FormHelperText>
              )}
            </motion.div>
          </MotionConfig>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton
              sx={{ height: "2.9rem", fontSize: "0.95rem" }}
              fullWidth
              loading={status === "pending"}
              type="submit"
              variant="contained"
            >
              Signup
            </LoadingButton>
          </motion.div>

          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"wrap-reverse"}
          >
            <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.05 }}>
              <motion.div>
                <Typography
                  mr={"1.5rem"}
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to={"/forgot-password"}
                  component={Link}
                >
                  Forgot password
                </Typography>
              </motion.div>

              <motion.div>
                <Typography
                  sx={{ textDecoration: "none", color: "text.primary" }}
                  to={"/login"}
                  component={Link}
                >
                  Already a member?{" "}
                  <span style={{ color: theme.palette.primary.dark }}>
                    Login
                  </span>
                </Typography>
              </motion.div>
            </MotionConfig>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
