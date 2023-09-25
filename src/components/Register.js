import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


export default function Register() {

    useEffect(() => {
        if (localStorage.getItem("user")) {
            nav("/")
        }
    }, [])

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [profilepic,setProfilepic] = React.useState("");

    const nav = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
    }

    async function signup() {
        if (name && email && password.length > 7 && phone) {
            let formdata = new FormData();
            formdata.append('name',name);
            formdata.append('email',email);
            formdata.append('phone',phone);
            formdata.append('password',password);
            formdata.append('profilepic',profilepic);
            let result = await fetch("http://localhost:5000", {
                method: "POST",
                body: formdata
            })
            result = await result.json();
            if (result.auth) {
                toast.success('Registration Successful')
                localStorage.setItem("userinfo", JSON.stringify(result.data));
                localStorage.setItem("token", JSON.stringify(result.auth));
                localStorage.setItem('user', true);
                nav("/")
            }
            else {
                toast.error('Email already exists');
            }
        }
        else {
            toast.error('Enter details correctly')
        }
    }

    return (
        <div>
            <Header />
            <h1 style={{ marginTop: "20px", fontSize: "50px", color: "green" }}>Register</h1>
            <form className="rform" onSubmit={handleSubmit}>
                <input className="input" type="text" name="Name" id="Name" placeholder=" Enter Name" onChange={(e) => setName(e.target.value)} /><br />
                <input className="input" type="number" name="phone" id="phone" placeholder=" Enter Phone Number" onChange={(e) => setPhone(e.target.value)} /><br />
                <input className="input" type="email" name="email" id="email" placeholder=" Enter Email" onChange={(e) => setEmail(e.target.value)} /><br />
                <input className="input" type="password" name="password" id="password" placeholder=" Enter Password (min 8 characters)" onChange={(e) => setPassword(e.target.value)} /><br />
                <input className="input" type="file" name="profilepic" placeholder="Upload Profile Pic" onChange={(e) => setProfilepic(e.target.files[0])} /><br />
                <button onClick={signup} className="button">Sign up</button>
            </form>
            <ToastContainer position="top-center" />
        </div>
    )
}