import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import {toast } from 'react-toastify';
const URL="https://blogbackend-zz2d.onrender.com/api/auth/login";
export const Login = () => {
    const [user, setUser] = useState({
        email:"",
        password:"",
    });
    const navigate=useNavigate();
    const {storetokenInLS}=useAuth();
    //handling the i.p values
    const handleInput=(e)=>{
        let name=e.target.name;
        let value=e.target.value;
        setUser({
            ...user,
            [name]:value,
        })
    }
    //handling form submission
    const handleSubmit=async ( e)=>{
        e.preventDefault();
        try {
          const response=await fetch(URL,{
            method:"POST",
            headers:{
              "Content-Type":"application/json",

            },
            body:JSON.stringify(user)
          });
          const res_data=await response.json();
          if(response.ok){
            toast.success("Login succesful");
            storetokenInLS(res_data.token);
            setUser({email:"",password:""})
            navigate("/")
          }else{
            toast.error(res_data.extraDetails?res_data.extraDetails:res_data.message)
            console.log("invalid credentials");
            
          }
        } catch (error) {
          console.log(error);
          
        }
        
        
    }
  return (
    <>
      <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/images/register.png"
                  alt="a nurse with a cute look"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Login Form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="text"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="email"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="password"
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Login Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
};
