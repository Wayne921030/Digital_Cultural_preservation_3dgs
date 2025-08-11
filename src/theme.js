import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#8B7355",
      light: "#A89A87FF",
      dark: "#6B5B47",
      contrastText: "#2F2F2F",
    },
    secondary: {
      main: "#DCE4C9",
      light: "#F5F5DC",
      dark: "#B6A28E",
      contrastText: "#E07B39",
    },
    background: {
      default: "#F8F6F2",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2F2F2F",
      secondary: "#6B5B47",
    },
    grey: {
      50: "#F8F6F2",
      100: "#F5F2ED",
      200: "#E5D8C0",
      300: "#D4C4A8",
      400: "#A08B6F",
      500: "#8B7355",
      600: "#6B5B47",
      700: "#5A4A3A",
      800: "#4A3D2F",
      900: "#2F2F2F",
    },
    colorBands: {
      band1: "#F8F6F2",
      band2: "#D4C4A8",
      band3: "#8B7355",
      band4: "#6B5B47",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: "#2F2F2F",
    },
    h2: {
      fontWeight: 600,
      color: "#2F2F2F",
    },
    h3: {
      fontWeight: 600,
      color: "#2F2F2F",
    },
    h4: {
      fontWeight: 600,
      color: "#2F2F2F",
    },
    h5: {
      fontWeight: 500,
      color: "#2F2F2F",
    },
    h6: {
      fontWeight: 500,
      color: "#2F2F2F",
    },
    body1: {
      color: "#2F2F2F",
      lineHeight: 1.6,
    },
    body2: {
      color: "#6B5B47",
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(139, 115, 85, 0.25)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(139, 115, 85, 0.1)",
          border: "1px solid rgba(139, 115, 85, 0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          maxWidth: "100%",
          marginLeft: "auto",
          marginRight: "auto",
          "@media (min-width: 600px)": {
            paddingLeft: "24px",
            paddingRight: "24px",
            maxWidth: "600px",
          },
          "@media (min-width: 900px)": {
            paddingLeft: "32px",
            paddingRight: "32px",
            maxWidth: "900px",
          },
          "@media (min-width: 1200px)": {
            paddingLeft: "48px",
            paddingRight: "48px",
            maxWidth: "1200px",
          },
          "@media (min-width: 1536px)": {
            paddingLeft: "64px",
            paddingRight: "64px",
            maxWidth: "1400px",
            marginLeft: "auto",
            marginRight: "auto",
          },
          "@media (min-width: 1920px)": {
            paddingLeft: "80px",
            paddingRight: "80px",
            maxWidth: "1600px",
          },
        },
      },
    },
  },
});

export default theme;
