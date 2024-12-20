import React from 'react';

const SearchHeader = () => {
  return (
    <div className="search-header" >
      <video className="video-bg" autoPlay loop muted>
        <source src={`${process.env.PUBLIC_URL}/videofile.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay"></div>

      <div className="container content">
        <h1 className="text-center mb-4">
          The best place to buy & Sell Boats and Boating<br /> Equipments.
        </h1>
        <div className="search-container">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search for anything"
          />
          <button className="btn btn-search">Search</button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
