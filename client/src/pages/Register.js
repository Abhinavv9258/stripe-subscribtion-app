import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
// import {
//     FormControl,
//     FormGroup,
//     InputLabel,
//     Input,
//     Button,
// } from '@material-ui/core';

// import firebase from '../firebase/firebaseConfig';
import firebase from '../firebase/firebaseConfig'

const Register = () => {

    // const [inputData, setInputData] = React.useState({ 
    //     name:'',
    //     email:'',
    //     password:'',
    // });

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

                await navigate('/');
            }
        }catch(error){
            console.log("Register error",error);
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
                                Create Account
                                </h5>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" 
                                    // value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
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
                                <Button type="submit" style={{"background-color":"#1f4d91"}}> Sign Up </Button>
                            </Form.Group>
                            <h7 class="widget-title" > Already have an account? <Link to='/login' style={{backgroundColor:"white"}}>Login</Link>  </h7>
                        </Form>
                    </div>
                </div> 
            </div>
        </>
    );
};

export default Register;