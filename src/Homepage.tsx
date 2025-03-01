import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Homepage: React.FC = () => {
    return (
        <div className="homepage">
            <h1>Welcome to Encryption Tool</h1>
            <Link to="/RSA/RSA">
                <button>Go to RSA Encryption</button>
            </Link>
        </div>
    );
};

export default Homepage;
