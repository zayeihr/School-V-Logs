import logo from '../logo.svg';
import '../App.css';
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react';
import {db, auth} from '../firebase_config'

function AddItem() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [location, setLocation] = useState('');
    const [itemMessage, setItemMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Upload the item to the 'items' collection
      db.collection('items')
        .add({
          name: name,
          category: category,
          quantity: parseInt(quantity),
          location: location,
          on_loan: 0,
        })
        .then(() => {
          console.log('Item added!');
          setName('');
          setCategory('');
          setQuantity('');
          setLocation('')
          setItemMessage(name)
        })
        .catch((error) => {
          console.error('Error adding item: ', error);
        });
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
        <br></br>
        <br></br>
          <label>
            Item Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <br></br>
          <label>
            Category:
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </label>
          <br></br>
          <label>
            Quantity:
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <br></br>
          <label>
            Location:
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          </label>
          <br></br>
          <button type="submit">Add Item</button>
        </form>
        {itemMessage ? <h2>{itemMessage} has been added successfully</h2> : ""}
      </div>
    );
  }

  export default AddItem;
