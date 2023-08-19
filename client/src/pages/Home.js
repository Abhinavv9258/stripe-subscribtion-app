import React from 'react';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Home.css';
import { URL } from '../App';
import { toast } from 'react-toastify';


// const Home = () => {
//     const data = [
//         {
//             id: 1,
//             plan:"Mobile",
//             monthlyPrice:"100",
//             yearlyPrice:"1000",
//             videoQuality:"Good",
//             resolution:"480p",
//             devices:["Phone","Tablet"]
//         },
//         {
//             id: 2,
//             plan:"Basic",
//             monthlyPrice:"200",
//             yearlyPrice:"2000",
//             videoQuality:"Good",
//             resolution:"480p",
//             devices:["Phone","Tablet","Computer","TV"]
//         },
//         {
//             id: 3,
//             plan:"Standard",
//             monthlyPrice:"500",
//             yearlyPrice:"5000",
//             videoQuality:"Better",
//             resolution:"1080p",
//             devices:["Phone","Tablet","Computer","TV"]
//         },
//         {
//             id: 4,
//             plan:"Premium",
//             monthlyPrice:"700",
//             yearlyPrice:"7000",
//             videoQuality:"Best",
//             resolution:"4K+HDR",
//             devices:["Phone","Tablet","Computer","TV"]
//         }
//     ]
//     const [userId, setUserId] = useState("");
//     const [userName, setUserName] = useState("");

//     const [selectedPlan] = useState(data);
//     const [planPrice, setPlanPrice] = useState(true);

//     const [selectedButton, setSelectedButton] = useState(null);
//     const [position, setPosition] = useState(0);
//     const [selectedColumn, setSelectedColumn] = useState(null);
//     const [selectedDetails, setSelectedDetails] = useState(null);
//     const [planId, setPlanId] = useState(0);

//     const navigate = useNavigate();

//     useEffect(() => {
//         firebase.auth().onAuthStateChanged((user) => {
//             if (user) {
//                 setUserId(user.uid);
//                 setUserName(user.displayName);
//             } else {
//                 setUserId("");
//                 setUserName("");
//             }
//         });
//         setPosition(10);
//         setSelectedButton('left');
//         setSelectedColumn('mobile');
//         setSelectedDetails('mobile');   
//     }, [userId]);

//     const checkout = (plan) => {
//         fetch("http://localhost:5000/api/v1/create-subscription-checkout-session", {
//             method: "POST",
//             headers: {
//                 "Content-Type" : "application/json",
//             },
//             mode: "cors",
//             body: JSON.stringify({plan: plan, customerId: userId}),
//         })
//         .then((res) => {
//             if(res.ok) return res.json();
//             console.log(res);
//             return res.json().then((json) => Promise.reject(json));
//         })
//         .then(({session}) => {
//             window.location = session.url;
//         })
//         .catch((e) => {
//             console.log(e);
//         })
//     }

//     const handleToggle = (newValue) => {
//         setPlanPrice(newValue);
//     };

//     const logout = async() => {
//         firebase.auth().signOut();
//         navigate('/login');
//     }

// // extra 
//     const monthlyClick = () => {
//         setPosition(10);
//         handleToggle(true);
//         setSelectedButton('left');
//     };

//     const yearlyClick = () => {
//         setPosition(110);
//         handleToggle(false);
//         setSelectedButton('right');
//     };

//     const handleMobileCell = () => {
//         setSelectedColumn('mobile');
//         setSelectedDetails('mobile'); 
//         setPlanId(0);
//     };

//     const handleBasicCell = () => {
//         setSelectedColumn('basic');
//         setSelectedDetails('basic');
//         setPlanId(1);  
//     };
//     const handleStandardCell = () => {
//         setSelectedColumn('standard');
//         setSelectedDetails('standard');
//         setPlanId(2);  
//     };
//     const handlePremiumCell = () => {
//         setSelectedColumn('premium');
//         setSelectedDetails('premium');
//         setPlanId(3);  
//     };

