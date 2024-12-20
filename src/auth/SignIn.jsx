import React, { useState } from 'react';
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
  Snackbar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Signup from './SignUp';

const SignIn = ({ open, onClose, openSignup, isSignupOpen, closeSignup, onOpenSignIn, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormFilled = formData.email && formData.password;

  const handleOpenSignup = () => {
    onClose();
    openSignup();
  };

  const handleBackToLogin = () => {
    closeSignup();
    onOpenSignIn();
  };

  const handleLogin = async () => {
    if (!isFormFilled) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api.dubaiboating.com/public/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show success message
      showMessage('Login successful! Welcome back.');
      
      // Call the onLogin callback with the user data
      onLogin(data.user);
      
      // Close the dialog after a short delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (err) {
      setError(err.message || 'An error occurred during login');
      showMessage(err.message || 'An error occurred during login', 'error');
    } finally {
      setIsLoading(false);
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
          
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 500,
              pb: 2,
              pt: 4,
            }}
          >
            Log in with your email
          </DialogTitle>
          
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <TextField
                name="email"
                placeholder="Email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
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
              
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogin}
                sx={{
                  mt: 1,
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
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#dc3545',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot your password?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: '#dc3545',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={handleOpenSignup}
              >
                Don't have an account? Create one
              </Typography>
              
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  By signing up I agree to the{' '}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  >
                    Terms and Conditions
                  </Typography>
                  {' '}and{' '}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ cursor: 'pointer' }}
                  >
                    Privacy Policy
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Signup 
        open={isSignupOpen} 
        onClose={closeSignup} 
        onBackToLogin={handleBackToLogin}
      />
    </>
  );
};

export default SignIn;