import logo from '../logo.svg';
//import '../App.css';

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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { doc, deleteDoc, getDoc } from "firebase/firestore";


import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

function Returns(){
    
    //States to 
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpenModal = (item) => {
        setSelectedItem(item);
    };
    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    
    //State to hold data for loan data queried from firestore
    const [loanData, setLoanData] = useState([]);

    //Retrieve all items currently on loan 
    const getAllLoans = () => {
        db.collection('on_loan').orderBy("date_required")
          .get()
          .then((querySnapshot) => {
            const on_loan = [];
            querySnapshot.forEach((doc) => {
              on_loan.push({ id: doc.id, ...doc.data() });
            });
            setLoanData(on_loan);
          });
      }


    //Get ALL documents from 'on_loan' collection, retrieves all loan requests (only calls one time per page)
    useEffect(() => {
        getAllLoans();
      }, []);
    //console.log(loanData[0].loan_approved)
    //Render readable timestamps
    const renderReadableTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toDateString(); // Use the toLocaleString method to convert timestamp to a readable format
      };



    const returnItem = async () =>{
        //test if the state still works (we wil use this to send data to server!)
        console.log(selectedItem);
        
        /* 1. Get data of selected item
        2. Decrement the on_loan quantity in the items table by loaned number
        3. Delete the loan data (or move it to a historical table? Decide this later)
         */
        //Declare this to confirm that the item exists before updating on-loan quantity
        var onLoanDocRef = db.collection('on_loan').doc(selectedItem.id)
        //Update the item in the "Items" table by decrementing the "on_loan" value by the value requested
        var loanItemRef = db.collection('items').doc(selectedItem.item_id)
        
        //check if the on_loan document exists
        const onLoanDocSnap = await getDoc(onLoanDocRef);
        
        if (onLoanDocSnap.exists()) {
        loanItemRef.update({
            on_loan: firebase.firestore.FieldValue.increment(-selectedItem.quantity)
        }) }
        else {
            console.log("Item Does Not Exist")
        }
    
        
        //take ID of loan item and delete it
        var onLoanDocRef = db.collection('on_loan').doc(selectedItem.id)
        
        //delete the loan
        await deleteDoc(doc(db, 'on_loan', selectedItem.id));

        //reload the page
        //window.location.reload();
        
        //refresh the items on the page
        getAllLoans();
        

        handleCloseModal();
    }


    // TODO: add tab system to separate approved requests from pending requests
    console.log(loanData)
    return(
        <div>
            <h1>Manage Returning Loans</h1>
            {loanData.map((item, index) =>(
                
                <div style={{ width: '70%', margin:'auto', paddingBottom:'30px'}}>
                    { item.requester_uid === auth.currentUser.uid ?
                    <Box sx={{alignContent:'left', borderRadius: '16px', boxShadow: 3, paddingTop:'1px', paddingBottom:'5px' }} >
                        <h3>Item: {item.name}</h3>
                        Quantity Requested: {item.quantity}
                        <br/>
                        Reason: {item.reason}
                        <br/>
                        Requester: {item.requester_name}
                        <br/>
                        Approved: {item.loan_approved === false ? <span style={{color:'red'}}>Pending Approval</span> : <span style={{color:'Green'}}>Yes</span> }
                        <br />
                        { item.loan_approved === true ? <Button onClick={ () => handleOpenModal(item)}>Return Item</Button> : ""}
                    </Box> : ""}
                </div>
            ))}



            <Dialog open={!!selectedItem} onClose={handleCloseModal} fullWidth width="m">
                {selectedItem && (
                    <div>
                <DialogTitle>Approving Loan For: {selectedItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Quantity Borrowed: {selectedItem.quantity}
                        <br/>
                        Reason: {selectedItem.reason}
                        <br/>
                        <h3>Do you want to return the item you borrowed?</h3>
                      
                    </DialogContentText>
                
                    <DialogActions>
                    <Button onClick={returnItem}>Approve</Button>
                    <Button onClick={handleCloseModal}>No</Button>
                    </DialogActions> 
                </DialogContent>
                </div>)}
            </Dialog>    
        
        </div>

    

    );
}

export default Returns