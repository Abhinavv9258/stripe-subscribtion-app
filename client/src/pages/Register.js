import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Form.css'
import firebase from '../firebase/firebaseConfig'

const Register = () => {
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            if(!email || !password || !fullName){
                console.log("Please fill all fields...")
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                console.log("Please provide a valid email...");
                return
            }

            const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
            if(response.user){
                await response.user.updateProfile({
                    displayName: fullName
                })
                const uid = response.user.uid;
                const userRef = firebase.database().ref('users/'+ uid);
                await userRef.set({
                    uid:uid,
                    email:email,
                    username: fullName
                });
                setFullName("");
                setEmail("");
                setPassword("");

                await navigate('/home');
            }
        }catch(error){
            console.log("Register error",error);
        }
    }

    return (
        <>
            <div className='form-main-container'>
                <div className="form-card">
                    <div className="form-card-body">
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <h5 className='form-title'> Create Account </h5>
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" 
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
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
                                <button className='form-btn btn subscribe-btn' type="submit" style={{"background-color":"#1f4d91"}}> Sign Up </button>
                            </Form.Group>
                        </Form>
                    </div>
                    <h7 class="form-widget-title" > Already have an account? &nbsp; <Link to='/login' style={{backgroundColor:"white","text-decoration": "none",color:"#1f4d91"}}>Login</Link>  </h7>
                </div> 
            </div>
        </>
    );
};

export default Register;