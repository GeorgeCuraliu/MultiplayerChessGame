import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Auth/AuthPage';
import HomePage from './HomePage/HomePage';
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setValues } from './store/features/userData';
import MatchPage from './MatchPage/MatchPage';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    axios.post(`http://${process.env.REACT_APP_API_BASE_URL}/login`, {}, {withCredentials: true})
    .then(response => {
      if(response.status === 200){
        dispatch(setValues({...response.data}));
      }
    }).catch(err => {
      console.log("credentials are incorrect");
    })    
  }, [])

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/match" element={<MatchPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
