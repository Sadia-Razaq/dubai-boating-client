import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  styled,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios from "axios";
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#1976d2",
    },
  },
});

const StyledFormControl = styled(FormControl)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#1976d2",
    },
    "&.MuiInputLabel-shrink": {
      backgroundColor: "white",
      padding: "0 4px",
    },
  },
});

const StyledSelect = styled(Select)({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  textTransform: "none",
  padding: "10px 20px",
});

const NewRentalBoat = () => {
  const navigate = useNavigate();
  const initialFormState = {
    title: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    length: "",
    price: "",
    boat_condition: "",
    location: "Dubai",
    images: [],
    imagePreviews: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_id) {
      setUserId(user.user_id);
    } else {
      setError("User not logged in");
    }
  }, []);



  const resetForm = () => {
    setFormData(initialFormState);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newImagePreviews = newFiles.map((file) => URL.createObjectURL(file));
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...newFiles],
      imagePreviews: [...prevFormData.imagePreviews, ...newImagePreviews],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("Please log in to post an ad");
      setError("Please log in to post an ad");
      return;
    }

    const loadingToast = toast.loading('Posting your ad...');

    const data = new FormData();
    data.append("user_id", userId);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("brand", formData.brand);
    data.append("model", formData.model);
    data.append("year", formData.year);
    data.append("length", formData.length);
    data.append("price", formData.price);
    data.append("boat_condition", formData.boat_condition);
    data.append("location", formData.location);
    data.append("type", "rental"); 

    formData.images.forEach((image) => {
      data.append("images[]", image);
    });

    try {
      const response = await axios.post("https://api.dubaiboating.com/public/api/boats", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss(loadingToast);
      toast.success('Your ad has been placed successfully!', {
        duration: 3000,
      });

      resetForm();
      
      setTimeout(() => {
        navigate('/my-profile/myAds');
      }, 1500);
      
    } catch (error) {
      toast.dismiss(loadingToast);
      
      console.error("Error saving boat:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || "Error saving boat";
      setError(errorMessage);
      
      toast.error(errorMessage, {
        duration: 4000,
      });
    }
  };
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }




  return (
    <Box maxWidth="600px" margin="auto" component="form" onSubmit={handleSubmit}>
        <Toaster 
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            style: {
              background: '#4caf50',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#d32f2f',
              color: '#fff',
            },
          },
        }}
      />

      <Typography variant="h5" gutterBottom style={{ fontWeight: "bold" }}>
        Place Rental Boat ad!
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Include as much details and pictures as possible!
      </Typography>
      <Divider style={{ margin: "20px 0" }} />

      <StyledTextField
        label="Title"
        variant="outlined"
        margin="normal"
        fullWidth
        required
        name="title"
        value={formData.title}
        onChange={handleInputChange}
      />


        <StyledButton
        variant="outlined"
        startIcon={<AddAPhotoIcon />}
        style={{ marginTop: "16px", marginBottom: "16px" }}
        fullWidth
        component="label"
      >
        Add Pictures
        <input
          type="file"
          multiple
          hidden
          name="images"
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/jpg"
        />
      </StyledButton>



      <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
        {formData.imagePreviews.map((preview, index) => (
          <img
            key={index}
            src={preview}
            alt={`preview-${index}`}
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
          />
        ))}
      </Box>

      <StyledTextField
        label="Price"
        variant="outlined"
        margin="normal"
        fullWidth
        required
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        InputProps={{
          endAdornment: <Typography>AED</Typography>,
        }}
      />


        <StyledTextField
        label="Describe your item"
        variant="outlined"
        margin="normal"
        fullWidth
        required
        multiline
        rows={4}
        name="description"
        value={formData.description}
        onChange={handleInputChange}
      />

      <StyledTextField
        label="Year"
        variant="outlined"
        margin="normal"
        fullWidth
        name="year"
        value={formData.year}
        onChange={handleInputChange}
      />

      <StyledFormControl fullWidth margin="normal">
        <InputLabel id="condition-label">Condition</InputLabel>
        <StyledSelect
          labelId="condition-label"
          label="Condition"
          name="boat_condition"
          value={formData.boat_condition}
          onChange={handleInputChange}
        >
          <MenuItem value="New">New</MenuItem>
          <MenuItem value="Used">Used</MenuItem>
          <MenuItem value="Refurbished">Refurbished</MenuItem>
        </StyledSelect>
      </StyledFormControl>


      <StyledFormControl fullWidth margin="normal">
        <InputLabel id="length-label">Length</InputLabel>
        <StyledSelect
          labelId="length-label"
          label="Length"
          name="length"
          value={formData.length}
          onChange={handleInputChange}
        >
          <MenuItem value="under10">Under 10 ft.</MenuItem>
          <MenuItem value="10-14">10-14 ft.</MenuItem>
          <MenuItem value="15-19">15-19 ft.</MenuItem>
          <MenuItem value="20-24">20-24 ft.</MenuItem>
          <MenuItem value="25-29">25-29 ft.</MenuItem>
          <MenuItem value="30-39">30-39 ft.</MenuItem>
          <MenuItem value="40-49">40-49 ft.</MenuItem>
          <MenuItem value="50-69">50-69 ft.</MenuItem>
          <MenuItem value="70-100">70-100 ft.</MenuItem>
          <MenuItem value="over100">100+ ft.</MenuItem>
        </StyledSelect>
      </StyledFormControl>


      <StyledTextField
        label="Brand"
        variant="outlined"
        margin="normal"
        fullWidth
        name="brand"
        value={formData.brand}
        onChange={handleInputChange}
      />

      <StyledTextField
        label="Model"
        variant="outlined"
        margin="normal"
        fullWidth
        name="model"
        value={formData.model}
        onChange={handleInputChange}
      />



<StyledTextField
        label="Location"
        variant="outlined"
        margin="normal"
        fullWidth
        placeholder="Optional"
        name="location"
        value={formData.location}
        onChange={handleInputChange}
      />

<Box mt={3} display="flex" justifyContent="center">
        <StyledButton
          variant="contained"
          color="primary"
          style={{ backgroundColor: "#d32f2f", color: "#fff", width: "100%" }}
          type="submit"
        >
          Place Rental Ad
        </StyledButton>
      </Box>
    </Box>
  );
};

export default NewRentalBoat;