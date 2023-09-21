import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/AiChatStyles.css';

const ChattingAi = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);  

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  

    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_response', { input_text: inputText });
      setResponse(response.data.response);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        <h2 style={{ padding: "10px" }}>Chat with Our AI : </h2>
        <form onSubmit={handleChatSubmit}>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            className="chat-textarea"
            placeholder="Enter your message"
            rows={5}
            cols={50}
          />
          <button type="submit" className="send-button">Send</button>
        </form>

        {loading && <p className="labelUpdate" style={{padding:"5px", margin:"10px"}}>Loading response...</p>}

        {response && (
          <div className="ai-response">
            <h3 style={{ padding: "10px", margin: "10px" }}>AI Response:</h3>
            <p>{response}</p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ChattingAi;
