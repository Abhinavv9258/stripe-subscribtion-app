import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import '../components/Form.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {URL} from '../App';


const Register = () => {
    const navigate = useNavigate();
    const [inputData, setInputData] = React.useState({ 
        name:'',
        email:'',
        password:'',
    });
    const [showPassword, setShowPassword] = React.useState(false);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{7,15}$/;
        if(!inputData.name || (!inputData.email && !inputData.password)){
            toast.warning('Please enter your credentials.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }else if(!inputData.email){
            toast.warning('Please enter your email.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }else if(!inputData.password){
            toast.warning('Please enter your password.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }else if(!emailRegex.test(inputData.email)){
            toast.warning('Please provide a valid email.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }else if(!passwordRegex.test(inputData.password)){ //
            console.log(inputData.password);
            toast.warning('Password must contain at least one digit, one lowercase letter, one uppercase letter and one special character.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }else if(inputData.password.length < 8 || inputData.password.length > 15 ){
            toast.warning('Password must be greater than 8 and less than 15.', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            return
        }
        try{
            const data = await fetch(`${URL}/user/register`, {
                method: 'POST',
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    inputData
                )
            });

            const res = await data.json();
            if (res.status === 422){
                toast.error('User already exist, try different email!', {
                    position: toast.POSITION.TOP_RIGHT, // Set the toast position
                    autoClose: 3000, // Close the toast after 3 seconds
                });
            }else if(res.status === 201){
                toast.success('Account registered successfully.', {
                    position: toast.POSITION.TOP_RIGHT, // Set the toast position
                    autoClose: 3000, // Close the toast after 3 seconds
                });
                navigate('/login');
            }else{
                toast.error('Register error, please try again!', {
                    position: toast.POSITION.TOP_RIGHT, // Set the toast position
                    autoClose: 3000, // Close the toast after 3 seconds
                });
            }
        }catch(error){
            toast.error('Server error, please try again later!', {
                position: toast.POSITION.TOP_RIGHT, // Set the toast position
                autoClose: 3000, // Close the toast after 3 seconds
            });
            console.log("Server error : ",error);
        }
    }
    

    const handleChange = (e) => {
        const {name,value} = e.target;
        setInputData({...inputData,[name]:value});
    }


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <>
            <div className='form-main-container'>
                <div className="form-card">
                    <div className="form-card-body">
                        <Form>
                            <Form.Group>
                                <h5 className='form-title'> Create Account </h5>
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name" name="name"
                                    value={inputData.name} onChange={handleChange}
                                    
                                />
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" placeholder="Email" name="email"
                                    value={inputData.email} onChange={handleChange}
                                    
                                />
                            </Form.Group>
                            <Form.Group className='form-details' controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control placeholder="Password" name="password"
                                        type={showPassword ? 'text' : 'password'} 
                                        value={inputData.password} onChange={handleChange}
                                    />
                                    <InputGroup.Text className="password-toggle" onClick={togglePasswordVisibility}>
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}/>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox" style={{width:"100%"}}>
                                <Form.Check type="checkbox" label="Remember Me"  required/>
                            </Form.Group>
                            <Form.Group>
                                <button onClick={handleSubmit} className='form-btn btn subscribe-btn' type="submit" style={{backgroundColor:"#1f4d91"}}> Sign Up </button>
                            </Form.Group>
                            <ToastContainer /> {/* This component is required for the toast notifications */}
                        </Form>
                    </div>
                    <p className="form-widget-title text-dark" > Already have an account? &nbsp; <Link to='/login' style={{backgroundColor:"white",textDecoration: "none",color:"#1f4d91"}}>Login</Link>  </p>
                </div> 
            </div>
        </>
    );
};

export default Register;