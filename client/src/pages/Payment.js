import React from 'react';
import {useState, useEffect} from 'react';
import firebase from '../firebase/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {Link, useNavigate}  from 'react-router-dom';

import '../components/Payment.css'


const Payment = () => {
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                setUserName(user.displayName);
            } else {
                setUserId("");
                setUserName("");
            }
        });
    }, [userId]);

    const logout = async() => {
        firebase.auth().signOut();
        navigate('/login');
    }


    const [inputValue, setInputValue] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiration, setExpiration] = useState('');
    const [cvc, setCVC] = useState('');

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };

    const handleExpirationChange = (e) => {
        const newValue = e.target.value;
            if (/^\d{0,2}\/\d{0,2}$/.test(newValue)) {
                setExpiration(newValue);
            }
    };


    return (
        <>
            <Navbar expand="lg" className="main-navbar bg-body-tertiary sticky-lg-top" >
                <Container>
                    <Navbar id="basic-navbar-nav">
                        <Nav>
                            <Navbar.Brand><Link to='/'>Stripe</Link></Navbar.Brand>
                            {
                                !userId ? (
                                    <Navbar.Brand><Link to='/login'><Button >LOGIN</Button></Link></Navbar.Brand>
                                ) : (
                                    <div>                                
                                    <Navbar.Brand>{userName}</Navbar.Brand>
                                    <Navbar.Brand><button className='btn user-btn' onClick={logout}>LOGOUT</button></Navbar.Brand>
                                    </div>
                                )
                            }
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>

            <div style={{height:"80%"}} className='d-flex flex-col justify-content-center align-items-center'>
                <div className='payment-card card'>
                        <div className='payment-details'>
                            <h5>Complete Payment</h5>
                            <p>Enter your credit or debit card details below</p>    
                            <div className='card-details'>
                                <input className='card-number' placeholder='Card Number'></input>
                                <input className='card-date' type="text" maxlength="4" placeholder="MM/YY" onChange={handleExpirationChange}></input>
                                <input className='card-cvc' type="text" maxlength="3" placeholder="CVC"></input>
                            </div>
                            <button className='btn submit-btn'>Confirm Payment</button>
                        </div>
                        <div className='order-summary'>
                            <h6>Order Summary</h6>
                            <table style={{margin:0}}>
                                <tr>
                                    <td>Plan Name</td>
                                    <td>Plan </td>
                                </tr>
                                <tr>
                                    <td>Billing Cycle</td>
                                    <td>Plan </td>
                                </tr>
                                <tr>
                                    <td>Plan Price</td>
                                    <td>Plan </td>
                                </tr>
                            </table>
                        </div>
                </div>
            </div>

        </>
    );
};

export default Payment;