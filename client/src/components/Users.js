import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../App'
import { useParams } from 'react-router-dom'

const Account = () => {

    const [userProfile, setProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    console.log(state);
    const { userid } = useParams()
    const [follow, setFollow] = useState(state ? !state.following.includes(userid) : true)
    console.log(follow)
    //console.log(userid);   

    useEffect(() => {
        //console.log(follow);
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)

                setProfile(result)
            })
        //console.log(follow);
    }, [])


    const followUser = () => {
        //e.preventDefault()

        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                //follow=1
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setFollow(false)
            })

    }
    const unfollowUser = () => {

        //e.preventDefault()       
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item != data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setFollow(true)
            })

    }

    return (

        <>
            {userProfile ?
                <div style={{ maxWidth: "630px", margin: "0px auto" }}>
                    <div className="container" style={{
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div className="row">
                            <div className="col-6" style={{ paddingLeft: "7%" }}>
                                <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                    src={userProfile.user.pic}
                                    alt="Profile pic"
                                />
                            </div>
                            <div className="col-6" style={{ paddingRight: "10%" }}>
                                <h4>{userProfile.user.name}</h4>

                                <div style={{ display: "flex", justifyContent: "space-between", width: "112%" }}>
                                    <p style={{ textAlign: "center" }}><h6>{userProfile.posts.length}</h6>posts</p>
                                    <p style={{ textAlign: "center" }}><h6>{userProfile.user.followers.length}</h6>followers</p>
                                    <p style={{ textAlign: "center" }}><h6>{userProfile.user.following.length}</h6>following</p>
                                </div>

                                {follow ?
                                    <button   type="submit" className="btn btn-primary f" onClick={() => followUser()}>Follow</button>
                                    :
                                    <button   type="submit" className="btn btn-primary f" onClick={() => unfollowUser()}>Unfollow</button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row" style={{marginTop:"10px"}}>
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <div style={{ marginBottom: "25px" }} className="col-4"><img key={item._id} className="card-img-top" src={item.photo} alt={item.title} /></div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>


                : <h2>loading...!</h2>}

        </>
    )
}


export default Account