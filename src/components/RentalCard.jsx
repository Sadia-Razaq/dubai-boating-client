import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';

const baseUrl = 'https://api.dubaiboating.com/storage/app/public/';

const styles = {
  card: {
    width: '100%',
    maxWidth: 345,
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  },
  mediaContainer: {
    position: 'relative',
    height: 200,
  },
  media: {
    height: '100%',
    objectFit: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    padding: '8px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.9)',
    },
  },
  content: {
    padding: '16px !important',
  },
  location: {
    fontSize: '0.875rem',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: '4px',
  },
  boatName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'rgba(0,0,0,0.87)',
    marginBottom: '8px',
  },
  condition: {
    fontSize: '0.875rem',
    color: 'rgba(0,0,0,0.6)',
    marginBottom: '8px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    padding: '16px 0',
    borderTop: '1px solid rgba(0,0,0,0.12)',
    borderBottom: '1px solid rgba(0,0,0,0.12)',
    marginBottom: '16px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statIcon: {
    color: 'rgba(0,0,0,0.54)',
    fontSize: '20px',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  priceContainer: {
    marginTop: '16px',
  },
  priceLabel: {
    fontSize: '0.875rem',
    color: 'rgba(0,0,0,0.6)',
  },
  price: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginLeft: '4px',
  },
};

const RentalCard = ({ 
  id, 
  title, 
  price, 
  year, 
  length, 
  location, 
  images, 
  boat_condition,
  capacity = 12,
  crew = 1,
  speed = "32km/h"
}) => {
  // Find primary image or fallback to first image
  const getPrimaryImage = () => {
    if (!images || images.length === 0) {
      return "/api/placeholder/400/300";
    }
    
    const primaryImage = images.find(img => img.is_primary === 1);
    if (primaryImage) {
      return `${baseUrl}${primaryImage.image_url}`;
    }
    
    // Fallback to first image if no primary image is set
    return `${baseUrl}${images[0].image_url}`;
  };

  return (
    <Card sx={styles.card}>
      <Box sx={styles.mediaContainer}>
        <CardMedia
          component="img"
          image={getPrimaryImage()}
          alt={title}
          sx={styles.media}
        />
        <IconButton sx={styles.favoriteButton} size="small">
          <FavoriteIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <CardContent sx={styles.content}>
        <Typography sx={styles.location}>
          {location}
        </Typography>
        
        <Typography sx={styles.boatName}>
          {title}
        </Typography>

        <Typography sx={styles.condition}>
          {boat_condition} • {year}
        </Typography>

        <Box sx={styles.statsContainer}>
          <Box sx={styles.statItem}>
            <PersonIcon sx={styles.statIcon} />
            <Typography sx={styles.statValue}>{capacity}</Typography>
          </Box>
          <Box sx={styles.statItem}>
            <DirectionsBoatIcon sx={styles.statIcon} />
            <Typography sx={styles.statValue}>{crew}</Typography>
          </Box>
          <Box sx={styles.statItem}>
            <StraightenIcon sx={styles.statIcon} />
            <Typography sx={styles.statValue}>{length}ft</Typography>
          </Box>
          <Box sx={styles.statItem}>
            <SpeedIcon sx={styles.statIcon} />
            <Typography sx={styles.statValue}>{speed}</Typography>
          </Box>
        </Box>

        <Box sx={styles.priceContainer}>
          <Typography component="span" sx={styles.priceLabel}>
            from
          </Typography>
          <Typography component="span" sx={styles.price}>
            AED {parseFloat(price).toLocaleString()}/hr
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RentalCard;