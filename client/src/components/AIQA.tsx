import React, { useState, useEffect } from 'react';
import './css/AIQA.css';
import axios from 'axios';

const AIQA: React.FC = () => {
    const [faq, setFaq] = useState<{ question: string; answer: string; reference?: string }[]>([]);

    useEffect(() => {
        const fetchFAQ = async () => {
            try {
                // Fetch the FAQ data from the backend API
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/get-faq`);
                setFaq(response.data);
            } catch (error) {
                console.error('Failed to load FAQ data', error);
            }
        };

        fetchFAQ();
    }, []);

    return (
        <section className="aiqa">
            <h2>Q&A</h2>
            <h3>碳索者農業網，把您所有的問題變成沒有問題。</h3>
            
            <div className="faq-section">
              <h3>常見問題 (FAQ)</h3>
              <ul className="faq-list">
                  {faq.map((item, index) => (
                      <li key={index} className="faq-item">
                          <h4>{`${index + 1}. ${item.question}`}</h4> {/* Add the number in front of the question */}
                          <p>{item.answer}</p>
                          {item.reference && <a href={item.reference} target="_blank" rel="noopener noreferrer">參考資料</a>}
                      </li>
                  ))}
              </ul>
          </div>
        </section>
    );
};

export default AIQA;
