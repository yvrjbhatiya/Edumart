import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#6a89a7",
      light: "#ffffff",
      dark:"#4f6a86",
      customBlack: "#191919",
    },
    secondary: {
      main: "#background.paper",
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: "'Blinker', sans-serif",
    h1: {
      fontSize: "4.25rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      "@media (max-width:960px)": { fontSize: "3.25rem" },
      "@media (max-width:600px)": { fontSize: "2.4rem" },
      "@media (max-width:414px)": { fontSize: "1.85rem" },
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      "@media (max-width:960px)": { fontSize: "2rem" },
      "@media (max-width:600px)": { fontSize: "1.6rem" },
      "@media (max-width:414px)": { fontSize: "1.35rem" },
    },
    h3: {
      fontSize: "1.95rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
      "@media (max-width:960px)": { fontSize: "1.6rem" },
      "@media (max-width:600px)": { fontSize: "1.3rem" },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      "@media (max-width:960px)": { fontSize: "1.2rem" },
      "@media (max-width:600px)": { fontSize: "1.05rem" },
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      "@media (max-width:960px)": { fontSize: "1rem" },
      "@media (max-width:600px)": { fontSize: "0.92rem" },
    },
    h6: {
      fontSize: "0.95rem",
      fontWeight: 600,
      "@media (max-width:960px)": { fontSize: "0.9rem" },
      "@media (max-width:600px)": { fontSize: "0.85rem" },
    },
    body1: {
      fontSize: "0.88rem",
      lineHeight: 1.5,
      "@media (max-width:600px)": { fontSize: "0.82rem" },
    },
    body2: {
      fontSize: "0.8rem",
      lineHeight: 1.4,
      "@media (max-width:600px)": { fontSize: "0.76rem" },
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          fontSize: "0.82rem",
          padding: "5px 12px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.18)",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#3730A3",
          },
        },
      },
    },
    MuiChip: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          fontSize: "0.72rem",
          height: 20,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 6,
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          maxHeight: 180,
          objectFit: "contain",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: "0.88rem",
          backgroundColor: "#FFFFFF",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#818CF8",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          height: 6,
          backgroundColor: "#E2E8F0",
        },
        bar: {
          borderRadius: 999,
        },
      },
    },
  },
});

export default theme;
