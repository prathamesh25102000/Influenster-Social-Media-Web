import React,{ useState, useContext,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'

import { UserContext } from '../App'
import { Link } from 'react-router-dom'

const Home = () => {

    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch('/allpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setData(result.posts)
        })
     },[])
 
     console.log(data)


    const comment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const likePost = (id) => {
    
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        console.log(result);
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        console.log(result);
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
                
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                window.confirm("Are you sure you want to delete this item?")
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)

            })
    }
    return (
        <div>
            {   
                data.map(post => {
                    console.log(post)
                    return (
                         
                        <div key={post._id} className="card  mb-3" style={{ maxWidth: "18rem", margin: "50px auto" }}>
                            <h6 className="card-header bg-transparent" style={{ borderBottom: "none", padding: "5px", color: "black" }}><Link style={{ textDecoration: "none", color: "black" }} to={post.postedBy._id !== state._id ? "/profile/" + post.postedBy._id : "/profile"}><img style={{ height: "40px", width: "40px", borderRadius: "20px" }} src={post.postedBy.pic} />    {post.postedBy.name}</Link> {post.postedBy._id == state._id
                                && <i className="fa-solid fa-delete-left" style={{
                                    float: "right"
                                }}
                                    onClick={() => deletePost(post._id)}
                                ></i>}
                            </h6>

                            <div className="card-body" style={{ padding: "0px" }}  >
                                <img src={post.photo} className="card-img-top" alt="..." />

                            </div>
                            <div className="card-footer bg-transparent" style={{ borderTop: "none", paddingLeft: "5px" }}>
                                <div className="card-body" style={{ padding: "0px" }}>
                                    {post.likes.includes(state._id) ?
                                        <i className="fa-solid fa-heart-crack" style={{ color: "crimson" }} onClick={() => { unlikePost(post._id) }}></i> :
                                        <i className="fa-solid fa-heart" style={{ color: "crimson", marginLeft: "10px" }} onClick={() => { likePost(post._id) }}></i>
                                    }
                                    <p className="card-text">Liked by {post.likes.length} people</p>
                                    <p className="card-text">{post.title}</p>
 
                                        {post.comments.map(record => {

                                            return (

                                    <p key={record._id}><span style={{ fontWeight: "500" }}><img style={{height:"30px",width:"30px",borderRadius:"15px"}} src={record.postedBy.pic} /> {record.postedBy.name}</span> : {record.text}</p>

                                    )

                                        })}

                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        comment(e.target[0].value, post._id)
                                        console.log(e.target[0].value)
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <i style={{ marginTop: "11px", paddingLeft: "5px" }} className="fa-solid fa-comment"></i><input style={{ border: "none" }} type="text" className="form-control" id="comment" name="comment" placeholder="Add a comment..." onChange={(e) => {

                                            }} /></div>
                                    </form>


                                </div>
                            </div>
                        </div>
                    )
                })

            }
        </div>

    )
}

export default Home