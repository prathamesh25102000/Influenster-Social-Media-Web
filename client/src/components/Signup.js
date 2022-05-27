import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            details()
        }
    }, [url])

    const changeInput = (event) => {
        let ename = event.target.name
        let value = event.target.value
        setUser({ ...user, [ename]: value })
    }


    const profilephoto = () => {
        //event.preventDefault()
        console.log(image);
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "influenster-app")
        data.append("cloud_name", "influenster")
        console.log(data);
        fetch("https://api.cloudinary.com/v1_1/influenster/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err)
            })

    }


    const details = async(event) => {
        event.preventDefault()
        const { name, email, password } = user
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            window.alert("Enter a valid email!")
            return
        }
  
        
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email
            })
            
        }).then(res => 
            res.json()).then(data => {
            console.log(data);

            if (data.error) {
                console.log(data.error);
                window.alert(data.error)
            }
            if (!data.error) {
                window.alert("Registered successfully")
                navigate("/login")
            }
        }).catch(err => {
            console.log(err);
        })
    }

    return (


        <>
            <div className="container1" style={{ backgroundColor: "#f1f3fb", padding: "5%" }}>
                <div className="card1">
                    <div className="card1-image">

                    </div>
                    <form className="card1-form" onSubmit={details} >
                        <div className="input1">
                            <input type="text" className="input1-field" id='name' name='name' defaultValue={user.name} onChange={changeInput} required />
                            <label className="input1-label">Username</label>
                        </div>
                        <div className="input1">
                            <input type="text" className="input1-field" id='email' name='email' defaultValue={user.email} onChange={changeInput} required />
                            <label className="input1-label">Email</label>
                        </div>
                        <div className="input1">
                            <input type="password" className="input1-field" id='password' name='password' defaultValue={user.password} onChange={changeInput} required />
                            <label className="input1-label">Password</label>
                        </div>
                        <div className="action">
                            <button type="submit" className="action-button">Create my account</button>
                        </div>
                        <hr style={{ color: "white", height: "3px" }}></hr>
                        <Link style={{ textDecoration: "none", color: "red" }} to={'/login'}>Already have an account? Login.</Link>
                    </form>

                </div>
            </div>
        </>
    )
}

export default Signup