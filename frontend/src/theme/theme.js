import { createTheme } from "@mui/material/styles";

const BRAND = "#4F46E5";
const BRAND_DARK = "#3730A3";
const INK = "#0F172A";

export const theme = createTheme({
  palette: {
    primary: {
      main: BRAND,
      light: "#ffffff", // kept white: several components use it as an on-dark colour
      dark: BRAND_DARK,
      customBlack: "#191919",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FBBF24",
      contrastText: INK,
    },
    success: { main: "#10B981" },
    error: { main: "#EF4444" },
    background: {
      default: "#F6F7FB",
      paper: "#FFFFFF",
    },
    text: {
      primary: INK,
      secondary: "#64748B",
    },
    divider: "#E8EAF2",
  },

  shape: { borderRadius: 14 },

  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    h1: {
      fontSize: "4rem",
      fontWeight: 800,
      letterSpacing: "-0.035em",
      lineHeight: 1.05,
      "@media (max-width:960px)": { fontSize: "3.1rem" },
      "@media (max-width:600px)": { fontSize: "2.4rem" },
      "@media (max-width:414px)": { fontSize: "2rem" },
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 800,
      letterSpacing: "-0.03em",
      lineHeight: 1.1,
      "@media (max-width:960px)": { fontSize: "2.2rem" },
      "@media (max-width:600px)": { fontSize: "1.8rem" },
      "@media (max-width:414px)": { fontSize: "1.5rem" },
    },
    h3: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      "@media (max-width:960px)": { fontSize: "1.65rem" },
      "@media (max-width:600px)": { fontSize: "1.35rem" },
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      "@media (max-width:960px)": { fontSize: "1.25rem" },
      "@media (max-width:600px)": { fontSize: "1.1rem" },
    },
    h5: {
      fontSize: "1.2rem",
      fontWeight: 700,
      letterSpacing: "-0.015em",
      "@media (max-width:960px)": { fontSize: "1.05rem" },
      "@media (max-width:600px)": { fontSize: "0.98rem" },
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      "@media (max-width:960px)": { fontSize: "0.95rem" },
      "@media (max-width:600px)": { fontSize: "0.88rem" },
    },
    subtitle1: { fontWeight: 600 },
    body1: {
      fontSize: "0.92rem",
      lineHeight: 1.6,
      "@media (max-width:600px)": { fontSize: "0.86rem" },
    },
    body2: {
      fontSize: "0.82rem",
      lineHeight: 1.5,
      "@media (max-width:600px)": { fontSize: "0.78rem" },
    },
    button: { fontWeight: 600, textTransform: "none" },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: "smooth" },
        body: {
          backgroundColor: "#F6F7FB",
          WebkitFontSmoothing: "antialiased",
        },
        "::selection": { background: "#C7D2FE", color: INK },
      },
    },
    MuiButton: {
      defaultProps: { size: "small", disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          fontSize: "0.85rem",
          padding: "7px 16px",
          transition: "all .2s ease",
          "&:hover": { transform: "translateY(-1px)" },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BRAND} 0%, #7C3AED 100%)`,
          boxShadow: "0 6px 16px rgba(79, 70, 229, 0.28)",
          "&:hover": {
            background: `linear-gradient(135deg, ${BRAND_DARK} 0%, #6D28D9 100%)`,
            boxShadow: "0 10px 24px rgba(79, 70, 229, 0.38)",
          },
        },
        outlinedPrimary: {
          borderColor: "#C7D2FE",
          "&:hover": { backgroundColor: "#EEF2FF", borderColor: BRAND },
        },
      },
    },
    MuiChip: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: { fontSize: "0.72rem", height: 22, fontWeight: 600 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { padding: 8, transition: "all .2s ease" },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: { maxHeight: 180, objectFit: "contain" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: 18 },
        elevation1: {
          boxShadow: "0 1px 2px rgba(15,23,42,.04), 0 8px 24px rgba(15,23,42,.06)",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: "0.9rem",
          backgroundColor: "#FFFFFF",
          transition: "box-shadow .2s ease",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E2E8F0" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#A5B4FC" },
          "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(79,70,229,.12)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: BRAND,
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          "&:before": { display: "none" },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          marginTop: 8,
          border: "1px solid #E8EAF2",
          boxShadow: "0 20px 40px rgba(15,23,42,.12)",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: { fontWeight: 700 },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: { borderRadius: 10, fontWeight: 600 },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999, height: 6, backgroundColor: "#E2E8F0" },
        bar: { borderRadius: 999 },
      },
    },
  },
});

export default theme;
