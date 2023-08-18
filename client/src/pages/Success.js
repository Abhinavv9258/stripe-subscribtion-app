import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Payment.css'


const Success = () => {
    const navigate = useNavigate();

    React.useEffect(() => {

    }, []);

    const updatePlan = () => {
        navigate('/home')
    }

    const cancelPlan = () => {
        alert("Are you sure you want to cancel?")
        navigate('/cancel');
    }

    return (
        <>
            <div style={{ height: "100%" }} className='success-page d-flex justify-content-center align-items-center'>
                <div className='success-card card'>
                    <div className='card-header'>
                        <h4 className='d-flex justify-content-center'>Current Plan Details &nbsp;<button className='active'>Active</button> </h4>
                        <button className='cancel-btn btn' onClick={() => cancelPlan()}> Cancel</button>
                    </div>
                    <div className='card-body'>
                        <div className='success-payment-details'>
                            <h6>Premium</h6>
                            <p>Phone+Tablet+Computer+TV</p>
                            <h3>₹&nbsp;7,000/yr</h3>
                            <button className='btn success-btn' onClick={() => updatePlan()}>Change Plan</button>
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