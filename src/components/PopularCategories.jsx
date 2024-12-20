import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const PopularCategories = () => {


  const [latestListings, setLatestListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestListings();
  }, []);

  const fetchLatestListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://api.dubaiboating.com/public/api/listings');
      const marinasListings = response.data.listings
        .filter(listing => listing.type === "Marinas")
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 4);
      setLatestListings(marinasListings);
    } catch (err) {
      console.error('Error fetching latest listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleListingClick = (e, listingId) => {
    e.preventDefault();
    navigate(`/listings/${listingId}`);
  };


  return (
    <div className="popular-categories">
      <h2 className='popular-cat' style={{fontWeight:'bold', marginBottom:'30px'}}>Popular Boats Categories</h2>
      <div className="row ">
      <div className="col-md-6 mb-2">
  <Link to="/buysellboats" className="category-link" style={{ textDecoration: 'none' }}>
    <div className="category large" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/buy-boats.webp)` }}>
      <span className="category-name">Buy & Sell Boats</span>
      <div className="category-dropdown">
        <a href="#" className="dropdown-item">- View Boats</a>
        <a href="#" className="dropdown-item">- Sell your boat</a>
      </div>
    </div>
  </Link>
</div>
         <div className="col-md-6 mb-2">
         <Link to="/rental-boats" className="category-link" style={{ textDecoration: 'none' }}>

          <div className="category large"  style={{backgroundImage: `url(${process.env.PUBLIC_URL}/rental-boats.webp)`}}>
            <span className="category-name">Rental Boats</span>
            <div className="category-dropdown">
              <a href="#" className="dropdown-item">- View rentals</a>
              <a href="#" className="dropdown-item">- Pricing Guide</a>
            </div>
          </div>
          </Link>
        </div>
        <div className="col-md-6 col-xl-3 mb-2">
      <Link to="/marinas" className="category-link" style={{ textDecoration: 'none' }}>
        <div 
          className="category small" 
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/marinas.webp)`,
            cursor: 'pointer'
          }}
        >
          <span className="category-name">Marinas</span>
          <div className="category-dropdown" >
            <span className="dropdown-item" style={{ fontWeight: '480' }}>Find Marinas:</span>
            {loading ? (
              <span className="dropdown-item" style={{ fontWeight: '480' }}>Loading...</span>
            ) : (
              <>
                {latestListings.map((listing) => (
                  <a
                    key={listing.id}
                    href="#"
                    className="dropdown-item"
                    onClick={(e) => handleListingClick(e, listing.id)}
                  >
                    - {listing.title}
                  </a>
                ))}
                <Link to="/marinas" className="dropdown-item">
                  - More
                </Link>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
        <div className="col-md-6 col-xl-3 mb-2">
        <Link to = "/fishing-tour" className="category-link" style={{ textDecoration: 'none' }}>

          <div className="category small" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/fishing.webp)`}}>
            <span className="category-name">Fishing</span>
            <div className="category-dropdown">
              <a href="#" className="dropdown-item">- Fishing Tours</a>
            </div>
          </div>
          </Link>

        </div>

        <div className="col-md-6 col-xl-3 mb-2">
        <Link to = "/water-sport" className="category-link" style={{ textDecoration: 'none' }}>

          <div className="category small" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/water-sports.webp)`}}>
            <span className="category-name">Water Sports</span>
            <div className="category-dropdown">
              <a href="#" className="dropdown-item">Activities:</a>
              <a href="#" className="dropdown-item">- Parasailing</a>
              <a href="#" className="dropdown-item">- Kayaking</a>
              <a href="#" className="dropdown-item">- Water Jet</a>



            </div>
          </div>
          </Link>
        </div>
        <div className="col-md-6 col-xl-3 mb-2">
         <Link to = "/boat-tours" className="category-link" style={{ textDecoration: 'none' }}>
          <div className="category small" style={{backgroundImage: `url(${process.env.PUBLIC_URL}/boat-tours.webp)`}}>
            <span className="category-name">Boat Tours</span>
            <div className="category-dropdown">
              <a href="#" className="dropdown-item">- Book a Tour</a>
              <a href="#" className="dropdown-item">- Dhow Cruise</a>
            </div>
          </div>
         </Link>
        </div>
        <div className="col-md-6 mb-2">
        <Link to = "/scubas" className="category-link" style={{ textDecoration: 'none' }}>
          <div className="category large"  style={{backgroundImage: `url(${process.env.PUBLIC_URL}/scuba.jpg)`}}>
            <span className="category-name">Scuba Section</span>
            <div className="category-dropdown">
              <a href="#" className="dropdown-item">- Rentals</a>
              <a href="#" className="dropdown-item">- Courses</a>
              <a href="#" className="dropdown-item">- Equipment</a>
            </div>
          </div>
          </Link>
        </div>
        <div className="col-md-6 mb-2">
        <Link to="https://burjmall.com" className="nav-link">
        <div className="category large"  style={{backgroundImage: `url(${process.env.PUBLIC_URL}/fishing-equipment.jpg)`}}>
            <span className="category-name">Fishing Equipment Sales</span>
            <Link to="https://burjmall.com" className="nav-link">
            <div className="category-dropdown">
            <Link to="https://burjmall.com" className="nav-link"><a  className="dropdown-item">- Lures</a></Link>
            <Link to="https://burjmall.com" className="nav-link"> <a  className="dropdown-item">- Lines</a></Link>
            <Link to="https://burjmall.com" className="nav-link"> <a className="dropdown-item">- Bait</a></Link>

            </div>
            </Link>
          </div>
        </Link>
          
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;