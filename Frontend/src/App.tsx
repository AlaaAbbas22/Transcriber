import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  } from "react-router-dom";
import { Navigate } from "react-router-dom";

import './App.css'

import Nav2 from './components/Nav2'
import History from "./components/History";
import user from "../public/user.png"

import img from "../public/5837088.png"
import Login from "./components/Login";
import Profile from "./components/Profile";
import Http from "./components/Http";
import Tooltip from '@mui/material/Tooltip';
import { useEffect } from "react";
import Transcribe from "./components/Transcribe";
import Register from "./components/Register";
import EmailAuth from "./components/emailauth";


const baseURL = "https://transcriber-1.onrender.com"//"http://127.0.0.1:8000"//"https://transcriber-zi3m.onrender.com"//



async function handleLogOut() {
  localStorage.setItem('logged_intern', "false");
  await Http.post(`${baseURL}/logout`, {});
  window.location.replace("/login");
};

const router = createBrowserRouter([
  


  {
    path: "/",
    element: <>
                <div className="bg-white py-2 px-0 md:px-20 ring">
                    <div  className=" relative bottom-4 md:bottom-0">    
                    <Link to="/"><div className="flex items-center  relative md:top-3 top-[110px] w-[20%] z-30">
                          ElTranscriber
                      </div></Link>
                      <div className="relative bottom-2 md:bottom-4">
                      {localStorage.getItem("logged_intern")=="true"&&<Link className="p-2 text-black" to="/dashboard">Dashboard</Link>||<Link to="/login" className="p-1 bg-white text-blue-950 rounded-lg ring-2 shadow-lg ring-black hover:bg-green-700 hover:text-white" >Log in</Link>}{localStorage.getItem("logged_intern")=="true"&&<Link to="#" className="p-1 bg-white text-blue-950 rounded-lg ring-2 shadow-lg ring-black hover:bg-red-700 hover:text-white" onClick={handleLogOut}>Log out</Link>}
                      </div>  
                    </div>{localStorage.getItem('logged_intern')=="true"&&<div className="md:absolute top-7 right-6 text-black sm:mx-auto">Hey, {localStorage.getItem('intern_name')}</div>}</div><Outlet/>
                    
    </>,
    children:
    [
      {path:"/login",
       element:<><Login baseURL={baseURL}/></>},

       {path:"/emailauth",
       element:<><EmailAuth baseURL={baseURL}/></>},
       {path:"/register",
       element:<><Register baseURL={baseURL}/></>},
       {path:"/dashboard",
       element:localStorage.getItem("logged_intern")=="true" &&
       <><Nav2/>
        <Outlet/>
        <h1 className='py-[10%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>
          Welcome to your dashboard, {localStorage.getItem('intern_name')}!
          </h1>
          
          </>||<Navigate replace to="/login" />},

      {
        path:"/",
        element: localStorage.getItem("logged_intern")=="true" &&<><div className="md:p-20 py-40">          <Link to="#" >
        <Tooltip title="Choose a side above!" placement="top"><img src={img} className='mx-auto w-[30%] object-contain rounded-xl hover:scale-110 ' alt="Logo" /></Tooltip>
    </Link></div><h1 className='py-[10%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>Welcome to your dashboard, {localStorage.getItem('intern_name')}!</h1></>||<Navigate replace to="/login" />
      },{
        path: "/transcribe",
        element: <><Nav2/><Outlet/><Transcribe baseURL={baseURL}/></>
      },
       
          {
            path: "/history",
            element: <><Nav2/><History baseURL={baseURL}/></>
          },
          {
            path: "/profile",
            element: <><Nav2/><Profile img={user}/></>
          }
        
    ]}]
  
);


function App() {
  useEffect(() => {
    Http.get(`${baseURL}/dummy`)
    console.log("Run")
  }, []);

  useEffect(()=>{
  
    
    const func = async ()=>{ await Http.get(`${baseURL}/getuser`).then((res)=>{
      if (res.data.id){
        localStorage.setItem('intern_name', res.data["name"]);
      localStorage.setItem('email', res.data["email"]);
      localStorage.setItem('id', res.data["id"]);
      localStorage.setItem('logged_intern', "true");
      } else{
        handleLogOut()
      }
    })}

    func()
  },[])

  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App


