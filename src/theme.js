import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#57564F",
      light: "#7A7A73",
      dark: "#3A3A35",
    },
    secondary: {
      main: "#7A7A73",
      light: "#9A9A93",
      dark: "#5A5A53",
    },
    background: {
      default: "#DDDAD0",
      paper: "rgba(255, 255, 255, 0.95)",
    },
    text: {
      primary: "#57564F",
      secondary: "#7A7A73",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    h3: {
      fontSize: "1.2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    body2: {
      fontSize: "0.9rem",
    },
  },
  shape: {
    borderRadius: 15,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "linear-gradient(135deg, #57564F 0%, #7A7A73 50%, #DDDAD0 100%)",
          minHeight: "100vh",
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 4px 15px rgba(87, 86, 79, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(87, 86, 79, 0.4)",
          },
        },
        contained: {
          background: "linear-gradient(45deg, #57564F, #7A7A73)",
          color: "#FFFFFF",
          "&:hover": {
            background: "linear-gradient(45deg, #7A7A73, #57564F)",
            color: "#FFFFFF",
          },
        },
        outlined: {
          borderColor: "#57564F",
          color: "#57564F",
          "&:hover": {
            background: "rgba(87, 86, 79, 0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(87, 86, 79, 0.15)",
          background: "rgba(255, 255, 255, 0.95)",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: "#57564F",
        },
        thumb: {
          background: "linear-gradient(45deg, #57564F, #7A7A73)",
          boxShadow: "0 2px 6px rgba(87, 86, 79, 0.3)",
        },
        track: {
          background: "#DDDAD0",
        },
        rail: {
          background: "#7A7A73",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: "#57564F",
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          color: "#FFFFFF",
        },
        body2: {
          color: "#FFFFFF",
        },
      },
    },
  },
});

export default theme;
