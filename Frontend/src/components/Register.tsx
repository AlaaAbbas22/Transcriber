import  { useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
const Register = ({ baseURL }: {baseURL: String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState('Done');
const [name, setname] = useState("")
const [error, seterror] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    
    await Http.post(`${baseURL}/register`, {
      email: username,
      password:password,
      name:name,
    }).then((response)=>{
      
      if (response.data["result"]!="User exists"){
        localStorage.setItem('email', username);
        window.location.replace("/emailauth/");}
      else {
        seterror("Error! User already exits.")
        setloading("Done")
      }
    }).catch((e)=>{
      console.log(e);
      
      setloading("Done")
    });
      
  };

  return (
    loading=="Done"&&<div className="login-container ">
      <form className="login-form bg-black bg-gradient-to-tl from-slate-950 to-slate-700" onSubmit={handleSubmit}>
        <h2 className='text-3xl mb-5'>Sign Up</h2>
        <div className="form-group">
        <label htmlFor="name">Name</label>
          <input
            className='text-black bg-transparent'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
          </div>
          <div className="form-group">
          <label htmlFor="email">Username (email)</label>
          <input
            className='text-black bg-transparent'
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className='text-black bg-transparent'
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        <div className='text-red-700'>{error}</div>
        <Link to="/login" className='hover:underline'>Login, instead!</Link>
      </form>
    </div>||<div className="m-auto my-20 w-40"><TailSpin
            height="140"
            width="140"
            color="#5555ff"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
        /></div>
  );
};

export default Register;
