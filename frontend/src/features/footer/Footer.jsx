import React from "react";
import {
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { QRCodePng, appStorePng, googlePlayPng, logoPng } from "../../assets";

const ContactRow = ({ icon, text }) => (
  <Stack direction="row" spacing={1.25} alignItems="center">
    <Box sx={{ color: "#A5B4FC", display: "flex" }}>{icon}</Box>
    <Typography sx={{ color: "rgba(255,255,255,0.78)" }}>{text}</Typography>
  </Stack>
);

export const Footer = () => {
  const theme = useTheme();
  const is700 = useMediaQuery(theme.breakpoints.down(700));

  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #1E1B4B 0%, #312E81 55%, #4C1D95 100%)",
        color: "#fff",
        borderTopLeftRadius: { xs: 28, md: 40 },
        borderTopRightRadius: { xs: 28, md: 40 },
        px: { xs: 2.5, sm: 5, md: 8 },
        pt: { xs: 5, md: 7 },
        pb: 3,
      }}
    >
      {/* decorative glow */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Upper Section */}
      <Box
        sx={{
          position: "relative",
          maxWidth: 1200,
          mx: "auto",
          display: "grid",
          gap: { xs: 4, md: 6 },
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1.3fr 1fr 1fr" },
        }}
      >
        {/* Brand + Subscription */}
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              component="img"
              src={logoPng}
              alt="Edumart"
              sx={{ width: 40, height: 40, objectFit: "contain", borderRadius: 2 }}
            />
            <Typography variant="h5" fontWeight={800}>
              EDUMART
            </Typography>
          </Stack>
          <Typography sx={{ color: "rgba(255,255,255,0.78)", maxWidth: 340 }}>
            Subscribe to get 10% off your first order
          </Typography>
          <TextField
            placeholder="Enter your email"
            fullWidth
            sx={{
              maxWidth: 360,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 999,
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.25)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#A5B4FC",
                },
              },
              "& .MuiInputBase-input": { color: "whitesmoke", pl: 2 },
              "& .MuiInputBase-input::placeholder": {
                color: "rgba(255,255,255,0.6)",
                opacity: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  aria-label="Subscribe"
                  sx={{
                    background: "#fff",
                    "&:hover": { background: "#EEF2FF" },
                  }}
                >
                  <SendIcon sx={{ color: "#4F46E5", fontSize: 18 }} />
                </IconButton>
              ),
            }}
          />
        </Stack>

        {/* Support */}
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={700}>
            Support
          </Typography>
          <ContactRow icon={<PlaceOutlinedIcon fontSize="small" />} text="123 XYZ Road, Uttarakhand" />
          <ContactRow icon={<MailOutlineIcon fontSize="small" />} text="edumart@xyz.in" />
          <ContactRow icon={<PhoneOutlinedIcon fontSize="small" />} text="+91-XXXXX-XXXXX" />
        </Stack>

        {/* Download App */}
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight={700}>
            Download App
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                p: 0.75,
                backgroundColor: "#fff",
                borderRadius: 2,
                display: "flex",
              }}
            >
              <img
                src={QRCodePng}
                alt="QR Code"
                style={{ width: is700 ? "72px" : "84px", height: is700 ? "72px" : "84px" }}
              />
            </Box>
            <Stack spacing={1}>
              <img
                src={googlePlayPng}
                alt="Google Play"
                style={{ width: "120px", cursor: "pointer" }}
              />
              <img
                src={appStorePng}
                alt="App Store"
                style={{ width: "120px", cursor: "pointer" }}
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.14)", my: 4, maxWidth: 1200, mx: "auto" }} />

      {/* Lower Section */}
      <Stack alignItems="center">
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
          &copy; Edumart {new Date().getFullYear()}. All rights reserved
        </Typography>
      </Stack>
    </Box>
  );
};
