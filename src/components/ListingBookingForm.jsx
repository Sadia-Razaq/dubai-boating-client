import React from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const ListingBookingForm = () => {
  return (
    <Box
      sx={{
        bgcolor: "common.white",
        boxShadow: 3,
        marginLeft:'-50px',
        borderRadius: 2,
        p: 3,
        width: 360,
        mx: "auto",
      }}
    >
      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: 600,
          mb: 3,
        }}
      >
        Booking Request
      </Typography>

      {/* Name Field */}
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Contact Number Field */}
      <TextField
        label="Contact Number"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Message Field */}
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        sx={{ mb: 3 }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          bgcolor: "#003366",
          color: "white",
          py: 1.5,
          "&:hover": { bgcolor: "#002244" },
        }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ListingBookingForm;
