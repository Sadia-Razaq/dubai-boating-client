import React from 'react';

const Card = ({ image, title, location, price }) => {
  // Function to truncate description or title
  const truncate = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text;
  };

  return (
    <div className="card relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="card-image-container h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="card-image w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="card-content p-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {truncate(title, 25)}
        </h3>
        
        {location && (
          <div className="text-sm text-gray-500 mb-1">
            <i className="mr-1">📍</i>
            {truncate(location, 20)}
          </div>
        )}
        
        {price && (
          <div className="card-price text-blue-600 font-bold">
            {price}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;