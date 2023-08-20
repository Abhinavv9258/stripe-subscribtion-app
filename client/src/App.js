import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Error from './pages/Error';
// import Payment from './pages/Payment';

export const URL = process.env.REACT_APP_SERVER_URL;

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                {/* <Route path="/payment" element={<Payment />} /> */}
                <Route path="/*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
