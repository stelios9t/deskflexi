import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import BasicDatePicker from "./BasicDatePicker";
import Location from "./Location";
import NextTo from "./NextTo";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

function BookingMenu() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BasicDatePicker />
            <Divider orientation="vertical" flexItem sx={{ marginLeft: 2 }} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              style={{ width: "100%", textAlign: "left", display: "block" }}
            >
              <Location />
            </Button>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ flexGrow: 1 }}>
            <NextTo />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default BookingMenu;
