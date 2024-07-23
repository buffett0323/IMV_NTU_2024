import React, { useState } from 'react';
import './css/AIQA.css';
import axios from 'axios';


const AIQA: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [chat, setChat] = useState<{ sender: string; message: string }[]>([]);
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      // Add the user's question to the chat
      setChat((prevChat) => [...prevChat, { sender: 'user', message: question }]);
  
      try {
        // Call the AI endpoint to get the answer
        const aiResponse = await axios.post('http://localhost:7001/api/ask-ai', { question });
        const aiAnswer = aiResponse.data.answer;
  
        // Add the AI response to the chat
        setChat((prevChat) => [...prevChat, { sender: 'bot', message: aiAnswer }]);
  
        // // Send the question via email
        // await axios.post('http://localhost:3001/api/send-email', { question });
        // console.log('Email sent successfully');
      } catch (error) {
        console.error('Failed to get answer from AI or send email', error);
      }
  
      setQuestion('');
    };
  
    return (
      <section className="aiqa">
        <h2>Q&A</h2>
        <p>碳索者農業網，把您所有的問題變成沒有問題。</p>
        <div className="chat-window">
          {chat.map((chatMessage, index) => (
            <div key={index} className={`chat-message ${chatMessage.sender}`}>
              <p>{chatMessage.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="請輸入您的問題..."
            required
          />
          <button type="submit">提交</button>
        </form>
      </section>
    );
  }
  
export default AIQA;