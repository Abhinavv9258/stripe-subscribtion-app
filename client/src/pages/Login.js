import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../firebase/firebaseConfig'
import '../components/Form.css'

const Login = () => {
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            if(!email || !password){
                console.log("Please fill all fields...")
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                console.log("Please provide a valid email...");
                return
            }

            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            if(response.user){
                setEmail("");
                setPassword("");

                await navigate('/home');
            }
        }catch(error){
            console.log("Login Error!",error);
        }
    }

    return (
        <>
            <div className='form-main-container'>
                <div className="form-card">
                    <div className="form-card-body">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <h5 className='form-title'>Login to your account</h5>
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" 
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox" style={{width:"100%"}}>
                                <Form.Check type="checkbox" label="Remember Me" required />
                            </Form.Group>
                            <Form.Group>
                                <button className='form-btn btn subscribe-btn' type="submit" style={{"background-color":"#1f4d91"}}> Login </button>
                            </Form.Group>
                            <h7 class="form-widget-title" > New to MyApp? &nbsp; <Link to='/' style={{backgroundColor:"white","text-decoration": "none",color:"#1f4d91"}}>Sign Up</Link>  </h7>
                        </Form>
                    </div>
                </div> 
            </div>
        </>
    );
};


export default Login;