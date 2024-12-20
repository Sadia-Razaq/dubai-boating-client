import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import BoatCard from "components/BoatCard";
import Header from "components/Header";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";

const BuySellBoatsLayout = () => {
  const [filters, setFilters] = useState({
    city: "Dubai",
    category: "All in Boats",
    priceRange: { min: "", max: "" },
    sellerType: "",
    warranty: "",
    otherFilters: "",
  });
  const [openFilter, setOpenFilter] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [boatListings, setBoatListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoatListings();
  }, [filters]);

  const fetchBoatListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://api.dubaiboating.com/public/api/boats",
        {
          params: {
            type: "sale", // Existing sale filter in API request
            ...(filters.city !== "Dubai" && { city: filters.city }),
            ...(filters.category !== "All in Boats" && {
              category: filters.category,
            }),
            ...(filters.priceRange.min && {
              min_price: filters.priceRange.min,
            }),
            ...(filters.priceRange.max && {
              max_price: filters.priceRange.max,
            }),
            ...(filters.sellerType && { seller_type: filters.sellerType }),
            ...(filters.warranty && { warranty: filters.warranty }),
          },
        }
      );
  
      // Add defensive checks and filter to ensure only sale boats
      const boats = (response.data.data || response.data || [])
        .filter(boat => boat.type === "sale");
  
      setBoatListings(boats);
      setError(null);
    } catch (err) {
      console.error("Error fetching boat listings:", err);
      setError("Failed to fetch boat listings. Please try again later.");
  
      // Ensure boatListings is an empty array in case of error
      setBoatListings([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { label: "City", value: filters.city, placeholder: "Select" },
    { label: "Category", value: filters.category, placeholder: "Search" },
    {
      label: "Price (AED)",
      value:
        filters.priceRange.min || filters.priceRange.max
          ? `${filters.priceRange.min || 0} - ${
              filters.priceRange.max || "Any"
            }`
          : "",
      placeholder: "Select",
    },
    { label: "Seller Type", value: filters.sellerType, placeholder: "Select" },
    { label: "Warranty", value: filters.warranty, placeholder: "Select" },
    {
      label: "Filters",
      value: filters.otherFilters,
      placeholder: "Ads Posted",
      last: true,
    },
  ];

  const cities = [
    "Dubai",
    "All Cities",
    "Abu Dhabi",
    "Ras Al Khaimah",
    "Sharjah",
    "Fujairah",
    "Ajman",
    "Umm Al Quwain",
    "Al Ain",
  ];

  const categories = [
    "All in Boats",
    "Motorboats",
    "Row/Paddle Boats",
    "Sailboats",
  ];

  const handleFilterClick = (filterLabel) => {
    setOpenFilter(openFilter === filterLabel ? null : filterLabel);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setOpenFilter(null);
  };

  const handlePriceChange = (type, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: {
        ...prevFilters.priceRange,
        [type]: value,
      },
    }));
  };

  const handleApplyPriceFilter = () => {
    setOpenFilter(null);
  };

  const handleClearPriceFilter = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      priceRange: { min: "", max: "" },
    }));
  };

  return (
    <>
      <Helmet>
        <title>Explore Boats for Sale and Filter Options</title>
        <meta
          name="description"
          content="Browse a variety of boats available for sale with options to filter by city, category, and price. Discover the perfect boat for your needs and enjoy an enhanced browsing experience with tailored filtering options."
        />
        <meta
          name="keywords"
          content="boats for sale, boat listings, boat filters, city filter, category filter, price range, find boats"
        />
        <meta
          property="og:title"
          content="Explore Boats for Sale with Customizable Filters"
        />
        <meta
          property="og:description"
          content="Explore and filter boats for sale by city, category, and price. Customize your search to find the ideal boat with ease."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://yourwebsite.com/boat-listings"
        />
        <meta
          property="og:image"
          content="https://yourwebsite.com/assets/images/boat-listing-og-image.jpg"
        />
        <meta
          name="twitter:title"
          content="Explore Boats for Sale with Custom Filters"
        />
        <meta
          name="twitter:description"
          content="Browse boats for sale with filters for city, category, and price range. Find the perfect boat quickly and easily."
        />
        <meta
          name="twitter:image"
          content="https://yourwebsite.com/assets/images/boat-listing-twitter-image.jpg"
        />
      </Helmet>

      <Header />
      <Container
        maxWidth="false"
        sx={{
          maxWidth: "1440px",
          px: { xs: 2, md: 4 },
          mx: "auto",
        }}
      >
        <Box sx={{ my: 4 }}>
          {/* Filters Bar - Full Width */}
          {isDesktop && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                borderRadius: "30px",
                border: "1px solid #e0e0e0",
                mb: 10,
                overflow: "visible",
                backgroundColor: "white",
                position: "relative",
              }}
            >
              {filterOptions.map((filter) => (
                <Box
                  key={filter.label}
                  sx={{
                    flex: filter.last ? 0 : 1,
                    minWidth: filter.last ? 200 : "auto",
                    borderRight: filter.last ? "none" : "1px solid #e0e0e0",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFilterClick(filter.label)}
                >
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      padding: "12px 16px",
                      textTransform: "none",
                      color: "text.primary",
                      height: "100%",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%", textAlign: "left" }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: "14px",
                          mb: 0.5,
                        }}
                      >
                        {filter.label}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            fontSize: "14px",
                            fontWeight: "normal",
                          }}
                        >
                          {filter.value || filter.placeholder}
                        </Typography>
                        <img
                          src="https://static.dubizzle.com/frontend-web/listings/assets/images/iconDown.svg"
                          alt="toggle"
                          style={{
                            width: 12,
                            height: 12,
                            transform:
                              openFilter === filter.label
                                ? "rotate(180deg)"
                                : "none",
                            transition: "transform 0.2s ease-in-out",
                          }}
                        />
                      </Box>
                    </Box>
                  </Button>

                  {/* City Dropdown */}
                  {openFilter === "City" && filter.label === "City" && (
                    <Box
                      className="city dropDownPopover"
                      data-testid="city-bottomsheet"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 1000,
                        minWidth: 300,
                        maxWidth: 600,
                        backgroundColor: "white",
                        borderRadius: "8px 8px 0px 0px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        mt: 1,
                        transition: "transform 0.25s",
                        height: "inherit",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        overflow: "hidden",
                      }}
                    >
                      <form name="city" autoComplete="off" noValidate>
                        <Box
                          className="dropDownContentHolder"
                          sx={{ p: 3, flex: 1, overflowY: "auto" }}
                        >
                          <Box sx={{ mb: 2 }}>
                            <Box className="tagWrapper">
                              <Box
                                className="tagList city motors no-seo-link"
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {cities.map((city) => (
                                  <Box
                                    key={city}
                                    className="tagContainer"
                                    type="large"
                                    sx={{ display: "inline-flex" }}
                                  >
                                    <Box
                                      className="contentContainer"
                                      data-testid={`city-${city
                                        .toLowerCase()
                                        .replace(/ /g, "-")}`}
                                      type="large"
                                      onClick={() =>
                                        handleFilterChange("city", city)
                                      }
                                      sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        border: "1px solid",
                                        borderColor:
                                          city === filters.city
                                            ? "primary.main"
                                            : "grey.300",
                                        backgroundColor:
                                          city === filters.city
                                            ? "primary.main"
                                            : "transparent",
                                        "&:hover": {
                                          backgroundColor:
                                            city === filters.city
                                              ? "primary.dark"
                                              : "grey.100",
                                        },
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          color:
                                            city === filters.city
                                              ? "white"
                                              : "text.primary",
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {city}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        <Box
                          className="dropDownButtonsRow"
                          sx={{
                            p: 2,
                            borderTop: "1px solid",
                            borderColor: "grey.200",
                          }}
                        >
                          <Button
                            className="filter applyButton"
                            fullWidth
                            type="submit"
                            data-testid="submit"
                            onClick={() => setOpenFilter(null)}
                            sx={{
                              backgroundColor: "#2c2c2c",
                              color: "white",
                              textTransform: "none",
                              py: 1.5,
                              "&:hover": {
                                backgroundColor: "#1a1a1a",
                              },
                            }}
                          >
                            Apply Filters
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  )}

                  {/* Category Dropdown */}
                  {openFilter === "Category" && filter.label === "Category" && (
                    <Box
                      className="category dropDownPopover"
                      data-testid="category-bottomsheet"
                      sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        zIndex: 1000,
                        minWidth: "240px",
                        height: " max-content",
                        backgroundColor: "#fff",
                        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                        mt: 0.5,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: "10px",
                          left: 0,
                          right: 0,
                          borderRadius: "10px",
                          bottom: 0,
                          background: "#fff !important",
                          zIndex: -1,
                        },
                        ".MuiBox-root": {
                          backgroundColor: "#fff",
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <Box
                          key={category}
                          onClick={() =>
                            handleFilterChange("category", category)
                          }
                          sx={{
                            py: 1.5,
                            px: 2,
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#2C2C2C",
                              fontWeight:
                                category === filters.category ? 600 : 400,
                            }}
                          >
                            {category}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Price Range Dropdown */}
                  {openFilter === "Price (AED)" &&
                    filter.label === "Price (AED)" && (
                      <Box
                        className="price dropDownPopover"
                        data-testid="price-bottomsheet"
                        sx={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          zIndex: 1000,
                          minWidth: "300px",
                          backgroundColor: "#fff",
                          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08)",
                          mt: 0.5,
                          borderRadius: "8px",
                          padding: "16px",
                        }}
                      >
                        <form name="price" autoComplete="off" noValidate>
                          <Box sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                              }}
                            >
                              <Box sx={{ width: "48%" }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  From
                                </Typography>
                                <TextField
                                  fullWidth
                                  placeholder="0"
                                  value={filters.priceRange.min}
                                  onChange={(e) =>
                                    handlePriceChange("min", e.target.value)
                                  }
                                  inputProps={{
                                    "data-testid": "min-input-price",
                                  }}
                                />
                              </Box>
                              <Box sx={{ width: "48%" }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  Upto
                                </Typography>
                                <TextField
                                  fullWidth
                                  placeholder="Any"
                                  value={filters.priceRange.max}
                                  onChange={(e) =>
                                    handlePriceChange("max", e.target.value)
                                  }
                                  inputProps={{
                                    "data-testid": "max-input-price",
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 2,
                            }}
                          >
                            <Button
                              onClick={handleClearPriceFilter}
                              sx={{
                                color: "text.secondary",
                                textTransform: "none",
                              }}
                              data-testid="reset"
                            >
                              Clear
                            </Button>
                            <Button
                              onClick={handleApplyPriceFilter}
                              variant="contained"
                              sx={{
                                backgroundColor: "#2c2c2c",
                                color: "white",
                                "&:hover": { backgroundColor: "#1a1a1a" },
                              }}
                              data-testid="submit"
                            >
                              Apply Filters
                            </Button>
                          </Box>
                        </form>
                      </Box>
                    )}
                </Box>
              ))}
            </Box>
          )}

          <Container
            maxWidth="false"
            sx={{
              maxWidth: "1440px",
              px: { xs: 2, md: 4 },
              mx: "auto",
            }}
          >
            <Box sx={{ my: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                {/* Boat Listings */}

                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                  }}
                >
                  {loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Box
                      sx={{ textAlign: "center", py: 4, color: "error.main" }}
                    >
                      <Typography>{error}</Typography>
                    </Box>
                  ) : boatListings && boatListings.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography>
                        No boats found matching your criteria.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={{ xs: 2, sm: 3 }}>
                        {boatListings.map((boat) => (
                          <Grid item xs={12} key={boat.id}>
                            <BoatCard
                              id={boat.id}
                              title={boat.title}
                              price={boat.price}
                              year={boat.year}
                              length={boat.length}
                              location={boat.location}
                              images={boat.images || []}
                              boat_condition={boat.boat_condition}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Box>

                {/* Sidebar Advertisement - Only show on desktop */}
                {!isMobile && !isTablet && (
                  <Box
                    sx={{
                      width: "350px",
                      flexShrink: 0,
                      height: "fit-content",
                      position: "sticky",
                      top: 24,
                      display: { xs: "none", md: "block" },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "600px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src="https://tpc.googlesyndication.com/simgad/17768704824446043541"
                        alt="Advertisement"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Container>
        </Box>
      </Container>
    </>
  );
};

export default BuySellBoatsLayout;
