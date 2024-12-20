import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper, Grid, Divider, CircularProgress } from '@mui/material';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { AiOutlineHeart } from 'react-icons/ai';
import { BsShare } from 'react-icons/bs';
import { BiMessageDetail } from 'react-icons/bi';
import { FiPhone } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import Header from './Header';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

const ListingDetails = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boatData, setBoatData] = useState(null);

  useEffect(() => {
    const fetchBoatDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://api.dubaiboating.com/public/api/boats`);
        const boat = response.data.find(boat => boat.id === parseInt(id));
        if (boat) {
          setBoatData(boat);
          setError(null);
        } else {
          setError('Boat listing not found');
        }
      } catch (err) {
        console.error('Error fetching boat details:', err);
        setError('Failed to fetch boat details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoatDetails();
    }
  }, [id]);

  const handleNextImage = () => {
    if (boatData?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % boatData.images.length);
    }
  };

  const handlePrevImage = () => {
    if (boatData?.images?.length) {
      setCurrentImageIndex((prev) => (prev === 0 ? boatData.images.length - 1 : prev - 1));
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Use placeholder images if no images are available
  const images = boatData?.images?.length > 0 
    ? boatData.images.map(img => `https://api.dubaiboating.com/storage/app/public/${img.image_url}`)
    : ['https://scoutboats.com/wp-content/uploads/2021/03/235dorado1.jpg'];

  const itemOverview = [
    { label: 'LENGTH', value: `${boatData?.length} ft.` },
    { label: 'YEAR', value: boatData?.year },
    { label: 'BRAND', value: boatData?.brand },
    { label: 'MODEL', value: boatData?.model },
    { label: 'CONDITION', value: boatData?.boat_condition },
  ];

  return (
    <>
    <Helmet>
  <title>{boatData ? boatData.title : "Listing Details"} | Dubai Boating</title>
  <meta
    name="description"
    content={boatData ? boatData.description.slice(0, 150) : "Explore our boat listings."}
  />
  <meta name="keywords" content="Dubai boat tours, boat rentals, boating, tours, Dubai attractions" />
  <meta property="og:title" content={boatData ? boatData.title : "Listing Details"} />
  <meta
    property="og:description"
    content={boatData ? boatData.description.slice(0, 150) : "Explore our boat listings."}
  />
  <meta
    property="og:image"
    content={boatData ? `https://api.dubaiboating.com/storage/app/public/${boatData.images[0]?.image_url}` : ""}
  />
</Helmet>
      <Header />
      <Container maxWidth="lg" sx={{ py: 3 }} style={{marginTop:'1rem'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}>
              {boatData?.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Posted {new Date(boatData?.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#003478', 
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', md: '2rem' }
            }}
          >
            AED {parseFloat(boatData?.price).toLocaleString()}
          </Typography>
        </Box>

        {/* Main Content Layout */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Left Side - Images Section */}
          <Box sx={{ flex: '1 1 70%' }}>
            {/* Image Carousel */}
            <Box sx={{ 
              position: 'relative', 
              width: '100%',
              height: '500px',
              mb: 2,
              bgcolor: '#000',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <img
                src={images[currentImageIndex]}
                alt={`${boatData?.title} view`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  px: 2,
                }}>
                  <Button
                    onClick={handlePrevImage}
                    sx={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    <IoIosArrowBack size={24} />
                  </Button>
                  <Button
                    onClick={handleNextImage}
                    sx={{
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                    }}
                  >
                    <IoIosArrowForward size={24} />
                  </Button>
                </Box>
              )}

              {/* Favorite & Share Buttons */}
              <Box sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1
              }}>
                <Button
                  variant="contained"
                  startIcon={<AiOutlineHeart />}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                  }}
                >
                  Favorite
                </Button>
                <Button
                  variant="contained"
                  startIcon={<BsShare />}
                  sx={{
                    bgcolor: 'white',
                    color: 'black',
                    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' },
                  }}
                >
                  Share
                </Button>
              </Box>
            </Box>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <Box sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                mb: 3,
                pb: 1,
                '::-webkit-scrollbar': {
                  height: '6px',
                },
                '::-webkit-scrollbar-thumb': {
                  backgroundColor: '#ccc',
                  borderRadius: '3px',
                }
              }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    sx={{
                      flexShrink: 0,
                      width: '100px',
                      height: '75px',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: currentImageIndex === idx ? '2px solid #1976d2' : 'none',
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* Item Overview Section */}
            <Box sx={{ mt: 3, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Item Overview
              </Typography>
              <Grid container spacing={2}>
                {itemOverview.map((item, index) => (
                  <Grid item xs={12} sm={6} md={2.4} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '10px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="body2">{item.value}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#9c9c9c' }} />

            {/* Description Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {boatData?.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: '#9c9c9c' }} />

            {/* Location Section */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Location
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  {boatData?.location}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: '#f3f4f6', 
                    color: 'text.primary', 
                    border: 'none',
                    '&:hover': {
                      bgcolor: '#e5e7eb',
                      border: 'none',
                    }
                  }}
                >
                  Show Map
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Right Side - Seller Info */}
          <Box sx={{ flex: '1 1 30%', maxWidth: '350px' }}>
            <Paper elevation={0} sx={{ 
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 3,
            }}>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                Posted by
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h6">Seller</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MdVerified color="#1976d2" size={16} />
                    <Typography variant="caption" sx={{ color: '#1976d2', fontWeight: 500 }}>
                      VERIFIED USER
                    </Typography>
                  </Box>
                </Box>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>
                  Joined on {new Date(boatData?.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<FiPhone />}
                  sx={{
                    bgcolor: '#003478',
                    '&:hover': { bgcolor: '#003488' },
                    fontWeight:'bold',
                    py: 1.5
                  }}
                >
                  Show Phone Number
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BiMessageDetail />}
                  sx={{ 
                    borderColor: '#e0e0e0', 
                    color: 'text.primary',
                    
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#bdbdbd',
                      bgcolor: 'transparent'
                    }
                  }}
                >
                  Chat with Seller
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default ListingDetails;