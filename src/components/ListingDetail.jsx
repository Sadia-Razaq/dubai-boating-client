import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, CircularProgress, Grid } from "@mui/material";
import Header from "components/Header";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import ListingBookingForm from "components/ListingBookingForm";

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListingDetail();
  }, [id]);

  const fetchListingDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dubaiboating.com/public/api/listings');
      const selectedListing = response.data.listings.find(item => item.id === parseInt(id));
      if (selectedListing) {
        setListing(selectedListing);
        setError(null);
      } else {
        setError('Listing not found.');
      }
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError('Failed to fetch listing details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container sx={{ textAlign: 'center', py: 8, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Container>
      </>
    );
  }

  if (!listing) {
    return (
      <>
        <Header />
        <Container sx={{ textAlign: 'center', py: 8 }}>
          <Typography>Listing not found.</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{listing ? listing.title : "Listing Details"} | Dubai Boating</title>
        <meta
          name="description"
          content={listing ? listing.description.slice(0, 150) : "Explore our boat listings."}
        />
        <meta name="keywords" content="Dubai boat tours, boat rentals, boating, tours, Dubai attractions" />
        <meta property="og:title" content={listing ? listing.title : "Listing Details"} />
        <meta
          property="og:description"
          content={listing ? listing.description.slice(0, 150) : "Explore our boat listings."}
        />
        <meta property="og:image" content={`https://api.dubaiboating.com/storage/app/${listing.image}`} />
      </Helmet>
      <Header />
      <Container
  maxWidth="false"
  sx={{
    maxWidth: "1440px",
    px: { xs: 2, md: 4 },
    py: { xs: 4, md: 6 },
    mx: "auto",
  }}
>
  <Grid container spacing={1}> {/* Reduced spacing */}
    <Grid item xs={12} md={7}> {/* Adjusted column width */}
      {/* Featured Image */}
      <Box
        sx={{
          width: 'calc(100% - 20px)',
          height: { xs: '250px', md: '500px' }, /* Increased image height */
          mb: { xs: 2, md: 3 },
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <Box
          component="img"
          src={`https://api.dubaiboating.com/storage/app/${listing.image}`}
          alt={listing.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Content Section */}
      <Box sx={{ px: { xs: 0, md: 2 } }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 600,
            textAlign: 'left',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {listing.title}
        </Typography>

        {/* Date */}
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: 'text.secondary'
          }}
        >
          {new Date(listing.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography>

        {/* Description */}
        <Box
          sx={{
            '& > *': { mb: 2 },
            '& h1': {
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              mb: 2
            },
            '& h2': {
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 500,
              mb: 2,
              color: 'text.secondary'
            },
            '& p': {
              fontSize: { xs: '0.9rem', md: '1rem' },
              lineHeight: 1.6,
              '& strong': {
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 1,
              },
              '& span': {
                display: 'inline-block',
                px: 2,
                py: 1,
                borderRadius: 1,
              }
            }
          }}
          dangerouslySetInnerHTML={{ __html: listing.description }}
        />
      </Box>
    </Grid>
    <Grid item xs={12} md={5}> {/* Adjusted column width */}
      {/* Booking Form */}
      <ListingBookingForm listing={listing} />
    </Grid>
  </Grid>
</Container>

    </>
  );
};

export default ListingDetail;