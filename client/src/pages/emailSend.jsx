import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useParams } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';
import "../styles/EmailSendStyles.css";

const EmailSend = () => {

  const { doctorIdString } = useParams();

  const userId = doctorIdString
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:3500/communication/send-email',{
        receiver: recipient,
        subject: subject,
        message: content
      } );

      console.log('Email sent successfully!', response.data);
      toast.success('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    }
  };

   useEffect(() =>{axios.get(`http://127.0.0.1:3500/doctor/getspecific/${userId}`)
   .then(response =>{ 
     setRecipient(response.data.doctor.email)
     console.log(response.data.doctor.email)
   })
     .catch(error =>{console.error(error)})
    },[userId])
    

  return (
    <>
      <Navbar />

      <div className="mainContainer">
        <h1>Email Send</h1>
        <form className="formEmail" onSubmit={handleSubmit}>
          <label>
            Recipient: {recipient}
          </label>
          <br />
          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={subject}
              onChange={(e)=>{setSubject(e.target.value)}}            />
          </label>
          <br />
          <label>
            Content:
            <textarea
              name="content"
              value={content}
              onChange={(e)=>{setContent(e.target.value)}}
            />
          </label>
          <br />
          <button type="submit">Send Email</button>
        </form>
        <ToastContainer />
      </div>

      <Footer />
    </>
  );
};

export default EmailSend;
