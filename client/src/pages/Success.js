import React from 'react';
import firebase from '../firebase/firebaseConfig'
import { useNavigate } from 'react-router-dom';

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
            navigate("/");
        })
        .catch(e => {
            console.log(e.error);
        })
    }
    return (
        <div>
            Success
            <button onClick={()=> handlePaymentSuccess()}> Payment</button>
        </div>
    );
};

export default Success;