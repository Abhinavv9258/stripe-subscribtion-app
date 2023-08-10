import React,{useState, useEffect} from 'react';
import firebase from '../firebase/firebaseConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import {Link, useNavigate}  from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [planName, setPlanName] = useState("");

    const data = [
        {
            id: 1,
            plan:"Mobile",
            monthlyPrice:"100",
            yearlyPrice:"1000",
            videoQuality:"Good",
            resolution:"480p",
            devices:["Phone","Tablet"]
        },
        {
            id: 2,
            plan:"Basic",
            monthlyPrice:"200",
            yearlyPrice:"2000",
            videoQuality:"Good",
            resolution:"480p",
            devices:["Phone","Tablet","Computer","TV"]
        },
        {
            id: 3,
            plan:"Standard",
            monthlyPrice:"500",
            yearlyPrice:"5000",
            videoQuality:"Better",
            resolution:"1080p",
            devices:["Phone","Tablet","Computer","TV"]
        },
        {
            id: 4,
            plan:"Premium",
            monthlyPrice:"700",
            yearlyPrice:"7000",
            videoQuality:"Best",
            resolution:"4K+HDR",
            devices:["Phone","Tablet","Computer","TV"]
        }
    ]


    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
                setUserName(user.displayName);
                const userRef = firebase.database().ref("users/" + user.uid);
                userRef.on("value", (snapshot) => {
                    const user = snapshot.val();
                    if (user) {
                        setPlanName(user.subscription.planName || "");
                    }
                });
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
    


    return (
        <>
            <Navbar expand="lg" className="main-navbar bg-body-tertiary sticky-lg-top" >
                <Container>
                    <Navbar id="basic-navbar-nav">
                        <Nav>
                            <Navbar.Brand><Link to='/dashboard'>Stripe</Link></Navbar.Brand>
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
            <div className='container'>
                <div>
                {data.map((item, index) => (
                    <div>
                        {planName === item.plan ? (
                                <button>Data</button>
                            ) : (
                                <button hidden>No data</button>
                        )}
                    </div>
                ))}
                </div>
            </div>  
        </>
    );
};

export default Dashboard;