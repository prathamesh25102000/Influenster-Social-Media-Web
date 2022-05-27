import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useRef, useEffect, useContext } from 'react'

import { UserContext } from '../App'
import { Link, useNavigate } from "react-router-dom";
import '../App.css'

const DNavBar = () => {

    const { state, dispatch } = useContext(UserContext)
    const [userDetails, setUserDetails] = useState([])
    const [search, setSearch] = useState("")
    const searchUser = useRef(null)
    const [user, setUser] = useState({
        name: ""
    })
    const navigate = useNavigate()



    const fetchProfiles = (query) => {
        setSearch(query)
        console.log(search);
        fetch('/search-users', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user)
                console.log(userDetails);
            })
    }

    const pages = () => {
        console.log(state);
        if (state) {
            return [
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li key={1} style={{ width: "100px" }} className="nav-item">
                        <Link className="nav-link" to="/"><i className="fa-solid fa-house" ></i> Home</Link>
                    </li>,
                    <li key={2} className="nav-item search">
                        <button type="button" className="btn btn-primary find" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>

                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-body">
                                        <form className="d-flex">
                                            <input type="search" id="name" name="name" placeholder="Search" aria-label="Search" defaultValue={user.name} onChange={(e) => fetchProfiles(e.target.value)} />
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <ul className="collection">
                                            {userDetails.map(item => {
                                                return <Link style={{ textDecoration: "none" }} to={item._id !== state._id ? "/profile/" + item._id : '/profile'}
                                                ><li style={{ listStyleType: "none" }} className="collection-item"><img src={item.pic} style={{ height: "20px", width: "20px", borderRadius: "10px" }} /> {item.name}</li></Link>
                                            })}

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>,

                    <li key={3} style={{ width: "100px" }} className="nav-item">
                        <Link className="nav-link" to="/followingpost"><i className="fa-solid fa-earth-oceania"></i> Explore</Link>
                    </li>,

                    <li key={5} style={{ width: "100px" }} className="nav-item">
                        <Link className="nav-link" to="/addpost"><i className="fa-solid fa-square-plus"></i> Post</Link>
                    </li>,
                    <li key={4} style={{ width: "100px" }} className="nav-item">
                        <Link className="nav-link" to="/profile"><i className="fa-solid fa-user"></i> Profile</Link>
                    </li>

                </ul>,

                <span className="navbar-text" id="logout">
                    <button style={{ width: "100px" }} className="btn btn-danger" onClick={() => {
                        localStorage.clear()
                        dispatch({ type: "CLEAR" })
                        navigate("/login")

                    }}>Logout <i className="fa-solid fa-right-from-bracket"></i></button>
                </span>

            ]
        } else return [
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                <li key={6} className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                </li>,

                <li key={7} className="nav-item">
                    <Link className="nav-link" to="/signup">Signup</Link>
                </li>
            </ul>
        ]
    }


    return (

        <>
            <nav className="navbar  navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to={state ? "/" : "/login"}>influenster</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">

                        {pages()}

                    </div>

                </div>

            </nav>
        </>

    )
}

export default DNavBar