import React, { useEffect, useState } from "react";
import Header from './Header';
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

var aform = {
    margin: "2%",
}

var istyle = {
    margin: "10px",
    padding: "12px",
    border: "3px solid",
    borderRadius: "5px",
    width: "300px"

}

var btn = {
    marginTop: "15px",
    padding: "13px",
    borderRadius: "23px",
}

var upd={
    margin: "1%",
    padding: "10px",
    fontSize: "40px",
    color: "green",
    border: "1px solid black",
    backgroundColor: "black",
    borderRadius: "50px"

}

export default function UpdateProduct() {
    const param = useParams();
    const {id} = param;

    const [name,setName] = useState("");
    const [category,setCategory] = useState("");
    const [price,setPrice] = useState("");
    const [company,setCompany] = useState("");
    const [image,setImage] = useState("");

    const [data, setData] = useState("");

    const nav = useNavigate();

    useEffect(()=>{
       fetch(`http://localhost:5000/list/${id}`,{
        headers: {
            authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
       }).then((result)=>{
        result.json().then((resp)=>{
            setData(resp);
            setName(resp.name);
            setCategory(resp.category);
            setPrice(resp.price);
            setCompany(resp.company);
            setImage(resp.imageurl);
            console.log(resp.company + '0');
            console.log(resp.imageurl + '1');
            console.log(image + '2');
        })
       })
    },[])

    async function updProduct() {
        const formdata = new FormData();
        formdata.append('name',name);
            formdata.append('category',category);
            formdata.append('price',price);
            formdata.append('company',company);
            formdata.append('image',image);
        console.log(image + '3');
        let result = await fetch(`http://localhost:5000/updateproduct/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
            body: formdata
        })
        nav('/');
    }

    return(
        <div>
            <Header />
            <h1 style={upd}>Update Product</h1>
            <form style={aform}>
                
                <label htmlFor="name" style={{fontSize:"24px"}}>Product's name</label><br />
                <input style={istyle} type="text" name="name" id="name" placeholder="Enter name of product" defaultValue={data.name} onChange={(e) => setName(e.target.value)} /><br />
                
                <label htmlFor="category" style={{fontSize:"24px"}}>Product's category</label><br />
                <input style={istyle} type="text" name="category" id="category" placeholder="Enter category of product" defaultValue={data.category} onChange={(e) => setCategory(e.target.value)} /><br />
                
                <label htmlFor="price" style={{fontSize:"24px"}}>Product's price</label><br />
                <input style={istyle} type="number" name="price" id="price" placeholder="Enter price of product" defaultValue={data.price} onChange={(e) => setPrice(e.target.value)} /><br />
                
                <label htmlFor="company" style={{fontSize:"24px"}}>Product's company</label><br />
                <input style={istyle} type="text" name="company" id="company" placeholder="Enter company of product" defaultValue={data.company} onChange={(e) => setCompany(e.target.value)} /><br />
                
                <label htmlFor="image" style={{fontSize:"24px"}}>Product's image</label><br />
                <input style={istyle} type="file" name="image" id="image" placeholder="Upload image" defaultValue={data.imageurl} onChange={(e) => setImage(e.target.files[0])} /><br />

                <img src={`http://localhost:5000/${data.imageurl}`} alt='no image' width={100} height={100}/>
                
                <Button style={btn} variant="warning" onClick={updProduct}>Update Product</Button>
            </form>
        </div>
    )
}