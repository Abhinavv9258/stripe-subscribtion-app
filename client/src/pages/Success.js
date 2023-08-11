import React from 'react';
import firebase from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom';
import '../components/Payment.css'


const Success = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = React.useState("");
    const [sessionId, setSessionId] = React.useState("");

  React.useEffect(()=>{
    firebase.auth().onAuthStateChanged((user)=> {
      if(user){
        setUserId(user.uid)
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on('value', (snapshot) => {
          const user = snapshot.val();
          if(user){
            setSessionId(user.subscription.sessionId || "")
          }
        })
      }
    })

  }, [userId, sessionId]);

    const handlePaymentSuccess = () => {
        fetch("http://localhost:5000/api/v1/payment-success", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({sessionId: sessionId, firebaseId: userId})
        })
        .then(res => {
            if(res.ok){
                return res.json();
            }else{
                return res.json().then(json => Promise.reject(json));
            }
        })
        .then(data => {
            console.log(data.message);
            alert(data.message);
            navigate("/home");
        })
        .catch(e => {
            console.log(e.error);
        })
    }

    const handlePaymentCancel = () => {
        alert("Are you sure you want to cancel?")
        navigate('/cancel');
    }

    return (
        <>
            <div style={{height:"100%"}} className='success-page d-flex justify-content-center align-items-center'>
                <div className='success-card card'>
                <div className='card-header'>
                <h4 className='d-flex justify-content-center'>Current Plan Details &nbsp;<button className='active'>Active</button> </h4>
                <button className='cancel-btn btn' onClick={()=> handlePaymentCancel()}> Cancel</button>
                </div>
                <div className='card-body'>
                    <div className='success-payment-details'>
                        <h6> Premium </h6>
                        <p>Phone+Tablet+Computer+TV</p>
                        <h3>₹&nbsp;7,000/yr</h3>
                        <button className='btn success-btn' onClick={()=> handlePaymentSuccess()}>Change Plan</button>
                        <div className='card-footer'>
                            <p>Your subscription has started on Aug 08th 2023, and will soon auto renew on Sep 09th, 2023.</p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    );
};

export default Success;