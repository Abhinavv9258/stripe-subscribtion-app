import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import firebase from '../firebase/firebaseConfig'

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

                await navigate('/');
            }
        }catch(error){
            console.log("Login Error!",error);
        }
    }

    return (
        <>
            <div style={{height:"100%"}} className='main d-flex justify-content-center align-items-center'>
                <div className="card p-5" style={{"border":"2px","border-radius":"25px"}}>
                    <div className="card-body">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <h5 style={{"margin-bottom": "20px"}}> 
                                Login to your account
                                </h5>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" 
                                    // value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" 
                                    // value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox" style={{width:"100%"}}>
                                <Form.Check type="checkbox" label="Remember Me" />
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" style={{"background-color":"#1f4d91"}}> Login </Button>
                            </Form.Group>
                            <h7 class="widget-title" > New to MyApp <Link to='/register' style={{backgroundColor:"white"}}>Sign Up</Link>  </h7>
                        </Form>
                    </div>
                </div> 
            </div>
        </>
    );
};


export default Login;