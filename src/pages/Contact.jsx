import { useState } from "react";
import { useAuth } from "../store/auth";
const defaultContact={
  username:"",
  email:"",
  message:"",
}
export const Contact = () => {
  const [contact, setContact] = useState(defaultContact);
  const [userData,setUserData]=useState(true);
  const {user}=useAuth();
  if(userData && user){
    setContact({
      username:user.username,
      email:user.email,
      message:"",
    })
    setUserData(false);
  }
  // lets tackle our handleInput
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setContact({
      ...contact,
      [name]: value,
    });
  };

  // handle fomr get FormSubmissionInfo
  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const response=await fetch("https://blogbackend-zz2d.onrender.com/api/form/contact",{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify(contact)
      });
      if(response.ok){
        setContact(defaultContact)
        const data=await response.json();
        console.log(data);

      }
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <>
      <section className="section-contact">
        <div className="contact-content container">
        <h1 className="main-heading">Contact us</h1>

        </div>
        {/* contact page main  */}
        <div className="container grid grid-two-cols">
          <div className="contact-img">
            <img src="/images/support.png" alt="we are always ready to help" />
          </div>

          {/* contact form content actual  */}
          <section className="section-form">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  value={contact.username}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label htmlFor="email">email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  value={contact.email}
                  onChange={handleInput}
                  required
                />
              </div>

              <div>
                <label htmlFor="message">message</label>
                <textarea
                  name="message"
                  id="message"
                  autoComplete="off"
                  value={contact.message}
                  onChange={handleInput}
                  required
                  cols="30"
                  rows="6"
                ></textarea>
              </div>

              <div>
                <button type="submit">submit</button>
              </div>
            </form>
          </section>
        </div>

        <section className="mb-3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.549083284951!2d81.60245417562076!3d21.249722180455482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dde213f66723%3A0x21543965c50c43c7!2sNIT%20Raipur!5e0!3m2!1sen!2sin!4v1737610985543!5m2!1sen!2sin"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </section>
    </>
  );
};
