import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { AnimatePresence, motion } from "framer-motion";
import { banner, banner2, banner3 } from "../../../assets";

const BANNER_SLIDES = [
  {
    title: "Upgrade Your Learning Journey",
    subtitle: "Welcome to Our E-commerce Store!",
    ctaText: "Explore",
    image: banner,
  },
  {
    title: "Smart Study Gear & Essentials",
    subtitle: "Curated tools, books, and accessories built for students.",
    ctaText: "Shop Now",
    image: banner2,
  },
  {
    title: "Exclusive Bundle Deals",
    subtitle: "Save more when you pair study essentials together.",
    ctaText: "View Deals",
    image: banner3,
  },
];

export const ProductBanner = ({ intervalMs = 4500 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (BANNER_SLIDES.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, isPaused]);

  const handlePrevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? BANNER_SLIDES.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
  };

  const handleScrollDown = () => {
    const productsSection = document.getElementById("products-section");

    if (productsSection) {
      const targetPosition = productsSection.offsetTop;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 800;
      let startTime = null;

      const smoothScroll = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollProgress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, startPosition + distance * scrollProgress);

        if (timeElapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      };

      requestAnimationFrame(smoothScroll);
    }
  };

  const currentSlide = BANNER_SLIDES[activeIndex];

  const arrowSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    display: { xs: "none", sm: "inline-flex" },
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(10px)",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.28)" },
  };

  return (
    <Box
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        width: { xs: "calc(100% - 24px)", md: "calc(100% - 48px)" },
        maxWidth: 1400,
        mx: "auto",
        height: { xs: "62vh", sm: "68vh", md: "72vh" },
        minHeight: 380,
        maxHeight: 640,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        borderRadius: { xs: "20px", md: "28px" },
        backgroundColor: "#0F172A",
        boxShadow: "0 24px 60px rgba(49, 46, 129, 0.25)",
      }}
    >
      {/* Crossfading background layers with subtle Ken Burns zoom */}
      {BANNER_SLIDES.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <Box
            key={slide.title}
            component={motion.div}
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1.06 : 1,
            }}
            transition={{
              opacity: { duration: 0.7, ease: "easeInOut" },
              scale: { duration: 6, ease: "easeOut" },
            }}
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        );
      })}

      {/* Brand gradient overlay for crisp text contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(100deg, rgba(30, 27, 75, 0.88) 0%, rgba(49, 46, 129, 0.62) 45%, rgba(15, 23, 42, 0.15) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Decorative glow */}
      <Box
        sx={{
          position: "absolute",
          width: 380,
          height: 380,
          right: -90,
          top: -90,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(167,139,250,0.45) 0%, rgba(167,139,250,0) 70%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Animated Slide Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          px: { xs: 3, sm: 7, md: 10 },
        }}
      >
        <AnimatePresence mode="wait">
          <Stack
            key={activeIndex}
            component={motion.div}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            spacing={{ xs: 2, md: 3 }}
            sx={{
              color: "#fff",
              maxWidth: 620,
              alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                px: 1.5,
                py: 0.6,
                borderRadius: 999,
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                backgroundColor: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
                backdropFilter: "blur(10px)",
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 14, color: "secondary.main" }} />
              <span>Edumart for students</span>
            </Stack>

            <Typography variant="h2" component="h1" sx={{ textWrap: "balance" }}>
              {currentSlide.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: "rgba(255,255,255,0.82)",
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              {currentSlide.subtitle}
            </Typography>

            <Button
              component={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              variant="contained"
              size="medium"
              endIcon={<ArrowOutwardIcon />}
              sx={{
                mt: 1,
                px: 3,
                py: 1.2,
                borderRadius: 999,
                color: "#312E81",
                background: "#fff",
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
                "&:hover": { background: "#EEF2FF" },
              }}
              onClick={handleScrollDown}
            >
              {currentSlide.ctaText}
            </Button>
          </Stack>
        </AnimatePresence>
      </Box>

      {/* Previous / Next Controls */}
      <IconButton
        onClick={handlePrevSlide}
        aria-label="Previous slide"
        sx={{ ...arrowSx, left: { sm: 16, md: 24 } }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <IconButton
        onClick={handleNextSlide}
        aria-label="Next slide"
        sx={{ ...arrowSx, right: { sm: 16, md: 24 } }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>

      {/* Slide Dots */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 18,
          left: { xs: 24, sm: 56, md: 80 },
          zIndex: 3,
        }}
      >
        {BANNER_SLIDES.map((slide, index) => (
          <Box
            key={slide.title}
            component={motion.div}
            layout
            role="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            sx={{
              width: index === activeIndex ? 28 : 8,
              height: 8,
              borderRadius: "999px",
              cursor: "pointer",
              transition: "width 0.35s ease, background-color 0.35s ease",
              backgroundColor:
                index === activeIndex ? "secondary.main" : "rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