//     return (
//         <>
//             <Navbar expand="lg" className="main-navbar bg-body-tertiary sticky-lg-top" style={{width:"100%"}} >
//                 <Container style={{width:"100%"}}>
//                     <Navbar id="basic-navbar-nav" style={{width:"100%"}}>
//                         <Nav  style={{width:"100%",display:"flex",justifyContent:"center"}}>
//                             {
//                                 !userId ? (
//                                     <Navbar.Brand><Link to='/login'><Button >LOGIN</Button></Link></Navbar.Brand>
//                                 ) : (
//                                     <div style={{width:"80%",display:"flex",justifyContent:"space-between"}}>                                
//                                     <Navbar.Brand>{userName}</Navbar.Brand>
//                                     <Navbar.Brand><button className='btn user-btn' onClick={logout}>LOGOUT</button></Navbar.Brand>
//                                     </div>
//                                 )
//                             }
//                         </Nav>
//                     </Navbar>
//                 </Container>
//             </Navbar>
//             <div className='d-flex flex-col justify-content-center align-items-center'>
//                 <div className='card d-flex flex-column justify-content-center align-items-center' style={{backgroundColor:"white"}}>
//                     <h3>Choose the right plan for you</h3>
//                     <table className='p-3'>
//                         <thead className='table-head'>
//                             <tr>
//                                 <th>   
//                                     <div className="form-box">
//                                         <div className="button-box">
//                                             <div id="btn" style={{ left: position }}></div>
//                                             <button type="button" 
//                                             style={{width:"50%",display: "flex",justifyContent: "center",alignItems:"center"}} 
//                                             className={`toggle-btn ${selectedButton === 'left' ? 'selected' : ''}`} 
//                                             onClick={monthlyClick}>
//                                                 Monthly
//                                             </button>
//                                             <button type="button" style={{width:"50%","display": "flex",justifyContent: "center",alignItems:"center"}} className={`toggle-btn ${selectedButton === 'right' ? 'selected' : ''}`} onClick={yearlyClick}>
//                                                 Yearly
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </th>
//                                 <th 
//                                 ><div className={`plan-container ${selectedColumn === 'mobile' ? 'selected' : ''}`} onClick={handleMobileCell} >Mobile</div>
//                                 </th>
//                                 <th 
//                                  >
//                                  <div className={`plan-container ${selectedColumn === 'basic' ? 'selected' : ''}`} onClick={handleBasicCell} >Basic</div>
//                                  </th>
//                                 <th 
//                                 >
//                                 <div className={`plan-container ${selectedColumn === 'standard' ? 'selected' : ''}`} onClick={handleStandardCell} >Standard</div>
//                                 </th>
//                                 <th 
//                                 >
//                                 <div className={`plan-container ${selectedColumn === 'premium' ? 'selected' : ''}`} onClick={handlePremiumCell} >Premium</div>
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                         <tr className='price-details'>
//                             {planPrice ? <td  className='price'>Monthly Price</td> : <td className='price'>Yearly Price</td>}                    
//                             <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[0].monthlyPrice : selectedPlan[0].yearlyPrice}</td>
//                             <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[1].monthlyPrice : selectedPlan[1].yearlyPrice}</td>
//                             <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[2].monthlyPrice : selectedPlan[2].yearlyPrice}</td>
//                             <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[3].monthlyPrice : selectedPlan[3].yearlyPrice}</td>
//                         </tr>
//                         <tr className='video-details'>
//                             <td className='video'>Video Quality</td>
//                             <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Good</td>
//                             <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Good</td>
//                             <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Better</td>
//                             <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Best</td>

//                         </tr>
//                         <tr className='resolution-details'>
//                             <td className='resolution'>Resolution</td>
//                             <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>480p</td>
//                             <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>480p</td>
//                             <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>1080p</td>
//                             <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>4K+HDR</td>
//                         </tr>
//                         <tr>
//                             <td className='devices'>Devices you can use to watch</td>
//                             <td className={`device-details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
//                             <td className={`device-details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}></td>
//                             <td className={`device-details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}></td>
//                             <td className={`device-details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}></td>
//                         </tr>
//                         <tr>
//                             <td></td>
//                             <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Phone</td>
//                             <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Phone</td>
//                             <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Phone</td>
//                             <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Phone</td>
//                         </tr>
//                         <tr>
//                             <td></td>
//                             <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Tablet</td>
//                             <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Tablet</td>
//                             <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Tablet</td>
//                             <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Tablet</td>
//                         </tr>
//                         <tr>
//                             <td></td>
//                             <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
//                             <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Computer</td>
//                             <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Computer</td>
//                             <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Computer</td>
//                         </tr>
//                         <tr>
//                             <td></td>
//                             <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
//                             <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>TV</td>
//                             <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>TV</td>
//                             <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>TV</td>
//                         </tr>
//                         </tbody>
//                     </table>
//                     <button className='btn subscribe-btn'

