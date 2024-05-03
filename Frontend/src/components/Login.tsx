import  { useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
const Login = ({ baseURL }: {baseURL: String}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setloading] = useState('Done');
  const [error, seterror] = useState('')


  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    await Http.post(`${baseURL}/login`, {
      email: username,
      password:password,
    }).then((response)=>{
      if (response.data["result"]=="Not found"){
        seterror("Error! User not found.")
        setloading("Done")
      }
      else{
      localStorage.setItem('intern_name', response.data["name"]);
      localStorage.setItem('email', response.data["email"]);
      localStorage.setItem('id', response.data["id"]);
      localStorage.setItem('logged_intern', "true");
      
      window.location.replace("/dashboard/");
    }
    }).catch((e)=>{
      console.log(e);
      setloading("Error! Try again.")
      setloading("Done")
    });
      
  };

  return (
    loading=="Done"&&<div className="login-container">
      <form className="login-form bg-black bg-gradient-to-tl from-white to-slate-900 text-black" onSubmit={handleSubmit}>
        <h2 className='text-3xl mb-5'>Login</h2>
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
        <button type="submit">Login</button>
        <div className='text-red-700'>{error}</div>
        <Link to="/register" className='text-blue-900 hover:text-blue-900 hover:underline'>Register, instead!</Link>
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

export default Login;
