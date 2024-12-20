import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Divider,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const MyProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Get user data from localStorage on component mount
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        setFormData({
          username: userData.username || '',
          email: userData.email || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        setNotification({
          open: true,
          message: 'Error loading user data',
          severity: 'error'
        });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsFormChanged(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
   };

  const handleClickShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async () => {
    try {
      const userString = localStorage.getItem('user');
      const userData = JSON.parse(userString);
      
      const response = await fetch(`https://api.dubaiboating.com/public/api/users/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          username: formData.username,
          email: formData.email,
        })
      });
  
      if (!response.ok) throw new Error('Failed to update profile');
  
      const updatedUser = await response.json();
      
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        ...formData
      }));
  
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
      setIsFormChanged(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  
  const handlePasswordSubmit = async () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        open: true,
        message: 'New passwords do not match',
        severity: 'error'
      });
      return;
    }
  
    setIsPasswordUpdating(true);
  
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        throw new Error('User data not found');
      }
      
      const userData = JSON.parse(userString);
      
      const response = await fetch(`https://api.dubaiboating.com/public/api/users/${userData.user_id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData.user_id,
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
  
      const data = await response.json();
  
      // Update local storage with new user data if returned
      if (data.user) {
        localStorage.setItem('user', JSON.stringify({
          ...userData,
          ...data.user
        }));
      }
  
      // Clear password fields
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
  
      // Show success message
      setNotification({
        open: true,
        message: data.message || 'Password updated successfully',
        severity: 'success'
      });
  
    } catch (error) {
      console.error('Error updating password:', error);
      setNotification({
        open: true,
        message: error.message || 'Failed to update password',
        severity: 'error'
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };


  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={8} sx={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Profile Details Section */}
        <Grid item xs={12} md={6} sx={{ 
          pr: { md: 6 }
        }}>
          <Typography variant="h6" gutterBottom>
            My Profile
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Update your profile details here
          </Typography>
          
          <Box mt={3}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Profile Details
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              This information is displayed on your profile
            </Typography>
            
            <TextField 
              name="username"
              label="Username" 
              variant="outlined" 
              margin="normal" 
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
            />
            
            <TextField 
              name="email"
              label="Email" 
              variant="outlined" 
              margin="normal" 
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
            />

            <Box mt={3} display="flex" justifyContent="center">
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={!isFormChanged}
                sx={{ 
                  bgcolor: isFormChanged ? '#d32f2f' : '#f0f0f0', 
                  color: isFormChanged ? '#fff' : '#000',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': {
                    bgcolor: isFormChanged ? '#aa2424' : '#e0e0e0'
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Change Password Section */}
        <Grid item xs={12} md={6} sx={{ pl: { md: 6 } }}>
          <Typography variant="h6" gutterBottom>
            Change Password
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Update your password here
          </Typography>

          <Box mt={3}>
            <TextField 
              name="oldPassword"
              label="Old Password" 
              variant="outlined" 
              margin="normal"
              type={showPassword.old ? 'text' : 'password'}
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword('old')}
                      edge="end"
                    >
                      {showPassword.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField 
              name="newPassword"
              label="New Password" 
              variant="outlined" 
              margin="normal"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword('new')}
                      edge="end"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField 
              name="confirmPassword"
              label="Confirm New Password" 
              variant="outlined" 
              margin="normal"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClickShowPassword('confirm')}
                      edge="end"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box mt={3} display="flex" justifyContent="center">
            <Button 
    variant="contained"
    onClick={handlePasswordSubmit}
    disabled={
      isPasswordUpdating || 
      !passwordData.oldPassword || 
      !passwordData.newPassword || 
      !passwordData.confirmPassword
    }
    sx={{ 
      bgcolor: '#f0f0f0',
      color: '#000',
      textTransform: 'none',
      px: 3,
      py: 1,
      '&:not(:disabled)': {
        bgcolor: '#d32f2f',
        color: '#fff',
        '&:hover': {
          bgcolor: '#aa2424'
        }
      }
    }}
  >
    {isPasswordUpdating ? 'Updating...' : 'Change Password'}
  </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyProfile;