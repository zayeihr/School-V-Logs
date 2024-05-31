import logo from '../logo.svg';
import '../App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState, useRef } from 'react';
import {db, auth, user} from '../firebase_config'
import { Checkbox, TextField, Box, Button, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog } from '@mui/material';
import { DialogTitle, DialogActions, DialogContent, DialogContentText, Grid} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import InfoIcon from '@mui/icons-material/Info';
import { doc, deleteDoc, getDoc } from "firebase/firestore";


import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';



function ManageItems() {
    


    const [_name, setName] = useState('');
    const [_category, setCategory] = useState('');
    const [_quantity, setQuantity] = useState(0);
    const [_location, setLocation] = useState('');
    const [_onLoan, setOnLoan] = useState(0);
    
    // State for item data pulled from firestore
    const [data, setData] = useState([]);
    //Code for Modal States
    const [selectedItem, setSelectedItem] = useState(null);
    const handleOpenModal = (item) => {
        setSelectedItem(item);
        setCategory(item.category);
        setName(item.name);
        setLocation(item.location)
        setQuantity(item.quantity);
        setOnLoan(item.on_loan);
    };

    
    const handleCloseModal = () => {
        setSelectedItem(null);
        setCategory('');
        setName('');
        setLocation('');
        setQuantity(0);
        setOnLoan(0);
      
    };
    const handleRowClick = (params) => {
        handleOpenModal(params.row);
      };
    

    //States and modal functions for delete feature
    const [deleteItem, setDeleteItem]  = useState(null);
    const [deleteId, setDeleteId] = useState('');
    
    const handleDeleteModal = (item) => {
        setDeleteItem(item);
        setDeleteId(item.id);
    };
    const handleCloseDeleteModal = () => {
      setDeleteItem(null);
      setDeleteId('');
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
        {
          field: 'actioEditns',
          headerName:'Delete',
          width: 150,
          renderCell: (params) => (
            <Button
              variant="contained"
              color="primary"
              startIcon={<InfoIcon />}
              onClick={(event) => {event.stopPropagation(); handleDeleteModal(params.row); console.log('button clicked!');}}
            >
              Delete?
            </Button>
          ),
        },
      ];

    //Get ALL documents from 'items' collection (Made it a function to call it again)
    
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

    //Store query as a function to call it when an update happens 
    //TODO: remove UseEffect function (see what happens?)
    const getItemsRefresh = () => {
      db.collection('items')
        .get()
        .then((querySnapshot) => {
          const items = [];
          querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setData(items);
        });
    }

    //Refs for borrowing items
    const nameRef = useRef(null);
    const qtyRef = useRef(null);
    const onLoanRef = useRef(null);
    const locationRef = useRef(null);
    const itemIdRef = useRef(null);
    const categoryRef = useRef(null);
    
    


    //Edit items function

    const handleEditItems = async (e) =>{
      const name = nameRef.current.value;
      const qty = qtyRef.current.value;
      const itemId = itemIdRef.current.value;
      const onLoan = onLoanRef.current.value;
      const category = categoryRef.current.value;
      const location = locationRef.current.value;

      
      console.log(qty);
      
      console.log(name);
      console.log(category)
      console.log(onLoan);
      

      //TO DO: Normalise whether im using state or not for updates

      db.collection('items')
        .doc(itemId)
        .update({
          name: _name, //For some reason i need to use the state for this so i will set it like that for now
          category: category,
          quantity: parseInt(qty),
          on_loan: parseInt(onLoan),
          location: _location
          
        })
        .then(() => {
          console.log('Item Updated!');
          getItemsRefresh();
        })
        .catch((error) => {
          console.error('Error updating item: ', error);
        });


      handleCloseModal();
    }
    


    //delete item
    const handleDeleteItem = async () => {
      var itemDocRef = db.collection('items').doc(deleteItem.id)
        


      const itemDocSnap = await getDoc(itemDocRef);
        
        if (itemDocSnap.exists()) {
          await deleteDoc(doc(db, 'items', deleteItem.id));
        }
        else {
            console.log("Item Does Not Exist")
        }

      getItemsRefresh();
      handleCloseDeleteModal();

    }


    return (

        <div>
            <h2> Manage Items (ADMINS ONLY) </h2>
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
                <DialogTitle>Editting {selectedItem.name}</DialogTitle>
                <DialogContent>
                <form onSubmit={handleEditItems}>

                <TextField
                      autoFocus
                      margin="dense"
                      inputRef={nameRef}
                      label="Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      required="true"
                      onChange={(e) => setName(e.target.value)} 
                      value={_name}
                  />  
                <TextField
                      autoFocus
                      margin="dense"
                      inputRef={categoryRef}
                      label="Category"
                      type="text"
                      fullWidth
                      variant="outlined"
                      required="true"
                      onChange={(e) => setCategory(e.target.value)} 
                      value={_category}
                  />

                <TextField
                      autoFocus
                      margin="dense"
                      inputRef={locationRef}
                      label="Store Location"
                      type="text"
                      fullWidth
                      variant="outlined"
                      required="true"
                      onChange={(e) => setLocation(e.target.value)} 
                      value={_location}
                  />
                  
                  <TextField
                      autoFocus
                      margin="dense"
                      inputRef={qtyRef}
                      label="Quantity"
                      type="number"
                      fullWidth
                      variant="outlined"
                      required="true"
                      value={_quantity}
                      onChange={(e) => setQuantity(e.target.value)} 
                      InputProps={{ inputProps: { min: 0 } }}
                  />
                  <TextField
                      autoFocus
                      margin="dense"
                      inputRef={onLoanRef}
                      label="Quantity on Loan"
                      type="number"
                      fullWidth
                      variant="outlined"
                      required="true"
                      value={_onLoan}
                      onChange={(e)=>setOnLoan(e.target.value)} 
                      InputProps={{ inputProps: { min: 0, max: selectedItem.quantity-selectedItem.on_loan } }}
                  />
                 
                  <input type="hidden" ref={nameRef} name="name" value={selectedItem.name}/>

                  <input type="hidden" ref={itemIdRef} name="item_id" value={selectedItem.id}/>
                  <br/><br/>
                
                  <DialogActions>
                  <Button type="submit">Submit</Button>
                  </DialogActions> 
                </form>
                </DialogContent>
                </div>)}
            </Dialog>



            {/* Small dialog to delete an item */}
            <Dialog open={!!deleteItem} onClose={handleCloseDeleteModal} fullWidth width="m">
                {deleteItem && (
                    <div>
                <DialogTitle>Deleting: {deleteItem.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <h3>Are you SURE you want to delete this item? This action CANNOT be reversed.</h3>
                      
                    </DialogContentText>
                
                    <DialogActions>
                    <Button onClick={handleDeleteItem}>Yes</Button>
                    <Button onClick={handleCloseDeleteModal}>No</Button>
                    </DialogActions> 
                </DialogContent>
                </div>)}
            </Dialog>    
            
        </div>
    );
    
  }

export default ManageItems