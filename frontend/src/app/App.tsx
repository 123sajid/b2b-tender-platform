import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Companies from './pages/companies';
import Tenders from './pages/tenders';
import Login from './pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/companies" element={<Companies />} />
        <Route path="/tenders" element={<Tenders />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
