import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Favorite,
  Share,
} from '@mui/icons-material';
import Header from './Header';
import BookingSidebar from './BookingSidebar';
import { Helmet } from 'react-helmet-async';

const baseUrl = 'https://api.dubaiboating.com/storage/app/public/';

// Keep existing styles...
const styles = {
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
  },
  title: {
    '& h1': {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    '& p': {
      color: 'text.secondary',
    },
  },
  price: {
    color: '#ff0000',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  mainContainer: {
    display: 'flex', // Changed from grid to flex
    gap: '24px',
    alignItems: 'flex-start', // Ensure both columns align at the top
  },
  leftColumn: {
    flex: 2, // This will take 2/3 of the width
  },
  rightColumn: {
    flex: 1, // This will take 1/3 of the width
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '16px',
  },
  mainImage: {
    width: '100%',
    height: '500px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  navigationButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  navigationButtonLeft: {
    left: '16px',
  },
  navigationButtonRight: {
    right: '16px',
  },
  imageActions: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    display: 'flex',
    gap: '8px',
    '& .MuiIconButton-root': {
      backgroundColor: 'white',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    },
  },
  thumbnailContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
  },
  thumbnail: {
    width: '100px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  selectedThumbnail: {
    border: '2px solid #1976d2',
  },
  specs: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '16px',
    marginTop: '16px',
  },
  specItem: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
};


const RentalBoatDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [boatData, setBoatData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const getLoggedInUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

   // Fetch boat owner details
   const fetchOwnerDetails = async (userId) => {
    try {
      const response = await axios.get(`https://api.dubaiboating.com/public/api/users/${userId}`);
      setOwnerData(response.data);
    } catch (err) {
      console.error('Error fetching owner details:', err);
      throw err;
    }
  };


  useEffect(() => {
    const fetchBoatDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.dubaiboating.com/public/api/boats/${id}`);
        
        const formattedBoatData = {
          id: response.data.id,
          title: response.data.title,
          price: response.data.price,
          postedDate: new Date(response.data.created_at).toLocaleDateString(),
          location: response.data.location,
          user_id: response.data.user_id,
          specs: {
            length: `${response.data.length} ft`,
            year: response.data.year,
            brand: response.data.brand,
            model: response.data.model,
            condition: response.data.boat_condition
          },
          description: response.data.description,
          hourlyRate: parseFloat(response.data.price),
          dailyRate: parseFloat(response.data.price) * 8,
          images: response.data.images.map(img => `${baseUrl}${img.image_url}`)
        };
        
        setBoatData(formattedBoatData);
        
        // Fetch owner details if user_id exists
        if (response.data.user_id) {
          await fetchOwnerDetails(response.data.user_id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching boat details:', err);
        setError('Failed to load boat details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoatDetails();
    }
  }, [id]);

 // Handle booking submission
 const handleBookingSubmit = async (bookingDetails) => {
  const loggedInUser = getLoggedInUser();
  
  if (!loggedInUser) {
    setSnackbar({
      open: true,
      message: 'Please log in to make a booking',
      severity: 'warning'
    });
    navigate('/', { state: { from: `/boats/${id}` } });
    return;
  }

  try {
    // Send only the fields that backend expects
    const bookingData = {
      boat_id: parseInt(boatData.id),
      user_id: parseInt(loggedInUser.user_id),
      booking_date: bookingDetails.booking_date,
      end_date: bookingDetails.end_date,
      start_time: bookingDetails.start_time,
      end_time: bookingDetails.end_time,
      total_price: bookingDetails.total_price,
      status: 'pending'
    };

    const response = await axios.post(
      'https://api.dubaiboating.com/public/api/bookings', 
      bookingData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  } catch (err) {
    console.error('Error creating booking:', err);
    throw new Error(err.response?.data?.message || 'Failed to create booking');
  }
};
 



  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!boatData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">No boat details found.</Alert>
      </Box>
    );
  }




  return (
    <>
      <Helmet>
        <title>{boatData.title} | Dubai Boating Rentals</title>
        <meta name="description" content={`${boatData.description?.slice(0, 150)}...`} />
        <meta name="keywords" content="Dubai boat rentals, yacht for sale, Dubai Marina, boat tours, boating, yachts" />
        <meta property="og:title" content={boatData.title} />
        <meta property="og:description" content={`${boatData.description?.slice(0, 150)}...`} />
        <meta property="og:image" content={boatData.images[0]} />
      </Helmet>
      
      <Header />
      
      <Box sx={styles.wrapper}>
        <Box sx={styles.header}>
          <Box sx={styles.title}>
            <Typography variant="h1">{boatData.title}</Typography>
          </Box>
        </Box>

        <Box sx={styles.mainContainer}>
          {/* Left Column */}
          <Box sx={styles.leftColumn}>
            {/* Image Gallery */}
            <Box sx={styles.imageContainer}>
              <img
                src={boatData.images[currentImageIndex]}
                alt={`${boatData.title} - View ${currentImageIndex + 1}`}
                style={styles.mainImage}
              />
              {boatData.images.length > 1 && (
                <>
                  <IconButton
                    sx={{ ...styles.navigationButton, ...styles.navigationButtonLeft }}
                    onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : boatData.images.length - 1)}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    sx={{ ...styles.navigationButton, ...styles.navigationButtonRight }}
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % boatData.images.length)}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
              <Box sx={styles.imageActions}>
                <IconButton>
                  <Favorite />
                </IconButton>
                <IconButton>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            {/* Thumbnail Gallery */}
            {boatData.images.length > 1 && (
              <Box sx={styles.thumbnailContainer}>
                {boatData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      ...styles.thumbnail,
                      ...(index === currentImageIndex ? styles.selectedThumbnail : {}),
                    }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </Box>
            )}

            {/* Item Overview */}
            <Card sx={{ marginBottom: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Item Overview
                </Typography>
                <Box sx={styles.specs}>
                  {Object.entries(boatData.specs).map(([key, value]) => (
                    <Box key={key} sx={styles.specItem}>
                      <Typography variant="caption" sx={{ textTransform: 'uppercase' }} color="text.secondary">
                        {key}
                      </Typography>
                      <Typography>{value || 'N/A'}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Description */}
            <Card sx={{ marginBottom: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {boatData.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Location
                    </Typography>
                    <Typography color="text.secondary">
                      {boatData.location}
                    </Typography>
                  </Box>
                  <Button>SHOW MAP</Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Column - Booking Sidebar */}
          <Box sx={styles.rightColumn}>
        <BookingSidebar 
          hourlyRate={boatData.hourlyRate}
          dailyRate={boatData.hourlyRate * 24} // Updated to calculate daily rate based on hourly rate
          ownerData={ownerData}
          onBookingSubmit={handleBookingSubmit}
          boatId={boatData.id}
        />
       </Box>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RentalBoatDetails;