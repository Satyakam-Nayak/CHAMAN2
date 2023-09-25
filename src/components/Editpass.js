import { Button } from "react-bootstrap";
import Header from "./Header";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import userimg from '../userimg.webp'
import { useNavigate } from "react-router-dom";

var cont = {
    margin: "7%",
    padding: "3%",
    border: "3px solid"
}

var inpbox = {
    margin: "10px",
    padding: "8px",
    border: "none",
    outline: "none",
    borderBottom: "1px solid",
    width: "24%"
}

export default function Editpass() {
    const id = JSON.parse(localStorage.getItem('userinfo'))._id;

    const [password, setPassword] = useState("");
    const [name, setName] = useState("")
    const [pass, setPass] = useState("");
    const [check, setCheck] = useState(true);

    const [newpass, setNewPass] = useState("");
    const [newpass2, setNewPass2] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/user/${id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((result) => {
            result.json().then((resp) => {
                setName(resp.name);
                setNewPass(resp.password);
            })
        })
    }, [])

    async function updprof() {
        toast.success("Password Updated")
        let result = await fetch(`http://localhost:5000/updateuser/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
            body: JSON.stringify({ password })
        })
        result = await result.json();
        nav('/profile')
    }

    function verify() {
        if (newpass === pass) {
            setCheck(!check);
        }
        else {
            toast.error("Incorrect Password")
        }
    }

    async function updpass() {
        if (newpass !== password) {
            if (password === newpass2) {
                console.log(password);
                updprof();
            }
            else {
                toast.error("Enter Password correctly")
            }
        }
        else {
            toast.error("Password musn't be same as old password")
        }
    }

    return (
        <div>
            <Header />
            <div style={cont}>
                <img src={userimg} height="100px" width="100px" alt="user" /><br />
                <h2>{name}</h2><br />
                {
                    check ?
                        <div>
                            <label htmlFor="opass">Enter old password*</label><br />
                            <input style={inpbox} type="password" id="opass" placeholder="Enter old password" onChange={(e) => setPass(e.target.value)} /><br />
                            <a onClick={() => setCheck(!check)} style={{ marginLeft: "13%", color: "blue", cursor: "pointer" }}>Forgot Password?</a><br /><br />
                            <Button onClick={verify}>Verify</Button>
                        </div>
                        :
                        <div>
                            <label htmlFor="npass">Enter new password*</label><br />
                            <input style={inpbox} type="password" id="npass" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                            <label htmlFor="npass2">Confirm password*</label><br />
                            <input style={inpbox} type="text" id="npass2" placeholder="Confirm password" value={newpass2} onChange={(e) => setNewPass2(e.target.value)} /><br /><br />
                            <Button onClick={updpass}>Save password</Button>
                        </div>
                }
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}