import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Auth/AuthPage';
import HomePage from './HomePage/HomePage';
import { store } from './store/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/homepage" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
