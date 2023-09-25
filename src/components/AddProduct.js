import React, { useState } from "react";
import Header from './Header';
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var aform = {
    margin: "1%",
}

var istyle = {
    margin: "1%",
    padding: "1%",
    border: "none",
    outline: "none",
    borderBottom: "2px solid",
    width: "30%",
    fontSize: "25px",

}

var btn = {
    marginTop: "15px",
    padding: "13px",
    borderRadius: "23px",
}

var apd = {
    margin: "1%",
    padding: "10px",
    fontSize: "50px",
    color: "green",
    border: "1px solid black",
    backgroundColor: "black",
    borderRadius: "50px"

}

export default function AddProduct() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [company, setCompany] = useState("");
    const [image, setImage] = useState("");

    const nav = useNavigate();

    async function addProduct() {
        if (name && price && category && company) {
            toast.success("Product added successfully")
            let userId = JSON.parse(localStorage.getItem('userinfo'))._id;
            let formdata = new FormData();
            formdata.append('name',name);
            formdata.append('category',category);
            formdata.append('price',price);
            formdata.append('company',company);
            formdata.append('image',image);
            formdata.append('userId',userId);
            let result = await fetch('http://localhost:5000/addproduct', {
                method: 'POST',
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                },
                body: formdata
            })
            nav('/')
        }
        else {
            toast.error('All fields should be filled')
        }
    }

    return (
        <div>
            <Header />
            <h1 style={apd}>Add Product</h1>
            <form style={aform}>

                <input style={istyle} type="text" name="name" placeholder="Enter product name" onChange={(e) => setName(e.target.value)} /><br />

                <input style={istyle} type="number" name="price" placeholder="Enter product price" onChange={(e) => setPrice(e.target.value)} /><br />

                <input style={istyle} type="text" name="category" placeholder="Enter product category" onChange={(e) => setCategory(e.target.value)} /><br />

                <input style={istyle} type="text" name="company" placeholder="Enter product company" onChange={(e) => setCompany(e.target.value)} /><br />

                <input style={istyle} type="file" name="image" placeholder="Upload Image" onChange={(e) => setImage(e.target.files[0])} /><br />
                
                <Button style={btn} variant="success" onClick={addProduct}>Add Product</Button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    )
}