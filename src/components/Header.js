import React from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

var drop={
    marginLeft: "63%",
    borderRadius: "10px",
    color: "white",
    fontSize: "20px",
    border: "2px solid green",
    backgroundColor: "green",
    padding: "8px",
}

var btn={
    color: "green",
}

var hele_left = {
    fontSize:"25px",
    color: "white",
    textDecoration: "none",
    margin: "1%",
    padding: "12%"
  }

var logele = {
    marginLeft: "82%"
}

export default function Header() {

    const userInfo = JSON.parse(localStorage.getItem('userinfo'));
    const nav=useNavigate();
    
    function logout()
    {
        localStorage.clear();
        nav('/login');
    }
    
    return (
        <div className='header'>
            {
                localStorage.getItem("user") ?
                    <>
                        <NavLink className="hele home" to="/">Home</NavLink>
                        <h1 className="stick">|</h1>
                        <NavLink className="hele" to="/addproduct">Add Product</NavLink>
                        <NavDropdown style={drop} title={userInfo.name}>
                                <NavDropdown.Item style={btn} onClick={()=>{nav('/profile')}}>Profile</NavDropdown.Item>
                                <NavDropdown.Item style={btn} onClick={logout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </>
                    :
                    <div style={logele}>
                        <NavLink style={hele_left}  to="/login">Login</NavLink>
                        <NavLink style={hele_left} to="/register">Register</NavLink>
                    </div>
            }

        </div>
    )
}