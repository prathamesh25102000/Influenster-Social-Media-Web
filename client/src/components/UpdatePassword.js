import React, { useState, useContext, } from 'react'
//import NavBar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link, useNavigate,useParams } from "react-router-dom";
import '../App.css'

const UpdatePassword = () => {

    const navigate = useNavigate()
    const [password,setPasword] = useState("")

    const {token}=useParams()
    console.log(token);
   

    const details = (event) => {
        event.preventDefault()

        fetch("/new_password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        }).then(res => res.json()).then(data => {
            console.log(data);

            if (data.error) {
                console.log(data.error);
                window.alert(data.error)
            }
            if (!data.error) {
             
                window.alert(data.message)
                navigate("/login")
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
                                <form className='form l' id="stripe-login" onSubmit={details} method="POST">
                                    <h1 className='navbar-brand' style={{ textAlign: "center", paddingBottom: "5%", color: "white" }}>Influenster</h1>

                                    <div className="mb-3 field padding-bottom--24">
                                        <label style={{ color: "white" }} htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                        <input type="password" className="form-control" id="password" name="password" value={password} onChange={(e)=>setPasword(e.target.value)} placeholder="enter new password" />
                                    </div>

                                    <div class="d-grid gap-1 col-6 mx-auto">
                                        <button style={{ backgroundColor: "rgb(122, 11, 192)", border: "rgb(122, 11, 192)" }} type="submit" className="btn btn-primary" >UpdatePassword</button>
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

export default UpdatePassword