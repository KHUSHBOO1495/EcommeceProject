import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';

const RegistrationForm = () => {
  const apiUrl = 'http://localhost:3000/authentication/register'
  const [data,setData] = useState({})
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission (page refresh)
    
    fetch(apiUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (!res.ok) {  // If the status code is not OK (not in 200-299 range)
        return res.json().then(error => {
          // Reject with the error message from the response body
          throw new Error(error.message || 'An error occurred during registration');
        });
      }
      return res.json(); // If status is OK, parse the response JSON
    }) 
    .then(res => {
      console.log("Response from API:", res);
      // If no error, proceed to store the token and show success alert
      localStorage.setItem('token', res.token); // Store the token in local storage
  
      Swal.fire({
        title: 'Welcome!',
        text: 'You have successfully registered.',
        icon: 'success',
        confirmButtonText: 'Continue',
        confirmButtonColor: '#4CAF50', // Green Button
        background: '#f9f9f9', // Light Background
        color: '#333', // Text Color
        timer: 2500, // Auto-close after 2.5 seconds
        timerProgressBar: true, // Show progress bar
        showClass: {
          popup: 'animate__animated animate__fadeInDown' // Fancy animation
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp' // Fancy animation
        }
      }).then(() => {
        navigate("/"); // Redirect to home page after success
      });
    })
    .catch(err => {
      console.error("Error during registration:", err);
  
      // Show SweetAlert2 error popup on failure (network issues, invalid data, etc.)
      Swal.fire({
        title: 'Oops!',
        text: err.message || 'An error occurred during registration. Please try again.',
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#FF5733', // Red Button
        background: '#fce4e4', // Light Red Background
        color: '#900', // Darker Red Text
        showClass: {
          popup: 'animate__animated animate__shakeX' // Shake animation for error
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut' // Fade out animation
        }
      });
    });
  };
  
  return (
    <StyledWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our app. </p>
        <div className="flex">
          <label>
            <input className="input" type="text" placeholder required onChange={(e)=>{
              setData({...data, first_name:e.target.value})
            }}/>
            <span>Firstname</span>
          </label>
          <label>
            <input className="input" type="text" placeholder required onChange={(e)=>{
              setData({...data, last_name:e.target.value})
            }} />
            <span>Lastname</span>
          </label>
        </div>
        <label>
          <input className="input" type="email" placeholder required onChange={(e)=>{
              setData({...data, email:e.target.value})
            }} />
          <span>Email</span>
        </label>
        <label>
          <input class="input" type="tel" placeholder required onChange={(e)=>{
              setData({...data, phone_number:e.target.value})
            }} />
          <span>Phone Number</span>
        </label>
        <label>
          <input className="input" type="password" placeholder required onChange={(e)=>{
              setData({...data, password:e.target.value})
            }} />
          <span>Password</span>
        </label>
        <label>
          <input className="input" type="password" placeholder required onChange={(e)=>{
              setData({...data, confirmPassword:e.target.value})
            }} />
          <span>Confirm password</span>
        </label>
        <button className="submit" type='submit'>Register</button>
        <p className="signin">Already have an acount ? <Link className="nav-link" to="/login">Login</Link> </p>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Ensure the wrapper takes full height of the screen */
  display: flex;
  justify-content: center;  /* Horizontally center the content */
  align-items: center;      /* Vertically center the content */
  height: 100vh;            /* Full viewport height */
  background-color: #f1f1f1; /* Optional: Change the background color */

  /* Add padding around the form if needed */
  padding: 0 10px; /* Optional: Adding some space from the edges of the screen */

  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 450px;
    width: 100%;   /* Ensure the form uses 100% of the container width */
    padding: 20px;
    border-radius: 20px;
    background-color: #fff;
    color: #333;
    border: 1px solid #5F1F43;
  }

  .title {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -1px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 30px;
    color: #77415f;
  }

  .title::before {
    width: 18px;
    height: 18px;
  }

  .title::after {
    width: 18px;
    height: 18px;
    animation: pulse 1s linear infinite;
  }

  .title::before,
  .title::after {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    border-radius: 50%;
    left: 0px;
    background-color: #77415f;
  }

  .message, 
  .signin {
    font-size: 14.5px;
    color: rgba(0, 0, 0, 0.7);
  }

  .signin {
    text-align: center;
  }

  .signin a:hover {
    text-decoration: underline 77415f;
  }

  .signin a {
    color: #77415f;
  }

  .flex {
    display: flex;
    width: 100%;
    gap: 6px;
  }

  .form label {
    position: relative;
  }

  .form label .input {
    background-color: #f9f9f9;
    color: #333;
    width: 100%;
    padding: 20px 05px 05px 10px;
    outline: 0;
    border: 1px solid rgba(105, 105, 105, 0.397);
    border-radius: 10px;
  }

  .form label .input + span {
    color: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 10px;
    top: 0px;
    font-size: 0.9em;
    cursor: text;
    transition: 0.3s ease;
  }

  .form label .input:placeholder-shown + span {
    top: 12.5px;
    font-size: 0.9em;
  }

  .form label .input:focus + span,
  .form label .input:valid + span {
    color: #77415f;
    top: 0px;
    font-size: 0.7em;
    font-weight: 600;
  }

  .input {
    font-size: medium;
  }

  .submit {
    border: none;
    outline: none;
    padding: 10px;
    border-radius: 10px;
    color: #fff;
    font-size: 16px;
    transform: .3s ease;
    background-color: #77415f;
  }

  .submit:hover {
    background-color:rgba(119, 65, 95, 0.88);
  }

  @keyframes pulse {
    from {
      transform: scale(0.9);
      opacity: 1;
    }

    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`;

export default RegistrationForm;
