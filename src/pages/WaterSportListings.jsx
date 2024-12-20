import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ListingsCard from "components/ListingsCard";
import Header from "components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const WaterSportListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dubaiboating.com/public/api/listings');
      const scubaListings = response.data.listings.filter(listing => listing.type === "WaterSport");
      setListings(scubaListings);
      setError(null);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to fetch listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Helmet>
        <title>Water Sport Listings</title>
        <meta name="description" content="Discover exciting water sports activities in Dubai. Find your perfect adventure today!" />
        <meta name="keywords" content="Water Sports, Activities, Dubai, Adventure, Scuba" />
        <meta property="og:title" content="Water Sport Listings" />
        <meta property="og:description" content="Discover exciting water sports activities in Dubai. Find your perfect adventure today!" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/water-sport-listings" /> 
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <Container
        maxWidth="false"
        sx={{
          maxWidth: "1440px",
          px: { xs: 2, sm: 3, md: 4 },
          mx: "auto",
        }}
      >
        <Box sx={{ my: { xs: 4, md: 8 } }}>
          <Typography variant="h4" sx={{ textAlign: 'left', mb: { xs: 4, md: 8 } }}>
            Water Sport
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 0, md: 6 },
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            {/* Listings Section */}
            <Box sx={{ 
              flex: 1,
              width: '100%'
            }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ textAlign: 'center', py: 8, color: 'error.main' }}>
                  <Typography>{error}</Typography>
                </Box>
              ) : listings.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography>No listings found.</Typography>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1, // Reduced gap to 10px equivalent
                  p: 0, // Remove padding
                }}>
                  {listings.map((listing) => (
                    <Box
                      key={listing.id}
                      sx={{
                        cursor: 'pointer',
                        width: '100%',
                        '&:hover': {
                          opacity: 0.9,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease-in-out',
                        },
                      }}
                      onClick={() => navigate(`/listings/${listing.id}`)}
                    >
                      <ListingsCard
                        title={listing.title}
                        description={listing.description}
                        image={listing.image}
                        isMobile={isMobile}
                        isTablet={isTablet}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Sidebar Advertisement - Hidden on mobile */}
            {!isMobile && (
              <Box 
                sx={{ 
                  width: { sm: '300px', md: '350px' },
                  flexShrink: 0,
                  height: 'fit-content',
                  position: 'sticky',
                  top: 24,
                  display: { xs: 'none', md: 'block' }
                }}
              >
               <Box 
                  sx={{
                    width: '80%', 
                    height: '500px', 
                    mx: 'auto', 
                    bgcolor: '#f0f0f0',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                 >
                  <Box
                    component="img"
                    src="https://tpc.googlesyndication.com/simgad/17768704824446043541"
                    alt="Advertisement"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default WaterSportListings;