import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import AddProduct from './components/AddProduct';
import Register from './components/Register';
import Login from './components/Login';
import UpdateProduct from './components/UpdateProduct';
import Protected from './components/Protected';
import Profile from './components/Profile';
import Editpass from './components/Editpass';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Protected Cmp={Home} />} />
        <Route path="/addproduct" element={<Protected Cmp={AddProduct} />} />
        <Route path="/updateproduct/:id" element={<Protected Cmp={UpdateProduct} />} />
        <Route path="/editpass" element={<Protected Cmp={Editpass} />} />
        <Route path="/profile" element={<Protected Cmp={Profile} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
