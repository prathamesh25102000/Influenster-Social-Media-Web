import React, { useState, useEffect } from 'react'
import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'

const AddPost = () => {
    const navigate = useNavigate()

    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [title, setTitle] = useState("")
    //const [body,setBody] = useState("")


    useEffect(() => {
        console.log(url);
        if (url) {
            fetch("/addpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    //body,
                    pic: url
                })
            }).then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.error) {
                        window.alert(data.error)
                    }
                    else {
                        window.alert("finished")
                        navigate("/")
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])



    const details = (event) => {
        event.preventDefault()

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


    return (
        <div style={{ backgroundColor: "rebeccapurple", paddingTop: "20px", paddingBottom: "40px" }}>
            <form className='form post-form' onSubmit={details} method="POST">
                <div className="card" style={{ width: "18rem" }}>
                    <img src="/images/im4.jpg" className="card-img-top" alt="..." />
                </div>
                <h5 style={{ textAlign: "center", color: "white", marginTop: "10px" }}>Create new post</h5>
                <hr style={{ height: "3px", color: "white" }}></hr>
                <div className="mb-3">
                    <input type="text" className="form-control" id="title" name="title" placeholder="caption" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div style={{ margin: "0px auto" }} className="input-group mb-3">
                    <input type="file" className="form-control" id="inputGroupFile02" name="image" onChange={(e) => setImage(e.target.files[0])} />
                    <label className="input-group-text" htmlFor="inputGroupFile02" style={{ backgroundColor: "teal", border: "teal", color: "white" }}>Upload</label>
                </div>
                <div class="d-grid gap-1 col-6 mx-auto">
                    <button style={{backgroundColor:"rgb(242, 74, 114)",border:"rgb(242, 74, 114)"}} type="submit" className="btn btn-success">Post</button>
                </div>

            </form>
        </div>
    )
}

export default AddPost