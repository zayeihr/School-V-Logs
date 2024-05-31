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



function ItemsTable() {
    
    
    // State for item data pulled from firestore
    const [data, setData] = useState([]);
    //Code for Modal States
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpenModal = (item) => {
        setSelectedItem(item);
    };
    const handleCloseModal = () => {
        setSelectedItem(null);
        setDate(null);
        
    };
    const handleRowClick = (params) => {
        handleOpenModal(params.row);
      };
    
    //Style for the Modal Box
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };
    
  

    //Columns for Data Table (DataGrid)
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'quantity', headerName: 'Quantity', width: 150 },
        { field: 'category', headerName: 'Category', width: 200 },
        { field: 'location', headerName: 'Location', width: 200 },
        {field: 'on_loan', headerName: 'Qty on Loan', width: 150},
        // {
        //   field: 'actions',
        //   headerName: 'Actions',
        //   width: 150,
        //   renderCell: (params) => (
        //     <Button
        //       variant="contained"
        //       color="primary"
        //       startIcon={<InfoIcon />}
        //       onClick={() => handleOpenModal(params.row)}
        //     >
        //       Details
        //     </Button>
        //   ),
        // },
      ];

    //Get ALL documents from 'items' collection
    useEffect(() => {
      // Get all documents from the 'items' collection
      db.collection('items')
        .get()
        .then((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setData(items);
        });
    }, []);

    //Refs for borrowing items
    const nameRef = useRef(null);
    const qtyRef = useRef(null);
    const reasonRef = useRef(null);
    const uidRef = useRef(null);
    const itemIdRef = useRef(null);
    //Date Time state to handle time picker
    const [borrowDate, setDate] = React.useState(null);

    //Borrow Items Function
    const handleItemBorrow = async (event) =>{
      event.preventDefault(); //Stop page from reloading
      //Get values from ref
      const name = nameRef.current.value;
      const qty = qtyRef.current.value;
      const reason = reasonRef.current.value;
      const requester_uid = uidRef.current.value;
      const itemId = itemIdRef.current.value;

      //Convert "Required By" date to JS Date object
      const rawDate = borrowDate.$d;
      const d1 = new Date(rawDate);
      console.log(qty);
      console.log(reason);
      console.log(name);
      console.log(d1);
      //convert timestamp to firestore server format
      const firebaseTimestamp = firebase.firestore.Timestamp.fromDate(d1);
      console.log(firebaseTimestamp)

      //Get Name and Company from user database
      var requesterUserRef = await db.collection('users').doc(auth.currentUser.uid);
      var requesterUser
      await requesterUserRef.get().then((doc) => {
        if (doc.exists) {
           requesterUser = doc.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        } 
      })
      var requesterName = requesterUser.name
      var requesterCompany = requesterUser.company
      console.log(auth.currentUser.uid)
      console.log(requesterUser);
      console.log(requesterUser.company)

      db.collection('on_loan')
        .add({
          name: name,
          item_id: itemId,
          quantity: parseInt(qty),
          reason: reason,
          requester_name: requesterName,
          requester_company: requesterCompany,
          requester_uid: requester_uid,
          approver_uid:"",
          date_required: firebaseTimestamp,
          request_created: firebase.firestore.Timestamp.fromDate(new Date()),
          loan_approved: false
        })
        .then(() => {
          console.log('Loan Request Submitted!');
        })
        .catch((error) => {
          console.error('Error adding item: ', error);
        });


      handleCloseModal();

    }

    

    return (
        <div>
            <h2> All Items </h2>
            <Box style={{display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px', height: '75vh'}}>
                <div style={{ height: '100%', width: '90%'}} >
                    <DataGrid onRowClick={handleRowClick}
                        rows={data || []}
                        columns={columns}
                    /> 
                </div>
            </Box>

            {/* Dialog/Modal, opens up loan request screen */}
            <Dialog open={!!selectedItem} onClose={handleCloseModal} fullWidth width="m">
                {selectedItem && (
                    <div>
                <DialogTitle>Borrowing {selectedItem.name}</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Category: {selectedItem.category}
                    <br/>
                    Quantity Available: {selectedItem.quantity - selectedItem.on_loan}
                    <br />
                    
                </DialogContentText>
                <form onSubmit={handleItemBorrow}>
                  <TextField
                      autoFocus
                      margin="dense"
                      inputRef={qtyRef}
                      label="Quantity to Borrow"
                      type="number"
                      fullWidth
                      variant="outlined"
                      required="true"
                      InputProps={{ inputProps: { min: 1, max: selectedItem.quantity - selectedItem.on_loan } }}
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      inputRef={reasonRef}
                      name="reason"
                      label="Reason for Borrowing"
                      type="text"
                      fullWidth
                      variant="outlined"
                      required="true"
                      
                  />
                  <input type="hidden" ref={nameRef} name="name" value={selectedItem.name}/>
                  <input type="hidden" ref={uidRef} name="uid" value={auth.currentUser.uid}/>
                  <input type="hidden" ref={itemIdRef} name="item_id" value={selectedItem.id}/>
                  <br/><br/>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        name="date"
                        label="Date Required By" 
                        value={borrowDate}
                        onChange={(newValue) => setDate(newValue)}
                      />              
                  </LocalizationProvider>
                  <DialogActions>
                  <Button type="submit">Submit</Button>
                  </DialogActions> 
                </form>
                </DialogContent>
                </div>)}
            </Dialog>
            
        </div>
    );
    
  }

export default ItemsTable