import logo from '../logo.svg';
//import '../App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState, useRef, useCallback } from 'react';
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

function Loans(){
    
    //States to handle opening and closing loan modal
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpenModal = (item) => {
        setSelectedItem(item);
    };
    const handleCloseModal = () => {
        setSelectedItem(null);
    };

    //States to handle deleting a loan
    const [delSelectedItem, setDelSelectedItem] = useState(null);
    const handleDelOpenModal = (item) => {
        setDelSelectedItem(item);
    };
    const handleDelCloseModal = () => {
        setDelSelectedItem(null);
    };

    //States to handle issuing item
    const [issueSelectedItem, setIssueSelectedItem] = useState(null);
    const handleIssueOpenModal = (item) => {
        setIssueSelectedItem(item);
    };
    const handleIssueCloseModal = () => {
        setIssueSelectedItem(null);
    };



    
    //State to hold data for loan data queried from firestore
    const [loanData, setLoanData] = useState([]);
    
    //Get ALL documents from 'on_loan' collection, retrieves all loan requests
    //Converted to declaring function outside of useEffect. 
    //If things mess up, move function BACK into useEffect declaration
    const getAllLoans = () => {
        db.collection('on_loan').orderBy("loan_approved")
          .get()
          .then((querySnapshot) => {
            const on_loan = [];
            querySnapshot.forEach((doc) => {
              on_loan.push({ id: doc.id, ...doc.data() });
            });
            setLoanData(on_loan);
          });
    }
    
    useEffect(() => {
        getAllLoans();
    }, []);
    //console.log(loanData[0].loan_approved)
    //Render readable timestamps
    const renderReadableTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toDateString(); // Use the toLocaleString method to convert timestamp to a readable format
      };

    
    //FUNCTION TO UPDATE LOANS: 
    //Pass All item properties to the function => makes it easier to pull data out
    const approveLoan = () =>{
        //test if the state still works (we wil use this to send data to server!)
        console.log(selectedItem);
        

        //database references
        var loanApprovalRef = db.collection('on_loan').doc(selectedItem.id)
        var loanItemRef = db.collection('items').doc(selectedItem.item_id)
        //check if the on_loan document exists
        
        
        //if the item is approved do not approve, if it is, go through the update process
        if (loanItemRef.loan_approved == true ){
            alert("Item already on loan!")
            handleCloseModal();
        }
        else {
        //Update the item in the "Items" table by incrementing the "on_loan" value by the value requested
        loanItemRef.update({
            on_loan: firebase.firestore.FieldValue.increment(selectedItem.quantity)
        })


        //Edit the "on_loan" table to update the current loan_approved status to "true"
        
        loanApprovalRef.update({
            loan_approved: true
        })
        
        //Edit the "on_loan" table to update the user who approved the transaction
        var approverUidRef = db.collection('on_loan').doc(selectedItem.id)
        approverUidRef.update({
            approver_uid: auth.currentUser.uid
        })

        //Refresh the state
        //window.location.reload();
        getAllLoans();
        handleCloseModal();
        }

    }

    const issueItem = async () =>{
        //test if the state still works (we wil use this to send data to server!)
        console.log(issueSelectedItem);
        

        //database references
        var loanApprovalRef = db.collection('on_loan').doc(issueSelectedItem.id)
        var loanItemRef = db.collection('items').doc(issueSelectedItem.item_id)
        //check if the on_loan document exists
        
        
        //if the item is approved do not approve, if it is, go through the update process
        if (loanItemRef.loan_approved == true ){
            alert("Item already on loan!")
            handleIssueCloseModal();
        }
        else {
        //Update the item in the "Items" table by incrementing the "on_loan" value by the value requested
        loanItemRef.update({
            quantity: firebase.firestore.FieldValue.increment(-issueSelectedItem.quantity)
        })


        //Delete the on_loan Entry
        await deleteDoc(doc(db, 'on_loan', issueSelectedItem.id));

        //create a log  for issued item
        db.collection('issued')
        .add({
          name: issueSelectedItem.name,
          item_id: issueSelectedItem.item_id,
          quantity: parseInt(issueSelectedItem.quantity),
          reason: issueSelectedItem.reason,
          requester_name: issueSelectedItem.requester_name,
          requester_company: issueSelectedItem.requester_company,
          requester_uid: issueSelectedItem.requester_uid,
          date_issued: firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then(() => {
          console.log('Item Issued');
        })
        .catch((error) => {
          console.error('Error Issuing: ', error);
        });
        
        // loanApprovalRef.update({
        //     loan_approved: true
        // })
        
        // //Edit the "on_loan" table to update the user who approved the transaction
        // var approverUidRef = db.collection('on_loan').doc(selectedItem.id)
        // approverUidRef.update({
        //     approver_uid: auth.currentUser.uid
        // })

        getAllLoans();

        handleIssueCloseModal();
        }

    }

    //Function to delete loans
    const deleteLoan = async () =>{
        //test if the state still works (we wil use this to send data to server!)
        console.log(delSelectedItem);
        
        /* 1. Get data of selected item
        2. Decrement the on_loan quantity in the items table by loaned number
        3. Delete the loan data (or move it to a historical table? Decide this later)
         */
        //Declare this to confirm that the item exists before updating on-loan quantity
        var onLoanDocRef = db.collection('on_loan').doc(delSelectedItem.id)
        //Update the item in the "Items" table by decrementing the "on_loan" value by the value requested

        
        //check if the on_loan document exists
        const onLoanDocSnap = await getDoc(onLoanDocRef);
        //var onLoanDocRef = db.collection('on_loan').doc(delSelectedItem.id)
        
        if (onLoanDocSnap.exists()) {
            await deleteDoc(doc(db, 'on_loan', delSelectedItem.id));
         }
        else {
            console.log("Item Does Not Exist")
        }
    

        

        //reload the loans
        getAllLoans();

        handleDelCloseModal();
    }

    // TODO: add tab system to separate approved requests from pending requests
    console.log(loanData)
    return(
        <div>
            <h1>Loan Requests</h1>
            {loanData.map((item, index) =>(
                <div style={{ width: '70%', margin:'auto', paddingBottom:'30px'}}>
                    
                    <Box sx={{alignContent:'left', borderRadius: '16px', boxShadow: 3, paddingTop:'1px', paddingBottom:'5px' }} >
                        <h3>Item: {item.name}</h3>
                        <b>Request Created:</b> {renderReadableTime(item.request_created.seconds * 1000)}
                        <br/>
                        <b>Quantity Requested:</b> {item.quantity}
                        <br/>
                        <b>Reason:</b> {item.reason}
                        <br/>
                        <b>Requester:</b> {item.requester_name}
                        <br/>
                        <b>Company:</b> {item.requester_company}
                        <br/>
                        <b>Date Required:</b> {renderReadableTime(item.date_required.seconds * 1000)}
                        <br/>
                        <b>Approved:</b> {item.loan_approved === false ? <span style={{color:'red'}}>No</span> : <span style={{color:'Green'}}>Yes</span> }
                        <br />
                        {/** Only show items if the request is NOT approved */}
                        { item.loan_approved === false ? <Button onClick={ () => handleOpenModal(item)}>Approve?</Button> : ""}
                        { item.loan_approved === false ? <Button onClick={ () => handleIssueOpenModal(item)}>Issue Item</Button> : ""}
                        { item.loan_approved === false ? <Button onClick={ () => handleDelOpenModal(item)}>Delete Request</Button> : ""}
                    </Box>
                </div>
            ))}


            {/** Dialogues only open if approving or deleting loan ( only if selectedItem state exists) */}    
            <Dialog open={!!selectedItem} onClose={handleCloseModal} fullWidth width="m">
                {selectedItem && (
                    <div>
                <DialogTitle>Approving Loan For: {selectedItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Quantity Requested: {selectedItem.quantity}
                        <br/>
                        Reason: {selectedItem.reason}
                        <br/>
                        <h3>Do you want to approve this loan request?</h3>
                      
                    </DialogContentText>
                
                    <DialogActions>
                    <Button onClick={approveLoan}>Approve</Button>
                    <Button onClick={handleCloseModal}>No</Button>
                    </DialogActions> 
                </DialogContent>
                </div>)}
            </Dialog>    

             {/** Delete Item Dialog */}       
            <Dialog open={!!delSelectedItem} onClose={handleDelCloseModal} fullWidth width="m">
                {delSelectedItem && (
                    <div>
                <DialogTitle>Deleting Loan Request For: {delSelectedItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        
                        <h3>Do you want to Delete this loan request?</h3>
                      
                    </DialogContentText>
                
                    <DialogActions>
                    <Button onClick={deleteLoan}>Yes</Button>
                    <Button onClick={handleDelCloseModal}>No</Button>
                    </DialogActions> 
                </DialogContent>
                </div>)}
            </Dialog>
            

            {/** Issue Item Dialog */}    
            <Dialog open={!!issueSelectedItem} onClose={handleIssueCloseModal} fullWidth width="m">
                {issueSelectedItem && (
                    <div>
                <DialogTitle>Issuing: {issueSelectedItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        
                        <h3>Do you want to issue this item?</h3>
                      
                    </DialogContentText>
                
                    <DialogActions>
                    <Button onClick={issueItem}>Yes</Button>
                    <Button onClick={handleIssueCloseModal}>No</Button>
                    </DialogActions> 
                </DialogContent>
                </div>)}
            </Dialog>  
        
        </div>

    

    );
}

export default Loans