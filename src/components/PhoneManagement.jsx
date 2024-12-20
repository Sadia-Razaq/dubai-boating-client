import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';

// Custom styled button
const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#dc3545',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#c82333',
  },
  height: '40px',
  minWidth: '120px'
}));

// Custom styled TextField
const PhoneTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: '40px',
    width: '300px',
  },
});

// Message container with fixed height to prevent layout shift
const MessageContainer = styled(Box)({
  height: '20px', // Fixed height for message container
  marginTop: '4px',
  display: 'flex',
  alignItems: 'center'
});

const PhoneManagement = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasPhone, setHasPhone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Check if user has phone number
    if (user?.phone) {
      setPhoneNumber(user.phone);
      setHasPhone(true);
    }
    setLoading(false);
  }, []);

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    if (!value.startsWith('+971')) {
      value = '+971' + value.replace(/[^\d]/g, '').slice(0, 9);
    } else {
      const prefix = value.slice(0, 4);
      const rest = value.slice(4).replace(/[^\d]/g, '').slice(0, 9);
      value = prefix + rest;
    }
    
    setPhoneNumber(value);
    setSuccessMessage(''); 
  };

  const handleSubmit = async () => {
    try {
      const url = hasPhone 
        ? `https://api.dubaiboating.com/public/api/users/${user.user_id}/update-phone`
        : `https://api.dubaiboating.com/public/api/users/${user.user_id}/add-phone`;

      const response = await axios({
        method: 'POST',
        url: url,
        data: { phone: phoneNumber },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Update user in localStorage with new phone number
      const updatedUser = { ...user, phone: phoneNumber };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state to reflect changes
      setHasPhone(true);
      setSuccessMessage(hasPhone ? 'Phone number updated successfully' : 'Phone number added successfully');
      setError('');

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      console.error('Error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box 
      sx={{ 
        width: '100%',
        p: 3,
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
          gap: 3,
          ml: 4
        }}
      >
        <Typography 
          component="label" 
          sx={{ 
            color: 'text.secondary',
            minWidth: 'fit-content',
            mt: '10px' // Added top margin to align with input
          }}
        >
          Phone
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <PhoneTextField
            value={phoneNumber}
            onChange={handlePhoneChange}
            variant="outlined"
            size="small"
            error={!!error}
            onFocus={(e) => {
              if (!phoneNumber) {
                setPhoneNumber('+971 ');
                setTimeout(() => {
                  e.target.selectionStart = e.target.selectionEnd = 5;
                }, 0);
              }
            }}
          />

          <MessageContainer>
            {error && (
              <Typography
                sx={{
                  color: 'error.main',
                  fontSize: '0.875rem',
                }}
              >
                {error}
              </Typography>
            )}
            {successMessage && (
              <Typography
                sx={{
                  color: 'green',
                  fontSize: '0.875rem',
                }}
              >
                {successMessage}
              </Typography>
            )}
          </MessageContainer>
        </Box>

        <ColorButton 
          variant="contained"
          onClick={handleSubmit}
          sx={{ mt: '2px' }} // Added small top margin to align with input
        >
          {hasPhone ? 'Change Number' : 'Add Number'}
        </ColorButton>
      </Box>
    </Box>
  );
};

export default PhoneManagement;