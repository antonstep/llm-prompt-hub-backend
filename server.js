import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PromptList = () => {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const baseUrl = 'https://llm-prompt-hub-backend.onrender.com'; // Base URL for the backend
      try {
        const response = await axios.get(`${baseUrl}/api/prompts`);
        setPrompts(response.data);
      } catch (error) {
        console.error('Error fetching prompts:', error.response ? error.response.data : error.message);
      }
    };

    fetchPrompts();
  }, []);

  return (
    <div>
      <h1>Prompts</h1>
      {prompts.length > 0 ? (
        <ul>
          {prompts.map(prompt => (
            <li key={prompt.id}>{prompt.title}</li>
          ))}
        </ul>
      ) : (
        <p>No prompts available.</p>
      )}
    </div>
  );
};

export default PromptList;
