import React, { useState, useContext, } from 'react'
//import NavBar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../App'

import { Link, useNavigate } from "react-router-dom";
import '../App.css'
const Login = () => {

    const navigate = useNavigate()
    const { state, dispatch } = useContext(UserContext)

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const changeInput = (event) => {
        let name = event.target.name
        let value = event.target.value
      
        setUser({ ...user, [name]: value })
    }

    const details = (event) => {
        event.preventDefault();
        console.log(user);
        const { email, password } = user
        console.log(email);
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            window.alert("Enter a valid email!")
            return
        }
        fetch("/login", {
            method: "post",
            headers: {
                "Content-Type": "application/json"              
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res =>res.json()).then(data => {
            console.log(data);

            if (data.error) {
                console.log(data.error);
                window.alert(data.error)
            }
            if (!data.error) {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user", JSON.stringify(data.user))
                dispatch({ type: "USER", payload: data.user })
                window.alert("Logged in")
                navigate("/")
            }
        }).catch(err => {
            console.log(err);
        })
        
    }
    return (
        <>

            <div className="box-root padding-top--24 flex-flex flex-direction--column" style={{ flexGrow: "1", zIndex: "1" }} >
                <div className="box-root padding-top--48 padding-bottom--24 flex-flex flex-justifyContent--center">
                    <div className="formbg-outer">
                        <div className="formbg">
                            <div className="formbg-inner padding-horizontal--48">
                                <form className='form l' id="stripe-login" onSubmit={details}>
                                    <h1 className='navbar-brand' style={{ textAlign: "center", paddingBottom: "5%", color: "white" }}>influenster</h1>
                                    <div className="mb-3 field padding-bottom--24">
                                        <label style={{ color: "white" }} htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" value={user.email} onChange={changeInput} />
                                        <div style={{ color: "gold" }} id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                                    </div>
                                    <div className="mb-3 field padding-bottom--24">
                                        <label style={{ color: "white" }} htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={changeInput} />
                                    </div>
                                    <h6><Link style={{textDecoration:"none"}} to={'/reset'}>Forgot Password?</Link></h6>
                                    <div style={{marginTop:"15px"}} className="mb-3 form-check">
                                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                                        <label style={{ color: "white" }} className="form-check-label" htmlFor="exampleCheck1">Remember me</label>
                                    </div>
                                    <div class="d-grid gap-1 col-6 mx-auto">
                                        <button style={{ backgroundColor: "rgb(122, 11, 192)", border: "rgb(122, 11, 192)" }} type="submit" className="btn btn-primary" >Login</button>
                                    </div>
                                    <hr style={{ color: "white", height: "3px" }}></hr>
                                    <Link style={{ textDecoration: "none", color: "wheat" }} to={'/signup'}>Don't have an account? Sign up.</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login