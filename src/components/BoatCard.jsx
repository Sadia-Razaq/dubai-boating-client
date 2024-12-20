import React, { useState } from 'react';
import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ImageIcon from '@mui/icons-material/Image';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const BoatCard = ({ id, title, price, year, length, location, images, boat_condition }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const baseUrl = 'https://api.dubaiboating.com/storage/app/public/';

  const handleRedirect = () => {
    navigate(`/listingdetails/${id}`);
  };

  const handleIconClick = (event) => {
    event.stopPropagation();
  };

  const handlePrevImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (event) => {
    event.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentImageUrl = images && images.length > 0 
    ? `${baseUrl}${images[currentImageIndex].image_url}`
    : 'https://via.placeholder.com/280x200';

  return (
    <Box 
      onClick={handleRedirect}
      sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        mb: 2, 
        pb: 2,
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        '&:hover': {
          '& .carousel-controls': {
            opacity: 1,
          }
        }
      }}
    >
      <Box sx={{ 
        position: 'relative',
        mr: { sm: 2 },
        mb: { xs: 2, sm: 0 },
        width: { xs: '100%', sm: '280px' },
        height: { xs: '240px', sm: '200px' }
      }}>
        <Box
          component="img"
          src={currentImageUrl}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            objectFit: 'cover',
            transition: 'all 0.3s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/280x200';
          }}
        />
        
        {images && images.length > 1 && (
          <Box className="carousel-controls" sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            opacity: { xs: 1, sm: 0 },
            transition: 'opacity 0.3s ease',
            px: 1
          }}>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                size: 'small'
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                size: 'small'
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}

        <IconButton 
          sx={{ position: 'absolute', top: 8, right: 40, color: 'white' }}
          size="small"
          onClick={handleIconClick} 
        >
          <ShareIcon />
        </IconButton>
        <IconButton 
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
          size="small"
          onClick={handleIconClick} 
        >
          <FavoriteBorderIcon />
        </IconButton>

        {images && images.length > 0 && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 8, 
            left: 8, 
            backgroundColor: 'rgba(0,0,0,0.6)', 
            color: 'white',
            padding: '2px 4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <ImageIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              {currentImageIndex + 1}/{images.length}
            </Typography>
          </Box>
        )}

        {images && images.length > 1 && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 8, 
            left: '50%', 
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 0.5
          }}>
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flex: 1,
        px: { xs: 1, sm: 0 }
      }}>
        <Box>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {boat_condition}
          </Typography>
          <Typography 
            variant="h5" 
            color="text.primary" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            AED {parseFloat(price).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Year: {year} | Length: {length} ft
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">{location}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BoatCard;