import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import BuySellBoatsLayout from './pages/BuySellBoatsLayout';
import ListingDetails from 'components/ListingDetails';
import ProfileSettings from 'pages/ProfileSettings';
import MarinasListings from 'pages/MarinasListings';
import ScubaListings from 'pages/ScubaListings';
import WaterSportListings from 'pages/WaterSportListings';
import FishingToursListings from 'pages/FishingToursListings';
import BoatToursListings from 'pages/BoatToursListings';
import ProtectedRoute from './components/ProtectedRoute';
import ListingDetail from 'components/ListingDetail';
import RentalBoats from 'pages/RentalBoats';
import RentalBoatDetails from 'components/RentalBoatDetails';
import { HelmetProvider } from 'react-helmet-async';

// Create a theme instance
const theme = createTheme({
  // You can customize your theme here
  palette: {
    primary: {
      main: '#2c2c2c',
    },
    secondary: {
      main: '#19857b',
    },
  },
  // The breakpoints will now be properly defined
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/buysellboats" element={<BuySellBoatsLayout />} />
          <Route path="/listingdetails/:id" element={<ListingDetails />} />
          <Route path="/listings/:id" element={<ListingDetail />} />

          <Route path="/marinas" element={<MarinasListings />} />
          <Route path="/scubas" element={<ScubaListings />} />
          <Route path="/water-sport" element={<WaterSportListings />} />
          <Route path="/fishing-tour" element={<FishingToursListings />} />

          <Route path="/boat-tours" element={<BoatToursListings />} />
          <Route path="/rental-boats" element={<RentalBoats />} />
          <Route path="/boat/:id" element={<RentalBoatDetails />} />




          {/* Protected Routes */}
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile/:tab"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;