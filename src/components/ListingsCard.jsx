import React, { useState, useMemo } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DOMPurify from 'dompurify';

const ListingsCard = ({ title, image, description, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const baseUrl = 'https://api.dubaiboating.com/storage/app/';
  const theme = useTheme();
  const images = image ? [{ image_url: image }] : [];

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

  const currentImageUrl = images.length > 0
    ? `${baseUrl}${images[currentImageIndex].image_url}`
    : 'https://via.placeholder.com/200x160';

  // Process HTML description to keep it concise
  const processedDescription = useMemo(() => {
    if (!description || description.trim() === '') {
      return 'No description available';
    }

    // Sanitize and parse the HTML description
    const sanitizedDesc = DOMPurify.sanitize(description, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });

    // Create a temporary div to work with the sanitized HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedDesc;

    // Extract non-empty text content from paragraphs
    const extractedTexts = Array.from(tempDiv.querySelectorAll('p'))
      .map(p => p.textContent.trim())
      .filter(text => text && text !== '');

    // Truncate to max 3 lines
    const maxLines = 3;
    let formattedDescription = extractedTexts.slice(0, maxLines).join('\n');

    // Add ellipsis if truncated
    if (extractedTexts.length > maxLines) {
      formattedDescription += '...';
    }

    return formattedDescription;
  }, [description]);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        overflow: 'hidden',
        mb: 2,
        maxWidth: '75%',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          opacity: 0.9,
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: '150px', md: '150px' , lg: '150px'},
          height: { xs: '160px', sm: '120px', md: '120px', lg: '120px' },
          mr: { sm: 2, md: 2 },
        }}
      >
        <Box
          component="img"
          src={currentImageUrl}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '5px',
          }}
        />

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: { xs: '100%', sm: '50%', md: '50%' },
        }}
      >
        {/* Title Section */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontSize: '1.1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </Typography>

          {/* Processed Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: 'pre-line',
              mb: 1,
              fontSize: '0.875rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {processedDescription}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ListingsCard;