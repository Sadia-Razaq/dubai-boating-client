import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import SearchHeader from '../components/SearchHeader';
import PopularCategories from '../components/PopularCategories';
import Card from '../components/Card';
import Footer from '../components/Footer';
import AdBanner from 'components/AdBanner';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [saleBoats, setSaleBoats] = useState([]);
  const [rentalBoats, setRentalBoats] = useState([]);
  const [waterSportsListings, setWaterSportsListings] = useState([]);
  const [fishingListings, setFishingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch sale boats
        const saleBoatsResponse = await axios.get('https://api.dubaiboating.com/public/api/boats', {
          params: {
            type: 'sale',
            page: 1,
            per_page: 4
          }
        });

        // Fetch rental boats
        const rentalBoatsResponse = await axios.get('https://api.dubaiboating.com/public/api/boats', {
          params: {
            type: 'rental',
            page: 1,
            per_page: 4
          }
        });

        // Extract data from API response
        const saleBoatsData = saleBoatsResponse.data.data || [];
        const rentalBoatsData = rentalBoatsResponse.data.data || [];

        setSaleBoats(saleBoatsData);
        setRentalBoats(rentalBoatsData);

        // Fetch listings (assuming this endpoint remains the same)
        const listingsResponse = await axios.get('https://api.dubaiboating.com/public/api/listings');
        const listings = listingsResponse.data.listings || [];

        // Filter and limit Water Sports and Fishing listings
        const waterSports = listings
          .filter(listing => listing.type === 'WaterSport')
          .slice(0, 4);

        const fishingTours = listings
          .filter(listing => listing.type === 'FishingTour')
          .slice(0, 4);

        setWaterSportsListings(waterSports);
        setFishingListings(fishingTours);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    return `https://api.dubaiboating.com/storage/app/${imagePath}`;
  };

  // Helper function to get primary image URL for boats
  const getPrimaryImageUrl = (images) => {
    const primaryImage = images.find(img => img.is_primary === 1);
    return primaryImage 
      ? `https://api.dubaiboating.com/storage/app/public/${primaryImage.image_url}` 
      : 'default-boat-image.jpg';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <Helmet>
        <title>Luxury Yachts and Water Sports | Home</title>
        <meta name="description" content="Explore our range of luxury yachts for sale and rent, deep-sea fishing adventures, and exciting water sports activities." />
        <meta name="keywords" content="Luxury yachts, Dubai yachts, water sports, deep-sea fishing, jet skiing, boat rentals" />
      </Helmet>
      <Header />
      <main className="main-content container mt-2">
        <div className='container'>
          <SearchHeader />
        </div>

        <div>
          <PopularCategories />
        </div>

        {/* Buy & Sell Boats Section */}
        <div className="buy-sell-section container">
          <h2 className="section-heading">Buy & Sell Boats</h2>
          <div className="cards-container">
            {saleBoats.map((boat) => (
              <Card
                key={boat.id}
                image={getPrimaryImageUrl(boat.images)}
                title={boat.title}
                location={boat.location}
                price={`$${parseFloat(boat.price).toLocaleString()}`}
              />
            ))}
          </div>
        </div>

        {/* Fishing Section */}
        <div className="buy-sell-section container">
          <h2 className="section-heading">Fishing Tours</h2>
          <div className="cards-container">
            {fishingListings.map((listing) => (
              <Card
                key={listing.id}
                image={getImageUrl(listing.image)}
                title={listing.title}
              />
            ))}
          </div>
        </div>

        {/* Boat Rentals Section */}
        <div className="buy-sell-section container">
          <h2 className="section-heading">Boat Rentals</h2>
          <div className="cards-container">
            {rentalBoats.map((boat) => (
              <Card
                key={boat.id}
                image={getPrimaryImageUrl(boat.images)}
                title={boat.title}
                location={boat.location}
                price={`$${parseFloat(boat.price).toLocaleString()}`}
              />
            ))}
          </div>
        </div>

        {/* Water Sports Section */}
        <div className="buy-sell-section container">
          <h2 className="section-heading">Water Sports</h2>
          <div className="cards-container">
            {waterSportsListings.map((listing) => (
              <Card
                key={listing.id}
                image={getImageUrl(listing.image)}
                title={listing.title}
              />
            ))}
          </div>
        </div>

        <AdBanner size="large" image="https://media.istockphoto.com/id/1212816534/photo/luxurious-motor-boat.jpg?s=612x612&w=0&k=20&c=gMQmBcZAeLO8R2-wPW9jNuFQyIr4vyqrjAO6xnowqlA=" />
      </main>

      <Footer />
    </div>
  );
};

export default Home;