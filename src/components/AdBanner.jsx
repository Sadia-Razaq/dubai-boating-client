import React from 'react';

const AdBanner = ({ size = 'standard', image }) => {
  let width, height;

  switch (size) {
    case 'large':
      width = '100%';
      height = '120px';
      break;
    case 'medium':
      width = '100%';
      height = '90px';
      break;
    default: // standard
      width = '468px';
      height = '60px';
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        margin: '10px 0',
      }}
    >
      <div
        style={{
          width,
          height,
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {image ? (
          <img
            src={image}
            alt="ad banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span
            style={{
              fontSize: size === 'large' ? '36px' : '24px',
              fontWeight: 'bold',
              color: '#ff0000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            ad banner
          </span>
        )}
      </div>
    </div>
  );
};

export default AdBanner;
