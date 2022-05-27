//import logo from './logo.svg';
import './App.css';
import NavBar from "./components/NavBar"
import {BrowserRouter as Router,useRoutes,useNavigate} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Account from './components/Users'
import Feed from './components/FollowingPost';
import Password from './components/Password'
import Profile from './components/Profile'
import Signup from './components/Signup'
import AddPost from './components/AddPost'
import UpdatePassword from './components/UpdatePassword'

import React,{useEffect,createContext,useReducer,useContext} from 'react';
import {reducer,initialState} from './reducer/userReducer'
import { useLocation } from 'react-router-dom';

export const UserContext = createContext()

const Routing=()=>{
  const navigate = useNavigate()
  const location = useLocation();

  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      if(!location.pathname.startsWith('/reset'))
           navigate('/login')
    }
  },[])

  const Wrapper = () => {
    let routes = useRoutes([
      { path: "/", element: <Home /> },
      {  path: "/profile", element: <Profile /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      { path: "/addpost", element: <AddPost /> },
      { path: "/profile/:userid", element: <Account /> },
      { path: "/followingpost", element: <Feed /> },
      { path: "/reset", element: <Password /> },
      { path: "/reset/:token", element: <UpdatePassword /> },
    ]);
    return routes;
  }    
  return (
       <Wrapper />

  )
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState)

  return (
  
    <UserContext.Provider value={{state,dispatch}}>
    <Router>
      <NavBar />
      <Routing />
    </Router>
    </UserContext.Provider>
  );
}

export default App;
