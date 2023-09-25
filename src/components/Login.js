import React, { useEffect } from "react"
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { ToastContainer, toast } from "react-toastify";

var h3ele = {
    padding: "30px",
    fontSize: "25px"
}

export default function Login() {

    useEffect(() => {
        if (localStorage.getItem("user")) {
            nav("/")
        }
    }, [])

    const [email, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    let nav = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
    }

    async function logn() {
        if (email && password) {
            let data = { email, password }
            let result = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            result = await result.json();
            if (result.auth) {
                toast.success('Login Successful');
                localStorage.setItem('userinfo', JSON.stringify(result.data));
                localStorage.setItem('token', JSON.stringify(result.auth));
                localStorage.setItem('user', true);
                nav("/")
            }
            else {
                toast.error('Login Failed');
            }
        }
        else{
            toast.error("Fields should not be empty");
        }

    }

    return (
        <div>
            <Header />
            <form className="form" onSubmit={handleSubmit}>
                <input className="input" type="email" name="username" id="username" placeholder=" Enter Username" value={email} onChange={(e) => setUsername(e.target.value)} /><br />
                <input className="input" type="password" name="password" id="password" placeholder=" Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
                <Button onClick={logn} variant="dark">Login</Button>
                <h3 style={h3ele}>Not a registered user? Sign up here <Button onClick={() => nav("/register")}>Sign Up</Button></h3>
            </form>
            <ToastContainer position="top-center" />
        </div>
    )
}