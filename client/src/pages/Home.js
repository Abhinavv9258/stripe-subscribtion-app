import React from 'react';
import {useState, useEffect} from 'react';
import firebase from '../firebase/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {Link, useNavigate}  from 'react-router-dom'
const Home = () => {
    const navigate = useNavigate();
    const data = [
        {
            id: 1,
            plan:"Mobile",
            monthlyPrice:"Rs. 100",
            yearlyPrice:"Rs. 1000",
            videoQuality:"Good",
            resolution:"480p",
            devices:[" ","Phone","Tablet"]
        },
        {
            id: 2,
            plan:"Basic",
            monthlyPrice:"Rs. 200",
            yearlyPrice:"Rs. 2000",
            videoQuality:"Good",
            resolution:"480p",
            devices:[" ","Phone","Tablet","Computer","TV"]
        },
        {
            id: 3,
            plan:"Standard",
            monthlyPrice:"Rs. 500",
            yearlyPrice:"Rs. 5000",
            videoQuality:"Better",
            resolution:"1080p",
            devices:[" ","Phone","Tablet","Computer","TV"]
        },
        {
            id: 4,
            plan:"Premium",
            monthlyPrice:"Rs. 700",
            yearlyPrice:"Rs. 7000",
            videoQuality:"Best",
            resolution:"4K+HDR",
            devices:[" ","Phone","Tablet","Computer","TV"]
        }
    ]

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                setUserId(user.uid);
                setUserName(user.displayName);
            }else{
                setUserId("");
                setUserName("");
            }
        })
    },[userId]);

    const logout = async() => {
        firebase.auth().signOut();
        navigate('/login');
    }
    

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
                                    <Navbar.Brand><Button onClick={logout}>LOGOUT</Button></Navbar.Brand>
                                    </div>
                                )
                            }
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
            <div className='d-flex justify-content-center' style={{"background-color":"white","display":"flex"}}>
            <div className='p-3' style={{width:"275px",cursor:"default"}}>
                <div className='p-3'>
                    Monthly
                </div>
                <div className='p-3'>
                    Monthly Price
                </div>
                <div className='p-3'>
                    Video Quality
                </div>
                <div className='p-3'>
                    Resolution
                </div>
                <div className='p-3'> 
                    Devices you can use to watch
                </div>
            </div>
            
                {data.map((item, index) => (
                    <div>
                        <div className='p-3' key={index} style={{cursor:"default"}}>
                        <div className='p-3' style={{width:"100px",cursor:"pointer"}}>{item.plan}</div>
                        <div className='p-3'>{item.monthlyPrice}</div>
                        <div className='p-3'>{item.videoQuality}</div>
                        <div className='p-3'>{item.resolution}</div>
                        <div>{item.devices.map((it,idx) => (
                            <div className='p-3' key={idx}>
                                <div>{it}</div>
                            </div>
                            ))}
                        </div>
                        </div>
                    </div>

                ))}
            </div>
        </>
    );
};

export default Home;