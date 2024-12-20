import React, { useState } from 'react';
import axios from 'axios';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Signup = ({ open, onClose, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [errors, setErrors] = useState({});

  const passwordRequirements = [
    { text: 'At least 7 characters long', test: (pass) => pass.length >= 7 },
    { text: 'One upper and one lower case letter', test: (pass) => /[a-z]/.test(pass) && /[A-Z]/.test(pass) },
    { text: 'Must contain a number', test: (pass) => /\d/.test(pass) },
    { text: 'At least one special character', test: (pass) => /[!@#$%^&*(),.?":{}|<>]/.test(pass) },
    { text: 'Must not include your name', test: (pass, name) => !pass.toLowerCase().includes(name.toLowerCase()) }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const failedRequirements = passwordRequirements.filter(
        req => !req.test(formData.password, formData.username)
      );
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://api.dubaiboating.com/public/api/users', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setToast({
        open: true,
        message: 'Account created successfully! Please login.',
        severity: 'success'
      });
      
      // Clear form and close dialog after successful signup
      setTimeout(() => {
        setFormData({ username: '', email: '', password: '' });
        onClose();
        onBackToLogin();
      }, 1500);
      
    } catch (error) {
      let errorMessage = 'Failed to create account';
      
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        setErrors(serverErrors);
        errorMessage = Object.values(serverErrors)[0];
      }
      
      setToast({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ position: 'relative', padding: '24px' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={onBackToLogin}
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 500,
              pb: 2,
              pt: 4,
            }}
          >
            Create an account
          </DialogTitle>
          
          <DialogContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                name="username"
                placeholder="Name"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  },
                }}
              />
              
              <TextField
                name="email"
                placeholder="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  },
                }}
              />
              
              <TextField
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                  },
                }}
              />
              
              <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: '8px' }}>
                {passwordRequirements.map((req, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {req.test(formData.password, formData.username) ? (
                      <CheckIcon sx={{ color: 'green', fontSize: 16 }} />
                    ) : (
                      <ClearIcon sx={{ color: 'red', fontSize: 16 }} />
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {req.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              <Button 
                type="submit"
                variant="contained" 
                fullWidth 
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '16px',
                  backgroundColor:  '#dc3545' ,
                  color:  '#fff' ,
                  '&:hover': {
                    backgroundColor:'#c82333' ,
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              
              <Typography variant="body2" align="center" sx={{ mt: 1, fontSize: '12px', color: 'text.secondary' }}>
                By signing up I agree to the{' '}
                <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                  Terms and Conditions
                </Typography>
                {' '}and{' '}
                <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                  Privacy Policy
                </Typography>
              </Typography>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Signup;