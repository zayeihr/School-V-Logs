import logo from '../logo.svg';
import '../App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState, useRef } from 'react';
import {db, auth, user} from '../firebase_config'
import { TextField, Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';
import { DialogTitle, DialogActions, DialogContent, DialogContentText, Grid} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';


import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

function AccessDenied() {

    return(
        <div>
            <h1> Access Denied </h1>
            <h2> You are not allowed to access this page. Contact your administrator.</h2>
        </div>
    )
}

export default AccessDenied