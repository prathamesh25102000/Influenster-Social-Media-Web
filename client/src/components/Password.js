import React, { useState } from 'react'
import { useNavigate ,Link} from 'react-router-dom'


const Password = () => {

    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    const details = (event) => {
        event.preventDefault()
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            window.alert("Invalid email")
            return
        }
        fetch('/reset_password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    window.alert(data.error)
                }
                else {
                    window.alert(data.message)
                    navigate("/login")
                }
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div className="container1" style={{ backgroundColor: "#f1f3fb", padding: "5%" }}>
            <div className="card1">
                <form className="card1-form" onSubmit={details} method="POST">
                    <h1 className="navbar-brand">influenster</h1>

                    <div className="input1">
                        <input
                            type="text" className="input1-field" id='email' name='email' placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label className="input1-label">Email</label>
                    </div>
                    <div className="action">
                        <button type="submit" className="action-button">reset password</button>
                    </div>

                </form>
            </div>
        </div>
    )
}


export default Password