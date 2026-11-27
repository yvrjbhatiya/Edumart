import {
  Box,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
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
  loginAsync,
  selectLoginStatus,
  selectLoginError,
  clearLoginError,
  resetLoginStatus,
} from "../AuthSlice";
import { toast } from "react-toastify";
import { MotionConfig, motion } from "framer-motion";

export const Login = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectLoginStatus);
  const error = useSelector(selectLoginError);
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
    if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/");
    } else if (loggedInUser && !loggedInUser?.isVerified) {
      navigate("/verify-otp");
    }
  }, [loggedInUser]);

  // handles login error and toast them
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(() => {
    if (status === "fullfilled" && loggedInUser?.isVerified === true) {
      toast.success(`Login successful`);
      reset();
    }
    return () => {
      dispatch(clearLoginError());
      dispatch(resetLoginStatus());
    };
  }, [status]);

  const handleLogin = (data) => {
    const cred = { ...data };
    delete cred.confirmPassword;
    dispatch(loginAsync(cred));
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
          onSubmit={handleSubmit(handleLogin)}
        >
          <motion.div whileHover={{ y: -5 }}>
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
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.email.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ y: -5 }}>
            <TextField
              type="password"
              fullWidth
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
            />
            {errors.password && (
              <FormHelperText sx={{ mt: 1 }} error>
                {errors.password.message}
              </FormHelperText>
            )}
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <LoadingButton
              fullWidth
              sx={{ height: "2.9rem", fontSize: "0.95rem" }}
              loading={status === "pending"}
              type="submit"
              variant="contained"
            >
              Login
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
                  to={"/signup"}
                  component={Link}
                >
                  Don't have an account?{" "}
                  <span style={{ color: theme.palette.primary.dark }}>
                    Register
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
