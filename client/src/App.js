import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Auth/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;