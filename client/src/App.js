import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Auth/AuthPage';
import HomePage from './HomePage/HomePage';
import { useEffect } from 'react';
import axios from 'axios';

function App() {

  useEffect(() => {
    //axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`)    
  }, [])

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
