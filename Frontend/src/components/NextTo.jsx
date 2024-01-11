import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";

export default function BasicTextFields() {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        placeholder="Find a friend"
        variant="outlined"
        InputProps={{
          startAdornment: <SearchIcon color="action" sx={{ marginRight: 1 }} />,
        }}
      />
    </Box>
  );
}
