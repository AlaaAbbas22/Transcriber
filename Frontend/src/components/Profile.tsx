
//import { useEffect, useState } from 'react'
import Tooltip from '@mui/material/Tooltip';
import { Navigate } from 'react-router-dom';
const Profile = ({img:img}:{img:string}) => {




if (localStorage.getItem("logged_intern")=="false"){
  return <Navigate replace to="/login"/>;
}
else{

return (
  <>
    <Tooltip placement="top" title="User Information"><div className=" mb-10 mt-6 profile" >
    <img src={img} className='mx-auto w-[30%]' alt="Logo" />
      <h1 className=' pb-2 font-serif'>{localStorage.getItem('intern_name')}</h1>
          <p className='font-sans'><strong>ID: <span className='text-blue-500'>{localStorage.getItem('id')}</span></strong> </p>
          <p className='font-sans'><strong>Email: <span className='text-blue-500'>{localStorage.getItem('email')}</span></strong> </p>
    </div></Tooltip>
  </>
)}
}

export default Profile