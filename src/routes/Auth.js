import axios from 'axios';
import AuthForm from 'Components/AuthForm';
import Popup from 'Components/common/Popup';
import { authService } from 'fbInstance';
import { loginWithGithub } from 'github-oauth-popup';
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

function Auth(){

    const [ ClickState, setClickState ] = useState("");  
    const onClickHandler = (e) => {
        setClickState(e);
    }
    return (
        <div className="authContainer">
            <FontAwesomeIcon
                icon={faTwitter}
                color={"#04AAFF"}
                size="3x"
                style={{ marginBottom: 30 }}
            />
            <AuthForm ClickState={ClickState} />
            <div  className="authBtns">
                <button name="google" className="authBtn" onClick={onClickHandler}>Continue with Google <FontAwesomeIcon icon={faGoogle} /></button>
                <button name="github" className="authBtn" onClick={onClickHandler}>Continue with Github  <FontAwesomeIcon icon={faGithub} /></button>
                <button name="facebook" className="authBtn" onClick={onClickHandler}>Continue with Facebook</button>
            </div>
            
        </div>
    )
}
export default Auth;