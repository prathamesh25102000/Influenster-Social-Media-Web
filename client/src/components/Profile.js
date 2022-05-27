import React, { useEffect, useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import { UserContext } from '../App'

const Profile = () => {


    const [post, setPosts] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [url, setUrl] = useState("")
    const [image, setImage] = useState("")
    const [dat,setData]=useState([])
    //console.log(state);
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setPosts(result.mypost)
                console.log(post)
            })
    }, [])

  


    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "influenster-app")
            data.append("cloud_name", "influenster")
            fetch("https://api.cloudinary.com/v1_1/influenster/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            setUrl(data.url)
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })

                        })


                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image])

    const updatePic = (file) => {
        console.log(file)
        setImage(file)
    }

 
    

    return (

        <div style={{ maxWidth: "630px", margin: "0px auto" }}>
            <div className="container" style={{ borderBottom: "1px solid gray", margin: "18px 0px" }}>
                <div className="row">
                    <div className="col-6" style={{ paddingLeft: "7%" }}>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={state ? state.pic : ""} />

                        <div className="input-group mb-3">
                            <input type="file" className="form-control" id="inputGroupFile02" name="image" onChange={(e) => updatePic(e.target.files[0])} />
                            <label className="input-group-text" htmlFor="inputGroupFile02" style={{ backgroundColor: "teal", border: "teal", color: "white" }}>Update</label>
                        </div>

                    </div>
                    <div className="col-6" style={{ paddingRight: "10%" }}>
                        <h4>{state ? state.name : "Anonymous"}</h4>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "112%" }}>
                            <p style={{ textAlign: "center" }}><h6>{post.length}</h6> posts</p>
                            <p style={{ textAlign: "center" }}><h6>{state ? state.followers.length : "loading"}</h6> followers</p>
                            <p style={{ textAlign: "center" }}><h6>{state ? state.following.length : "loading"}</h6> following</p>
                        </div>
                        

                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    {
                        post.map(post => {
                            return (
                                <div style={{ marginTop: "10px" }} className="col-4"><img className="card-img-top" key={post._id} src={post.photo} alt={post.title} /></div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile