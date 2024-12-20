import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Popover,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Info,
  KeyboardArrowDown,
  Add,
  Remove,
} from '@mui/icons-material';

const styles = {
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f5f5f5',
    mb: 3,
  },
  incrementButton: {
    minWidth: '30px',
    height: '30px',
    p: 0,
    borderRadius: '50%',
    border: '2px solid #003478',
    color: '#003478',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)',
      border: '2px solid #003478',
    },
    '& .MuiSvgIcon-root': {
      fontSize: '20px',
    },
  },
  dateSelector: {
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '4px',
    p: 2,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    '&:hover': {
      borderColor: 'text.primary',
    },
  },
  bookButton: {
    mt: 3,
    py: 1.5,
    backgroundColor: '#003477',
    '&:hover': {
      backgroundColor: '#003478',
    },
  },
};

const Calendar = ({ selectedDate, onSelect }) => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Box sx={{ p: 2, backgroundColor: 'white', minWidth: '280px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>November 2024</Typography>
        <Button sx={{ minWidth: 'auto', p: 0.5 }}>→</Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, textAlign: 'center' }}>
        {days.map(day => (
          <Typography key={day} sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 500 }}>
            {day}
          </Typography>
        ))}
        {dates.map(date => (
          <Button
            key={date}
            onClick={() => onSelect(date)}
            sx={{
              minWidth: '32px',
              height: '32px',
              p: 0,
              borderRadius: '50%',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'primary.light' },
              ...(selectedDate === date && { backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }),
            }}
          >
            {date}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const BookingSidebar = ({ 
  hourlyRate, 
  dailyRate, 
  ownerData, 
  onBookingSubmit,
  boatId 
}) => {
  const [selectedHours, setSelectedHours] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isHourlyBooking = Boolean(startTime);
  const isDailyBooking = Boolean(selectedDateFrom || selectedDateTo);

  // Calculate end time based on start time and selected hours
  const calculateEndTime = () => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + selectedHours;
    return `${String(endHours % 24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    // Clear daily booking selections if they exist
    setSelectedDateFrom(null);
    setSelectedDateTo(null);
  };

  const handleDateClick = (event, setDate) => {
    // Clear hourly booking selections if they exist
    if (startTime) {
      setStartTime('');
      setSelectedHours(1);
    }
    setAnchorEl({ target: event.currentTarget, setDate });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const calculateTotalPrice = () => {
    if (startTime) {
      // Hourly booking
      return hourlyRate * selectedHours;
    } else if (selectedDateFrom && selectedDateTo) {
      // Daily booking
      const days = Math.max(1, selectedDateTo - selectedDateFrom + 1);
      return hourlyRate * 24 * days;
    }
    return 0;
  };



  const handleBookNow = async () => {
    if (!startTime && !selectedDateFrom) {
      setError("Please select either hourly booking or date range");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const totalPrice = calculateTotalPrice();
      
      // Create booking data according to backend requirements
      const bookingData = {
        boat_id: boatId,
        user_id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).user_id : null,
        total_price: totalPrice,
        // For hourly booking
        booking_date: startTime ? new Date(2024, 10, new Date().getDate()).toISOString().split('T')[0] : null,
        start_time: startTime || null,
        end_time: calculateEndTime() || null,
        // For daily booking
        booking_date: !startTime ? formatDate(selectedDateFrom) : null,
        end_date: !startTime ? formatDate(selectedDateTo) : null,
        status: 'pending'
      };
  
      await onBookingSubmit(bookingData);
      setOpenBookingDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update formatDate function to match backend expected format
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(2024, 10, date);
    return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  };




  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 1;
    return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  };

  const handleBookingDialogClose = () => {
    setOpenBookingDialog(false);
  };

  const handleBookingConfirm = () => {
    setOpenBookingDialog(false);
    alert('Request has been sent! A representative will reach out to you within 24 hours. If you do not receive any reply please call 051243567.');
  };

  return (
    <Card sx={{ position: 'sticky', top: '24px', p: 2 }}>
      <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', color: '#003478', padding: '5px' }}>
        <Typography variant="h5">Booking Request</Typography>
      </Box>

      <CardContent>
       {/* Owner Profile Section */}
       <Box sx={styles.profileSection}>
          <img 
            src={ownerData?.profile_image || "/api/placeholder/40/40"} 
            alt="Profile" 
            style={{ borderRadius: '50%' }} 
          />
          <Box>
            <Typography variant="subtitle1">{ownerData?.name || 'Owner'}</Typography>
            <Typography variant="caption" color="text.secondary">
              Member Since {new Date(ownerData?.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography>${hourlyRate}/per hour</Typography>
        <Typography>Total: ${calculateTotalPrice()}</Typography>
        </Box>

        {/* Hourly Booking Section */}


        <Box 
          sx={{ 
            opacity: isDailyBooking ? 0.5 : 1, 
            pointerEvents: isDailyBooking ? 'none' : 'auto',
            position: 'relative'
          }}
        >
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
            Return on Same Day
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button 
                variant="outlined" 
                sx={styles.incrementButton} 
                onClick={() => setSelectedHours(h => Math.max(1, h - 1))}
              >
                <Remove />
              </Button>
              <Typography sx={{ mx: 2, minWidth: '40px', textAlign: 'center' }}>{selectedHours}</Typography>
              <Button 
                variant="outlined" 
                sx={styles.incrementButton} 
                onClick={() => setSelectedHours(h => h + 1)}
              >
                <Add />
              </Button>
              <Typography sx={{ ml: 2 }}>Hours</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Start Time</InputLabel>
                <Select value={startTime} label="Start Time" onChange={handleStartTimeChange}>
                  {timeOptions.map((time) => <MenuItem key={time} value={time}>{time}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled>
                <InputLabel>End Time</InputLabel>
                <Select value={calculateEndTime()} label="End Time">
                  <MenuItem value={calculateEndTime()}>{calculateEndTime()}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>


        <Divider sx={{ my: 2 }} />

        {/* Daily Booking Section */}
        <Box 
          sx={{ 
            opacity: isHourlyBooking ? 0.5 : 1, 
            pointerEvents: isHourlyBooking ? 'none' : 'auto',
            position: 'relative'
          }}
        >
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
            Return on Different Day
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box onClick={(e) => handleDateClick(e, setSelectedDateFrom)} sx={styles.dateSelector}>
              <Typography color={selectedDateFrom ? 'text.primary' : 'text.secondary'}>
                {selectedDateFrom ? formatDate(selectedDateFrom) : 'Date From'}
              </Typography>
              <KeyboardArrowDown />
            </Box>
            <Typography sx={{ alignSelf: 'center' }}>to</Typography>
            <Box onClick={(e) => handleDateClick(e, setSelectedDateTo)} sx={styles.dateSelector}>
              <Typography color={selectedDateTo ? 'text.primary' : 'text.secondary'}>
                {selectedDateTo ? formatDate(selectedDateTo) : 'Date To'}
              </Typography>
              <KeyboardArrowDown />
            </Box>
          </Box>
        </Box>


        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl?.target}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          sx={{ mt: 1 }}
        >
          <Calendar 
            selectedDate={anchorEl?.setDate === setSelectedDateFrom ? selectedDateFrom : selectedDateTo}
            onSelect={(date) => {
              anchorEl?.setDate(date);
              handleClose();
            }}
          />
        </Popover>

        <Button 
          variant="contained" 
          fullWidth 
          sx={styles.bookButton} 
          onClick={handleBookNow}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'BOOK NOW'}
        </Button>

        <Dialog
          open={openBookingDialog}
          onClose={() => setOpenBookingDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ backgroundColor: '#8bc462', color: 'white', padding: '16px 24px' }}>
            Booking Successful!
          </DialogTitle>
          <DialogContent sx={{ padding: '24px' }}>
            <Typography variant="body1" align="center">
              Your booking request has been sent successfully! A representative will reach out to you within 24 hours. 
              If you do not receive any reply please call 051243567.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button 
              onClick={() => setOpenBookingDialog(false)} 
              variant="contained" 
              fullWidth 
              sx={{ backgroundColor: '#003478', color: 'white' }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BookingSidebar;