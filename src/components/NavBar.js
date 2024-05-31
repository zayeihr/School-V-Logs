import * as React from 'react';
import { useState } from 'react'; // Import useState
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase_config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Add, ListAlt, ExitToApp } from '@mui/icons-material';

export default function NavBar(userData) {
  const [user] = useAuthState(auth);
  const style = {
    backgroundColor: '#7393B3', // Specify the background color here
  };

  // Step 1: Define a state variable to control the drawer open/close state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Step 2: Create a function to toggle the drawer state
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={style}>
        <Toolbar>
          {/* Step 3: Add onClick event to the IconButton */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer} // Call the function when the button is clicked
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ fontFamily: 'Raleway, sans-serif' }}>
            E-Indent App
          </Typography>
          {/* Your other buttons here */}
        </Toolbar>
      </AppBar>

      {/* Step 4: Render the Drawer component based on the state */}
      <Drawer open={isDrawerOpen} onClose={toggleDrawer}
           anchor='left'
           >
        <Box p={2} width = '250px' textAlign='central' role='presentation' >
          <Typography variant ='h6' component='div'>
            BMTC School V E-Indent App
          </Typography>
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Borrow Items" />
            </ListItem>
            <ListItem button component={Link} to="/add_item" onClick={toggleDrawer}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Item" />
            </ListItem>
            <ListItem button component={Link} to="/loans" onClick={toggleDrawer}>
              <ListItemIcon>
                <ListAlt />
              </ListItemIcon>
              <ListItemText primary="Manage Loans" />
            </ListItem>
            <ListItem button component={Link} to={user ? '/sign_out' : '/login'} onClick={toggleDrawer}>
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}

