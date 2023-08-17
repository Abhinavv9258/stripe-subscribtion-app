import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Info from './pages/Info';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/info" element={<Info />} />
                <Route path="/login" element={<Login />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/payment" element={<Payment />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
