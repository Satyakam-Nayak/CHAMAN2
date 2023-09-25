import React, { useEffect, useState } from "react";
import Header from './Header';
import { Button, Table } from "react-bootstrap";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

var table = {
    marginTop: "30px",
    border: "2px solid gray",
}

var heading = {
    margin: "30px",
    fontSize: "60px",
    color: "green",
    fontWeight: "bold",
    border: "1px solid black",
    backgroundColor: "black",
    padding: "15px",
    borderRadius: "50px"
}

var und = {
    textDecoration: "none",
}


var dele={
    display: "flex",
    justifyContent: "space-around",
    marginTop: "60px",
}

function Home() {
    const [data, setData] = useState([]);

    let nav = useNavigate();

    useEffect(() => {
        list();
    }, [])

    async function handleSearch(e)
    {
        let key = e.target.value;
        if (key) {
            let result = await fetch(`http://localhost:5000/search/${key}`,{
                headers: {
                    authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            })
            result = await result.json();
            if (result) {
                setData(result);
            }
        }
        else {
            list();
        }
    }

    async function list() {
        let result = await fetch("http://localhost:5000/list",{
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        setData(result);
    }

    function updBtn(id) {
        nav('/updateproduct/' + id);
    }

    async function delBtn(id) {
        alert("Are u sure to delete item ?");
        let result = await fetch(`http://localhost:5000/deleteproduct/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        result = await result.json();
        list();
    }

    return (
        <div>
            <Header />
            <h1 style={heading}>Product list</h1>
            <input type="text" name="search" placeholder="Search here" className="inp"
            onChange={handleSearch}/>
            <Table striped variant="secondary" style={table}>
                <tbody>
                    <tr>
                        <th>Sl No</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Company</th>
                        <th>User-ID</th>
                        <th colSpan="2">Operation</th>
                    </tr>
                    {
                        data.map((item, key) =>
                            <tr key={key}>
                                <td>{key + 1}</td>
                                <td>{item.name}</td>
                                <td><img src={`http://localhost:5000/${item.imageurl}`} alt='no image' width={100} height={100}/></td>
                                <td>{item.price}</td>
                                <td>{item.category}</td>
                                <td>{item.company}</td>
                                <td>{item.userId}</td>
                                <td><Button variant="danger" onClick={() => { delBtn(item._id) }}>Delete</Button></td>
                                <td><Button variant="warning" onClick={() => { updBtn(item._id) }}>Update</Button></td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>

            <div style={dele}>
                <h2 >Want to showcase your products?<br />
                    <NavLink to="/addproduct" className="text-primary" style={und}>Click</NavLink> here to add more</h2>
            </div>
            <ToastContainer position="top-center"/>
        </div>
    )
}

export default Home;