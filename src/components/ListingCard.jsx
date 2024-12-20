import React from 'react';

const ListingCard = ({ title, category, subcategory, price, age, length, location, imageUrl }) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <button className="absolute top-2 right-2 p-1 bg-white rounded-full">
          <span role="img" aria-label="heart">❤️</span>
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">PREMIUM</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{category} • {subcategory}</p>
        <p className="text-2xl font-bold mb-2">AED {price.toLocaleString()}</p>
        <div className="flex text-sm text-gray-600 mb-2">
          <span className="mr-4">Age: {age}</span>
          <span>Length: {length}</span>
        </div>
      </div>
      <div className="bg-gray-100 p-2 flex items-center">
        <span role="img" aria-label="location" className="mr-1">📍</span>
        <span className="text-sm text-gray-600">{location}</span>
      </div>
    </div>
  );
};

export default ListingCard;