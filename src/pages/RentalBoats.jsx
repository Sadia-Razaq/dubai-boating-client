import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Select, 
  MenuItem,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { AiOutlineEnvironment } from 'react-icons/ai';
import RentalCard from 'components/RentalCard';
import Header from 'components/Header';
import { Helmet } from 'react-helmet-async';

const styles = {
  heroSection: {
    position: 'relative',
    height: '400px',
    marginBottom: '32px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    width: '100%'
  }
};

const RentalBoats = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [boatListings, setBoatListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('recommended');
  const [totalListings, setTotalListings] = useState(0);

  useEffect(() => {
    fetchBoatListings();
  }, []);

  const fetchBoatListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dubaiboating.com/public/api/boats');
      
      // Filter rental boats after fetching
      const rentalBoats = response.data.filter(boat => boat.type === 'rental');
      
      const formattedListings = rentalBoats.map(boat => ({
        id: boat.id,
        title: boat.title,
        location: boat.location,
        capacity: boat.capacity || 'N/A',
        crew: boat.crew || 'N/A',
        length: boat.length,
        speed: boat.speed || 'N/A',
        price: boat.price,
        images: boat.images,
        brand: boat.brand,
        model: boat.model,
        year: boat.year,
        boat_condition: boat.boat_condition,
        description: boat.description
      }));

      setBoatListings(formattedListings);
      setTotalListings(formattedListings.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching boat listings:', err);
      setError(`Failed to fetch rental boat listings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (boatId) => {
    navigate(`/boat/${boatId}`);
  };

  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortOrder(sortValue);

    let sortedListings = [...boatListings];
    switch (sortValue) {
      case 'price_low':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      default:
        // Reload listings with default order
        fetchBoatListings();
        return;
    }
    setBoatListings(sortedListings);
  };

  return (
    <>
      <Helmet>
        <title>Rental Boats | Find Your Ideal Boat for Rent</title>
        <meta name="description" content="Discover a wide range of boats available for rent. Search by location, price, and boat specifications to find the perfect boat for your next adventure." />
        <meta name="keywords" content="boat rentals, marina, boat hire, affordable boat rental, boats for rent" />
      </Helmet>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }} style={{ marginTop: '10px' }}>
        {/* Hero Section */}
        <Box sx={styles.heroSection}>
          <img 
            src="https://editorial.pxcrush.net/boatsales/general/editorial/quintrex-481-hornet_8053.jpg?pxc_width=900&pxc_height=600&pxc_method=crop&pxc_format=auto"
            alt="Marina"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box sx={styles.heroOverlay} />
        </Box>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={styles.listingsHeader}>
              <Typography variant="h6">
                {totalListings} boats found
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button
                  startIcon={<AiOutlineEnvironment />}
                  variant="text"
                  size="small"
                >
                  Show on the map
                </Button>
                <Select
                  size="small"
                  value={sortOrder}
                  onChange={handleSortChange}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="recommended">Recommended</MenuItem>
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                </Select>
              </Box>
            </Box>

            {loading ? (
              <Box sx={styles.loadingContainer}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ my: 2 }}>
                {error}
              </Alert>
            ) : boatListings.length === 0 ? (
              <Alert severity="info" sx={{ my: 2 }}>
                No rental boats found matching your criteria.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {boatListings.map((boat) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    lg={3} 
                    key={boat.id}
                  >
                    <Box onClick={() => handleCardClick(boat.id)} sx={{ cursor: 'pointer' }}>
                      <RentalCard 
                        id={boat.id}
                        title={boat.title}
                        price={boat.price}
                        year={boat.year}
                        length={boat.length}
                        location={boat.location}
                        images={boat.images}
                        boat_condition={boat.boat_condition}
                        capacity={boat.capacity || 12}
                        crew={boat.crew || 1}
                        speed={boat.speed || "32km/h"}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default RentalBoats;