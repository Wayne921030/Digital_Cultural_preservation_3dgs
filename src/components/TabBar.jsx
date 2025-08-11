import React from "react";
import {
  Box,
  Tabs,
  Tab,
  Container,
} from "@mui/material";

const TabBar = ({ currentPage, onTabChange }) => {
  return (
    <Box
      sx={{
        py: 3,
        backgroundColor: "secondary.main",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: { xl: "1400px" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
        }}
      >
        <Tabs
          value={currentPage}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              color: "#6B5B47",
              fontSize: "1rem",
              fontWeight: 500,
              textTransform: "none",
              minWidth: "auto",
              px: 3,
              py: 1.5,
              "&.Mui-selected": {
                color: "#6B5B47",
                fontWeight: "bold",
              },
              "&:hover": {
                color: "#8B7355",
                backgroundColor: "rgba(139, 115, 85, 0.04)",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#8B7355",
              height: "3px",
              borderRadius: "3px 3px 0 0",
            },
            "& .MuiTabs-scrollButtons": {
              color: "#6B5B47",
              "&.Mui-disabled": {
                opacity: 0.3,
              },
            },
          }}
        >
          <Tab label="首頁" value="home" />
          <Tab label="所有場景" value="scenes" />
          <Tab label="保生宮" value="baosheng" />
          <Tab label="城隍廟" value="chenghuang" />
        </Tabs>
      </Container>
    </Box>
  );
};

export default TabBar; 