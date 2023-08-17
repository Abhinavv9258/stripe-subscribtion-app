import React from 'react';

const Info = ({user}) => {
    return (
        <div>
           <div>Welcome, {user.name}!</div>;
        </div>
    );
};

export default Info;