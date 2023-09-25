import { Button } from "react-bootstrap"
import Header from "./Header"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

var inp = {
    margin: "1%",
    marginLeft: "1%",
    border: "none",
    outline: "none",
    fontSize: "40px",
    fontWeight: "bold",
    width: "60%",
    color: "black",
}

var divele = {
    margin: "5%",
    marginLeft: "13%"
}

var imgele = {
    height: "160px",
    width: "150px",
    border: "2px solid black",
    borderRadius: "100%",
}

export default function Profile() {
    const id = JSON.parse(localStorage.getItem('userinfo'))._id;

    const [editinp, setEditinp] = useState(true)

    const [name, setName] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [profilepic, setProfilepic] = useState("")

    const [data, setData] = useState("");

    let nav = useNavigate();

    useEffect(() => {
        list();
    },[])

    function list()
    {
        fetch(`http://localhost:5000/user/${id}`, {
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        }).then((result) => {
            result.json().then((resp) => {
                setData(resp);
                setName(resp.name);
                setPhone(resp.phone);
                setEmail(resp.email);
                setPassword(resp.password);
                setProfilepic(resp.profilepic);
            })
        })
    }

    async function updprof() {
        toast.success("Profile Updated")
        // let item = { name, phone, email }\
        const formdata = new FormData();
        formdata.append('name', name);
        formdata.append('email', email);
        formdata.append('phone', phone);
        formdata.append('profilepic', profilepic);
        let result = await fetch(`http://localhost:5000/updateuser/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
            },
            body: formdata
        })
        setEditinp(!editinp);
       window.location.reload();
    }

    function savechng() {
        setEditinp(!editinp);
    }

    function updpass() {
        nav('/editpass')
    }

    return (
        <div>
            <Header />
            <div style={divele}>
                <img src={`http://localhost:5000/${data.profilepic}`} alt='no image' style={imgele} />
                {/* <Button style={{marginLeft: '2%',marginTop: '12%'}} disabled={editinp} variant='dark' onClick={updprof}>Edit image</Button> */}
                {
                    editinp? null: <input style={{marginLeft: "5%",marginTop: '5%'}} type="file" name="profilepic" placeholder="Upload Profile Pic" onChange={(e) => setProfilepic(e.target.files[0])} />
                }
                <br />
                <span style={{ fontSize: "40px", fontWeight: "bold" }}>Name: </span><input style={inp} type="text" defaultValue={data.name} onChange={(e) => setName(e.target.value)} disabled={editinp} /><br />
                <span style={{ fontSize: "40px", fontWeight: "bold" }}>Email: </span><input style={inp} type="text" defaultValue={data.email} onChange={(e) => setEmail(e.target.value)} disabled={editinp} /><br />
                <span style={{ fontSize: "40px", fontWeight: "bold" }}>Phone: </span><input style={inp} type="text" defaultValue={data.phone} onChange={(e) => setPhone(e.target.value)} disabled={editinp} /><br /><br />
                <Button variant="danger" onClick={updpass}>Edit Password</Button><br /><br />
                {
                    editinp ? <Button variant="danger" onClick={savechng}>Edit profile</Button> : <Button variant="danger" onClick={updprof}>Save Changes</Button>
                }
            </div>
            <ToastContainer position="top-center" />
        </div>
    )
}