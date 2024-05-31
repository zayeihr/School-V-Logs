// https://firebase.google.com/docs/analytics/user-properties?platform=web

import logo from '../logo.svg';
import '../App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState, useRef } from 'react';
import {db, auth, user} from '../firebase_config'
import { InputLabel, MenuItem, Select, TextField, Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';
import { DialogTitle, DialogActions, DialogContent, DialogContentText, Grid} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';


import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';



function AddUser(){
    

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPassRef = useRef(null);
    const nameRef = useRef(null);
    const companyRef = useRef(null);
    const apptRef = useRef(null);
    



    const handleRegister = async (event) =>{
        event.preventDefault();
        //Values of the fields
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const confirmPass = confirmPassRef.current.value;
        const name = nameRef.current.value;
        const company = companyRef.current.value;
        const appt = apptRef.current.value;
        const admin = false;


        // update to web version 9 whenever possibe: https://firebase.google.com/docs/auth/web/password-auth#web-version-9
        if (password == confirmPass){
            try {
                // Create user with email and password
                const newUser = await auth.createUserWithEmailAndPassword(email, password);
                console.log(newUser)
                // Create user document in Firestore using newly created UID
                await db.collection('users').doc(newUser.user.uid).set({
                  name,
                  company,
                  appt,
                  admin
                });
          
                
                console.log('User registered!');
                window.location.href = "/";
              } catch (error) {
                alert('Error registering user:', error)
                console.error('Error registering user:', error);
              }
            
          
        }
        else{
            alert("Passwords do not match!")
        }


        
        console.log(company)
    }


    return(
        <div>
            <h2>Register User</h2>
            <Box style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
            <form onSubmit={handleRegister} style={{maxWidth: "800px"}}>
            
                    <TextField
                        
                        margin="dense"
                        inputRef={emailRef}
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        required="true"
                    />
                    <TextField
                       
                        margin="dense"
                        inputRef={passwordRef}
                        name="reason"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        required="true"
                        
                    />
                    <TextField
                        
                        margin="dense"
                        inputRef={confirmPassRef}
                        name="reason"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        required="true"
                        
                    />
                    <TextField
                        
                        margin="dense"
                        inputRef={nameRef}
                        name="reason"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required="true"
                        
                    />
                    <TextField
                        labelId="company"
                        margin="dense"
                        label="Company"
                        inputRef={companyRef}
                        name="Company"
                        fullWidth
                        variant="outlined"
                        select
                        required="true"
                    >
                        <MenuItem value={"ATHENA"}>ATHENA</MenuItem>
                        <MenuItem value={"BISON"}>BISON</MenuItem>
                        <MenuItem value={"COYOTE"}>COYOTE</MenuItem>
                        <MenuItem value={"HQ"}>HQ</MenuItem>
                    </TextField>
                    <TextField
                        
                        margin="dense"
                        inputRef={apptRef}
                        name="reason"
                        label="Appointment (e.g ADMIN SPEC)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        required="true"
                        
                    />
                    
                    <br/><br/>
                    
                    <Button type="submit">Submit</Button>
                    
            </form>
            </Box>
        </div>
    )

}

export default AddUser