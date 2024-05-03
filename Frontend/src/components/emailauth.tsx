import  { useState } from 'react';
import Http from './Http';
import { TailSpin } from 'react-loader-spinner';


const EmailAuth = ({ baseURL }: {baseURL: String}) => {

  const [otp, setotp] = useState('');
  const [loading, setloading] = useState('Done');
  const [error, seterror] = useState("")

  const handleSubmit = async (event: React.FormEvent) => {
    setloading("Loading")
    event.preventDefault();
    
    await Http.post(`${baseURL}/emailauth`, {
      email: localStorage.getItem("email"),
      otp:otp,
    }).then((response)=>{
      
      if (response.data["status"]!="Incorrect"){
        localStorage.setItem('intern_name', response.data["name"]);
        localStorage.setItem('email', response.data["email"]);
        localStorage.setItem('id', response.data["id"]);
        localStorage.setItem('logged_intern', "true");
        window.location.replace("/dashboard/");}
      else {
        seterror("Incorrect.")
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
        <h2 className='text-3xl mb-5'>Verify email</h2>
        
          <div className="form-group">
          <label htmlFor="email">One-Time Password</label>
          <input
            className='text-black bg-transparent'
            type="text"
            id="username"
            value={otp}
            onChange={(e) => setotp(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Authenticate</button>
        <div className='text-red-700'>{error}</div>
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

export default EmailAuth;
