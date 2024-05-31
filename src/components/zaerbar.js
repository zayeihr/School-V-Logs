import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase_config';
import { useAuthState } from 'react-firebase-hooks/auth';

const style = {
  backgroundColor: '#7393B3', // Zaer, specify the background color here
};

export default function NavBar() {
  const [user] = useAuthState(auth);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={style}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0.1 }} sx={{ fontFamily: 'Raleway, sans-serif' }}>
            E-Indent App
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 99 }}>
    
          </Typography>
          <Box>
            <Button component={Link} to="/" color="inherit" sx={{ fontFamily: 'Raleway, sans-serif' }}>
              Borrow Items
            </Button>
            <Button component={Link} to="/add_item" color="inherit" sx={{ fontFamily: 'Raleway, sans-serif' }}>
              Add Item
            </Button>
            <Button component={Link} to="/loans" color="inherit" sx={{ fontFamily: 'Raleway, sans-serif' }}>
              Manage Loans
            </Button>
            <Button
              component={Link}
              to={user ? '/sign_out' : '/login'}
              color="inherit"
              sx={{ fontFamily: 'Raleway, sans-serif' }}
            >
              {user ? 'Sign Out' : 'Login'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
