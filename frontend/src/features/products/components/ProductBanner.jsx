import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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

  return (
    <Box
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        width: "100%",
        height: { xs: "60vh", md: "80vh" },
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0F172A",
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
              scale: isActive ? 1.03 : 1,
            }}
            transition={{
              opacity: { duration: 0.45, ease: "easeInOut" },
              scale: { duration: 3, ease: "easeOut" },
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

      {/* Dark gradient overlay for crisp text contrast */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.65) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Animated Slide Content */}
      <Box sx={{ position: "relative", zIndex: 2, width: "100%" }}>
        <AnimatePresence mode="wait">
          <Stack
            key={activeIndex}
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            spacing={3}
            sx={{
              margin: "0 auto",
              color: "primary.contrastText",
              textAlign: "center",
              maxWidth: "640px",
              padding: "0 2.5rem",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold">
              {currentSlide.title}
            </Typography>
            <Typography variant="h6">{currentSlide.subtitle}</Typography>
            <Button
              component={motion.button}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              variant="outlined"
              size="medium"
              sx={{
                padding: "9px 20px",
                borderRadius: "1rem",
                cursor: "pointer",
                color: "primary.contrastText",
                width: "auto",
                maxWidth: "170px",
                borderColor: "primary.light",
                backgroundColor: "rgba(15, 23, 42, 0.25)",
                "&:hover": {
                  backgroundColor: "primary.main",
                  borderColor: "primary.main",
                },
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
        sx={{
          position: "absolute",
          left: { xs: 8, sm: 20 },
          zIndex: 3,
          color: "primary.contrastText",
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(4px)",
          "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.75)" },
        }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      <IconButton
        onClick={handleNextSlide}
        aria-label="Next slide"
        sx={{
          position: "absolute",
          right: { xs: 8, sm: 20 },
          zIndex: 3,
          color: "primary.contrastText",
          backgroundColor: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(4px)",
          "&:hover": { backgroundColor: "rgba(15, 23, 42, 0.75)" },
        }}
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
          zIndex: 3,
        }}
      >
        {BANNER_SLIDES.map((slide, index) => (
          <Box
            key={slide.title}
            component={motion.div}
            layout
            onClick={() => setActiveIndex(index)}
            sx={{
              width: index === activeIndex ? 26 : 10,
              height: 10,
              borderRadius: "999px",
              cursor: "pointer",
              transition: "width 0.35s ease, background-color 0.35s ease",
              backgroundColor:
                index === activeIndex
                  ? "secondary.main"
                  : "rgba(255, 255, 255, 0.55)",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};