//                     onClick={() => checkout(Number(planPrice ? selectedPlan[planId].monthlyPrice : selectedPlan[planId].yearlyPrice))}
//                     >Next</button>
//                 </div>
//             </div>
//         </>
//     );
// };

const Home = () => {
    const data = [
        {
            id: 1,
            plan: "Mobile",
            monthlyPrice: "100",
            yearlyPrice: "1000",
            videoQuality: "Good",
            resolution: "480p",
            devices: ["Phone", "Tablet"]
        },
        {
            id: 2,
            plan: "Basic",
            monthlyPrice: "200",
            yearlyPrice: "2000",
            videoQuality: "Good",
            resolution: "480p",
            devices: ["Phone", "Tablet", "Computer", "TV"]
        },
        {
            id: 3,
            plan: "Standard",
            monthlyPrice: "500",
            yearlyPrice: "5000",
            videoQuality: "Better",
            resolution: "1080p",
            devices: ["Phone", "Tablet", "Computer", "TV"]
        },
        {
            id: 4,
            plan: "Premium",
            monthlyPrice: "700",
            yearlyPrice: "7000",
            videoQuality: "Best",
            resolution: "4K+HDR",
            devices: ["Phone", "Tablet", "Computer", "TV"]
        }
    ]

    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");

    const [selectedPlan] = useState(data);
    const [planPrice, setPlanPrice] = useState(true);

    const [selectedButton, setSelectedButton] = useState(null);
    const [position, setPosition] = useState(0);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [planId, setPlanId] = useState(0);

    const [sessionId, setSessionId] = React.useState("");

    const navigate = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("userDataToken");
        const res = await fetch(`${URL}/user/validate`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        })
        const data = await res.json();
        if(data.status === 500 || !data){
            console.log("error");
            // navigate('*');
        } else {
            setUserId(data.ValidUserOne._id);
            setUserName(data.ValidUserOne.name);
            setSessionId(token);
            navigate('/home');
        }
    }

    useEffect(() => {
        DashboardValid();
        setPosition(10);
        setSelectedButton('left');
        setSelectedColumn('mobile');
        setSelectedDetails('mobile');
    }, []);

    const checkout = async(plan) => {
        await fetch(`${URL}/api/v1/create-subscription-checkout-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            mode: "cors",
            body: JSON.stringify({ plan: plan, userId: userId }),
        })
            .then((res) => {
                if (res.ok) return res.json();
                console.log(res);
                return res.json().then((json) => Promise.reject(json));
            })
            .then(({ session }) => {
                // window.location = session.url;
                
                navigate(session.url);
            })
            .catch((e) => {
                console.log("error: ",e);
            })
    }

    const handleToggle = (newValue) => {
        setPlanPrice(newValue);
    };

    const logout = async () => {
        let token = localStorage.getItem("userDataToken");
        const res = await fetch(`${URL}/user/logout`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
                Accept: "application/json",
            },
            credentials: "include"
        });

        const data = await res.json();

        if (data.status === 201) {
            toast.success('User successfully logged out.', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
            let token = localStorage.removeItem('userDataToken');
            setUserId(false);
            setUserName(false);
            navigate('/');
        } else {
            console.log("error");
            toast.warning('Error', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    }

    // extra 
    const monthlyClick = () => {
        setPosition(10);
        handleToggle(true);
        setSelectedButton('left');
    };

    const yearlyClick = () => {
        setPosition(110);
        handleToggle(false);
        setSelectedButton('right');
    };

    const handleMobileCell = () => {
        setSelectedColumn('mobile');
        setSelectedDetails('mobile');
        setPlanId(0);
    };

    const handleBasicCell = () => {
        setSelectedColumn('basic');
        setSelectedDetails('basic');
        setPlanId(1);
    };
    const handleStandardCell = () => {
        setSelectedColumn('standard');
        setSelectedDetails('standard');
        setPlanId(2);
    };
    const handlePremiumCell = () => {
        setSelectedColumn('premium');
        setSelectedDetails('premium');
        setPlanId(3);
    };

    return (
        <>
            <Navbar expand="lg" className="main-navbar bg-body-tertiary sticky-lg-top" style={{ width: "100%" }} >
                <Container style={{ width: "100%" }}>
                    <Navbar id="basic-navbar-nav" style={{ width: "100%" }}>
                        <Nav style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            {
                                !userId ? (
                                    <Navbar.Brand><Link to='/login'><button className='btn user-btn'>LOGIN</button></Link></Navbar.Brand>
                                ) : (
                                    <div style={{ width: "80%", display: "flex", justifyContent: "space-between" }}>
                                        <Navbar.Brand className='d-flex align-items-center' style={{ textTransform: 'capitalize' }}>{userName.split(' ')[0]}</Navbar.Brand>
                                        <Navbar.Brand><button className='btn user-btn' onClick={logout}>LOGOUT</button></Navbar.Brand>
                                    </div>
                                )
                            }
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
            <div className='d-flex flex-col justify-content-center align-items-center'>
                <div className='card d-flex flex-column justify-content-center align-items-center' style={{ backgroundColor: "white" }}>
                    <h3>Choose the right plan for you</h3>
                    <table className='p-3'>
                        <thead className='table-head'>
                            <tr>
                                <th>
                                    <div className="form-box">
                                        <div className="button-box">
                                            <div id="btn" style={{ left: position }}></div>
                                            <button type="button"
                                                style={{ width: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}
                                                className={`toggle-btn ${selectedButton === 'left' ? 'selected' : ''}`}
                                                onClick={monthlyClick}>
                                                Monthly
                                            </button>
                                            <button type="button" style={{ width: "50%", "display": "flex", justifyContent: "center", alignItems: "center" }} className={`toggle-btn ${selectedButton === 'right' ? 'selected' : ''}`} onClick={yearlyClick}>
                                                Yearly
                                            </button>
                                        </div>
                                    </div>
                                </th>
                                <th
                                ><div className={`plan-container ${selectedColumn === 'mobile' ? 'selected' : ''}`} onClick={handleMobileCell} >Mobile</div>
                                </th>
                                <th
                                >
                                    <div className={`plan-container ${selectedColumn === 'basic' ? 'selected' : ''}`} onClick={handleBasicCell} >Basic</div>
                                </th>
                                <th
                                >
                                    <div className={`plan-container ${selectedColumn === 'standard' ? 'selected' : ''}`} onClick={handleStandardCell} >Standard</div>
                                </th>
                                <th
                                >
                                    <div className={`plan-container ${selectedColumn === 'premium' ? 'selected' : ''}`} onClick={handlePremiumCell} >Premium</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='price-details'>
                                {planPrice ? <td className='price'>Monthly Price</td> : <td className='price'>Yearly Price</td>}
                                <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[0].monthlyPrice : selectedPlan[0].yearlyPrice}</td>
                                <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[1].monthlyPrice : selectedPlan[1].yearlyPrice}</td>
                                <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[2].monthlyPrice : selectedPlan[2].yearlyPrice}</td>
                                <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>₹&nbsp;{planPrice ? selectedPlan[3].monthlyPrice : selectedPlan[3].yearlyPrice}</td>
                            </tr>
                            <tr className='video-details'>
                                <td className='video'>Video Quality</td>
                                <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Good</td>
                                <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Good</td>
                                <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Better</td>
                                <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Best</td>

                            </tr>
                            <tr className='resolution-details'>
                                <td className='resolution'>Resolution</td>
                                <td className={`mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>480p</td>
                                <td className={`basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>480p</td>
                                <td className={`standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>1080p</td>
                                <td className={`premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>4K+HDR</td>
                            </tr>
                            <tr>
                                <td className='devices'>Devices you can use to watch</td>
                                <td className={`device-details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
                                <td className={`device-details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}></td>
                                <td className={`device-details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}></td>
                                <td className={`device-details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Phone</td>
                                <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Phone</td>
                                <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Phone</td>
                                <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Phone</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}>Tablet</td>
                                <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Tablet</td>
                                <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Tablet</td>
                                <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Tablet</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
                                <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>Computer</td>
                                <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>Computer</td>
                                <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>Computer</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td className={`details mobile-details ${selectedDetails === 'mobile' ? 'selected' : ''}`}></td>
                                <td className={`details basic-details ${selectedDetails === 'basic' ? 'selected' : ''}`}>TV</td>
                                <td className={`details standard-details ${selectedDetails === 'standard' ? 'selected' : ''}`}>TV</td>
                                <td className={`details premium-details ${selectedDetails === 'premium' ? 'selected' : ''}`}>TV</td>
                            </tr>
                        </tbody>
                    </table>
                    <button className='btn subscribe-btn'
                        onClick={() => checkout(Number(planPrice ? selectedPlan[planId].monthlyPrice : selectedPlan[planId].yearlyPrice))}
                    >Next</button>
                </div>
            </div>
        </>
    );
};

export default Home;