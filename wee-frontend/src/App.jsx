import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
// import Header from './components/Header';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
