import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider,
  Paper,
  Container,
  ListItemIcon,
  Collapse
} from '@mui/material';
import Header from 'components/Header';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandLess from '@mui/icons-material/ExpandMore';
import ExpandMore from '@mui/icons-material/ExpandLess';
import NewAd from 'components/NewAd';
import MyProfile from 'components/MyProfile';
import Footer from 'components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import UserAds from 'components/UserAds';
import PhoneManagement from 'components/PhoneManagement';
import NewRentalBoat from 'components/NewRentalBoat';
import { FaSailboat } from "react-icons/fa6";
import { LuSailboat } from "react-icons/lu";


const ProfileSettings = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (tab) {
      const validTabs = ['profile', 'placeAd', 'myAds'];
      if (validTabs.includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [tab]);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    navigate(`/my-profile/${tabValue}`);
  };

  const handleAccountClick = () => {
    setAccountOpen(!accountOpen);
  };

  const sidebarLinks = [
    { label: 'Profile', value: 'profile', icon: <PersonIcon /> },
    { 
      label: 'Account', 
      value: 'account', 
      icon: <AccountCircleIcon />,
      subItems: [
        { label: 'Phone number', value: 'phone', icon: <PhoneIcon /> }
      ]
    },
    { label: 'Place your Ad', value: 'placeAd', icon: <FaSailboat size={22} />    },
    { label: 'Place Rental Ad', value: 'rentalAd', icon: <LuSailboat  size={22} />    },
    { label: 'My Ads', value: 'myAds', icon: <LockIcon /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <MyProfile />;
      case 'placeAd':
        return <NewAd />;
        case 'rentalAd':
          return <NewRentalBoat />;
      case 'myAds':
        return <UserAds />;
      case 'phone':
        return <PhoneManagement />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header LoggedIn={true} />
      <Container maxWidth="lg" style={{ marginTop: '30px' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#4a4a4a', fontWeight: 'bold' }}>
          Profile Settings
        </Typography>
        <Box display="flex" mt={3}>
          <Paper style={{ width: '250px', marginRight: '30px', height: 'fit-content' }}>
            <List component="nav">
              {sidebarLinks.map((link) => (
                <React.Fragment key={link.value}>
                  <ListItem 
                    button 
                    selected={activeTab === link.value}
                    onClick={link.subItems ? handleAccountClick : () => handleTabChange(link.value)}
                    style={{ 
                      borderLeft: activeTab === link.value ? '4px solid #d32f2f' : 'none',
                      backgroundColor: activeTab === link.value ? '#f5f5f5' : 'transparent',
                      paddingLeft: activeTab === link.value ? '12px' : '16px'
                    }}
                  >
                    <ListItemIcon style={{ 
                      color: activeTab === link.value ? '#d32f2f' : 'inherit', 
                      minWidth: '40px' 
                    }}>
                      {link.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={link.label} 
                      primaryTypographyProps={{ 
                        style: { 
                          fontWeight: activeTab === link.value ? 'bold' : 'normal',
                          color: activeTab === link.value ? '#d32f2f' : 'inherit'
                        } 
                      }}
                    />
                    {link.subItems && (accountOpen ? <ExpandLess /> : <ExpandMore />)}
                  </ListItem>
                  
                  {link.subItems && (
                    <Collapse in={accountOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {link.subItems.map((subItem) => (
                          <ListItem 
                            key={subItem.value}
                            button 
                            selected={activeTab === subItem.value}
                            onClick={() => handleTabChange(subItem.value)}
                            style={{ 
                              paddingLeft: '32px',
                              borderLeft: activeTab === subItem.value ? '4px solid #d32f2f' : 'none',
                              backgroundColor: activeTab === subItem.value ? '#f5f5f5' : 'transparent'
                            }}
                          >
                            <ListItemIcon style={{ 
                              color: activeTab === subItem.value ? '#d32f2f' : 'inherit',
                              minWidth: '40px'
                            }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.label}
                              primaryTypographyProps={{ 
                                style: { 
                                  fontWeight: activeTab === subItem.value ? 'bold' : 'normal',
                                  color: activeTab === subItem.value ? '#d32f2f' : 'inherit'
                                } 
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
          <Box flex={1} style={{ backgroundColor: '#fff', borderRadius: '4px' }}>
            {renderContent()}
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default ProfileSettings;