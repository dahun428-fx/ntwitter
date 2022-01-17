import React from 'react';
import { HashRouter as Router, Route, Routes, } from 'react-router-dom';

import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'Components/Navigation';

function _router(props){
    
    return (
        <Router>
            { props.isLoggedIn && <Navigation User={props.User} />}
            <Routes style={{
                    maxWidth: 890,
                    width: "100%",
                    margin: "0 auto",
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                  }}>
                { props.isLoggedIn ? 
                <>
                    <Route exact path="/" element={<Home User={props.User} />} />
                    <Route exact path="/profile" element={<Profile refreshUser={props.refreshUser} User={props.User}/>} />
                </>
                :
                    <Route exact path="/" element={<Auth />} />
                }
            </Routes>
        </Router>
    );
}

export default _router;