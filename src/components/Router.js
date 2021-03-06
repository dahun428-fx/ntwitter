import React, {useState} from 'react';
import { Navigate, HashRouter as Router, Route, Routes, } from 'react-router-dom';

import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';

function _router(props){
    
    return (
        <Router>
            { props.isLoggedIn && <Navigation />}
            <Routes>
                { props.isLoggedIn ? 
                <>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/profile" element={<Profile />} />
                </>
                :
                    <Route exact path="/" element={<Auth />} />
                }
            </Routes>
        </Router>
    );
}

export default _router;