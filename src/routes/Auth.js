import axios from 'axios';
import Popup from 'components/common/Popup';
import { authService } from 'fbInstance';
import { loginWithGithub } from 'github-oauth-popup';
import React, { useState } from 'react';

function Auth(){

    const [ Email, setEmail ] = useState("");
    const [ Password, setPassword ] = useState("");
    const [ PasswordCofirm, setPasswordCofirm ] = useState(""); 
    const [ SignInChkBox, setSignInChkBox ] = useState(false);
    const [ NewAccount, setNewAccount ] = useState(false);
    const [ HasError, setHasError ] = useState(false);
    const [ ErrorMsg, setErrorMsg ] = useState("");
    const [ SubmitBtnLoading, setSubmitBtnLoading ] = useState(false);

    const [ ModalOpen, setModalOpen ] = useState(false);
    const [ PromptUserPwd, setPromptUserPwd ] = useState(""); 

    const [ ModalError, setModalError ] = useState(false);
    const [ ModalErrorMsg, setModalErrorMsg ] = useState("");

    const [ ProviderEmail, setProviderEmail ] = useState("");
    const [ ProviderAccessToken, setProviderAccessToken ] = useState("");
    const [ ProviderId, setProviderId ] = useState("");
    const [ ModalTitle, setModalTitle ] = useState("");

    const onChangeHanlder = (e) => {
        let {target : {name, value}} = e;
        switch(name){
            case "email" :
                setEmail(value);
                break;
            case "password" :
                setPassword(value);
                break;
            case "password_confirm" :
                setPasswordCofirm(value);
                confirmPassword(Password, value);
                break;
            case "signIn" :
                setSignInChkBox(!SignInChkBox);
                setNewAccount(!SignInChkBox);
                break;
            case "modalPwd" :
                setPromptUserPwd(value);
                break;
            default :
                break;
        }
    }
    const confirmPassword = (password, confirmPassword) => {
        if(password === confirmPassword){
            setHasError(false);
            setErrorMsg("");
        } else {
            setHasError(true);
            setErrorMsg("??????????????? ???????????? ??????????????????");
        }
    }
    const onSubmitHanlder = async (e) => {
        e.preventDefault();
        setSubmitBtnLoading(true);
        try{
            if(NewAccount){
                confirmPassword(Password, PasswordCofirm);
                if(HasError){
                    return false;
                }
                //create new account
                await authService.createUserWithEmailAndPassword(authService.getAuth() ,Email, Password);
            } else {
                //log in
                await authService.signInWithEmailAndPassword(authService.getAuth(), Email, Password);
            }
        } catch(err) {
            let message = printError(err);
            setErrorMsg(message);
            setHasError(true);
            setSubmitBtnLoading(false);

        }
    }
    const onSubmitHanlderModal = (e) => {
        e.preventDefault();
        setModalError(false);
        setModalErrorMsg("");
        return pendingLogin(PromptUserPwd);
    }
    const getProvider = (providerId) => {
        let provider;
        switch(providerId){
            case authService.GoogleAuthProvider.PROVIDER_ID :
                provider = new authService.GoogleAuthProvider();
                provider.addScope('Profile');
                provider.addScope('email');
                return provider;
            case authService.FacebookAuthProvider.PROVIDER_ID :
                provider = new authService.FacebookAuthProvider();
                provider.addScope('email');
                return provider;
            case authService.GithubAuthProvider.PROVIDER_ID :
                provider = new authService.GithubAuthProvider();
                provider.addScope('repo');
                provider.addScope('read:user');
                return provider;
            default :
                break;
        }
    }
    const getCredentialResult = (result, providerId) => {
        switch (providerId) {
            case authService.GoogleAuthProvider.PROVIDER_ID :
                return authService.GoogleAuthProvider.credentialFromResult(result);
            case authService.GithubAuthProvider.PROVIDER_ID :
                return authService.GithubAuthProvider.credentialFromResult(result);
            case authService.FacebookAuthProvider.PROVIDER_ID :
                return authService.FacebookAuthProvider.credentialFromResult(result);
            default :
                break;
        }
    }
    const onClickHandler = async (e) => {
        setErrorMsg("");
        const auth = authService.getAuth();
        let { target : {name}} = e;
        let providerId, provider, result, user, credential, token = null;
        try {
            switch(name){
                case "google" :
                    providerId = authService.GoogleAuthProvider.PROVIDER_ID;
                    provider = getProvider(providerId);
                    break;
                case "facebook" :
                    providerId = authService.FacebookAuthProvider.PROVIDER_ID;
                    provider = getProvider(providerId);
                    break;
                case "github" :
                    providerId = authService.GithubAuthProvider.PROVIDER_ID;
                    provider = getProvider(providerId);
                    break;
                    // return githubLogin();
                default :
                    break;
            }
            result = await authService.signInWithPopup(auth, provider).then((res)=>{console.log(res)});
            // user = result.user;
            // credential = getCredentialResult(result, providerId);
            // token = credential.accessToken;
        } catch (err){
            console.log(err);
            let message = printError(err);
            setHasError(true);
            setErrorMsg(message);
            if(err.customData && err.code !== 'auth/account-exists-with-different-credential'){
                const email = err.customData.email;
                const accesstoken = err.customData._tokenResponse.oauthAccessToken;
                const providerId = err.customData._tokenResponse.providerId;
                setProviderEmail(email);
                setProviderAccessToken(accesstoken);
                setProviderId(providerId);
                setModalTitle(`${providerId} ??????????????? ?????????????????? ????????????`);
                firebaseFetchSignInMethodsForEmail(email);
            }

        }
    }
    
    const firebaseFetchSignInMethodsForEmail = async (email) => {
        const auth = authService.getAuth();
        const methods = await authService.fetchSignInMethodsForEmail(auth,email);
        console.log(methods[0]);
        if(methods[0] === 'password'){
            showModal();
        }
    }
    const printError = (error) => {
            let message;
            switch(error.code){
                case "auth/user-not-found" :
                    message = "???????????? ?????? ??????????????? ??????????????? ????????????.";
                    return message;
                case "auth/wrong-password" :
                    message = "???????????? ?????? ??????????????? ??????????????? ????????????."; 
                    return message;
                case "auth/too-many-requests":
                    message = "??????????????? ?????? ????????? ????????????. ????????? ?????? ??????????????????.";
                    return message;
                case "auth/email-already-in-use":
                    message = "?????? ???????????? ???????????????.";
                    return message;
                case "auth/account-exists-with-different-credential" :
                    message = "?????? ???????????? ?????? ?????????????????? ???????????????.";
                    return message;
                default :
                    return message;
            }
    }
    const githubLogin = async () => {
        const SERVER_GIT_URL = `http://localhost:5000/api/login/github`;
        let clientId = 'cf8e11d14d3938f79fac';
        let params = {client_id : clientId, scope : ['read:user,user:email']};
        const auth = authService.getAuth();
        
            try{
                //pop ?????? git oauth login
                const accesstoken = await loginWithGithub(params).then( async (res) => { 
                    let code = res.code;
                    // //server ????????? git accesstoken get
                    let accesstoken = await axios.post(`${SERVER_GIT_URL}/auth/accessToken`,{code}).then((res)=>{return res.data.accesstoken});
                    return accesstoken;
                });
                localStorage.setItem('git_accesstoken', accesstoken);
                // //firebase credential ??? ??????
                const credential = await authService.GithubAuthProvider.credential(accesstoken);
                // //git oauth ????????? ???????????? ??? ?????????
                return await authService.signInWithCredential(auth, credential).then((result)=>{return result});
                
            } catch(error){
                //?????? ????????? git oauth ????????? ????????? ?????? ( ???????????? ?????? )
                if (error.code === 'auth/account-exists-with-different-credential') { 
                    // //git oauth ????????? email get
                    const email = await axios.post(`${SERVER_GIT_URL}/auth/user/emails`, {token : localStorage.getItem("git_accesstoken")}).then((res) => {return res.data.data[0].email});
                    //???????????? ???????????? firebase ??? ????????? ??????.
                    const methods = await authService.fetchSignInMethodsForEmail(auth, email).then((methods)=>{return methods});
                    if(methods[0] === 'password'){
                        //???????????? ?????? ?????? open
                        showModal();
                    }
                } else {
                    let message = printError(error);
                    setHasError(true);
                    setErrorMsg(message);
                }
            }

    }
    const getFirebaseCredentialByProviderIdAndAccessToken = async (providerId, accesstoken) => {
        switch(providerId) {
            case authService.GoogleAuthProvider.PROVIDER_ID:
                return await authService.GoogleAuthProvider.credential(accesstoken);
            case authService.FacebookAuthProvider.PROVIDER_ID:
                return await authService.FacebookAuthProvider.credential(accesstoken);
            case authService.GithubAuthProvider.PROVIDER_ID:
                return await authService.GithubAuthProvider.credential(accesstoken);
            default :
                break;
        }
    }
    const pendingLogin = async (password) => {
        const auth = authService.getAuth();
        // console.log(password, ProviderEmail, ProviderAccessToken, ProviderId);
        const email = ProviderEmail;
        const accesstoken = ProviderAccessToken;
        const providerId = ProviderId;
        const credential = await getFirebaseCredentialByProviderIdAndAccessToken(providerId, accesstoken);
        // console.log(email, accesstoken, providerId, credential);
        try {
            await authService.signInWithEmailAndPassword(auth, email, password).catch((error)=>{throw error});
            if(auth.currentUser){
                //?????? ?????? ??????
                authService.linkWithCredential(auth.currentUser, credential).then( async (linkResult) => {
                    const linkCredential = authService.OAuthProvider.credentialFromResult(linkResult);
                    await authService.signInWithCredential(auth, linkCredential);
                    return true;
                })
            } 
        } catch ( error ){
            console.log(error);
            let message = printError(error);
            setModalError(true);
            setModalErrorMsg(message);
            return false;
        }

        // const SERVER_GIT_URL = `http://localhost:5000/api/login/github`;
        // const accesstoken = localStorage.getItem("git_accesstoken");//
        // const email = await axios.post(`${SERVER_GIT_URL}/auth/user/emails`, {token : accesstoken}).then((res) => {return res.data.data[0].email});//
        // const credential = await authService.GithubAuthProvider.credential(accesstoken);

        // //???????????? ??????????????? ?????? ???????????? ????????????
        // try {
        //     await authService.signInWithEmailAndPassword(auth, email, password).catch((error)=>{throw error});
        //     if(auth.currentUser){
        //         //?????? ?????? ??????
        //         authService.linkWithCredential(auth.currentUser, credential).then( async (linkResult) => {
        //             const linkCredential = authService.OAuthProvider.credentialFromResult(linkResult);
        //             await authService.signInWithCredential(auth, linkCredential);
        //             return true;
        //         })
        //     } 
        // } catch (error) {
        //     let message = printError(error);
        //     setModalError(true);
        //     setModalErrorMsg(message);
        //     return false;
        // }
    }
    const showModal = () => {
        setPromptUserPwd("");
        setModalOpen(true);
    }
    const handleCancle = () => {
        setPromptUserPwd("");
        setModalError(false);
        setModalErrorMsg("");
        setModalOpen(false);
    }
    return (
        <div>
            <form onSubmit={onSubmitHanlder}>
                <input 
                    name="email"
                    type="email" placeholder='Email' required 
                    value={Email}
                    onChange={onChangeHanlder}
                />
                <input 
                    name="password"
                    type="password" placeholder='Password' required
                    value={Password}
                    onChange={onChangeHanlder}    
                />
                { NewAccount &&
                    <input 
                        name="password_confirm"
                        type="password"
                        placeholder='PasswordConfirm'
                        required
                        onChange={onChangeHanlder}
                    />
                }
                <input 
                    type="submit"
                    value={NewAccount ? "Create Account" : "Log In"}
                    name="submit"
                    disabled={SubmitBtnLoading}
                />
            </form>
            <div>
                <label>????????????</label>
                <input 
                    type="checkbox" 
                    checked={SignInChkBox}
                    name="signIn"
                    value="signIn"
                    onChange={onChangeHanlder}
                />
            </div>
            {
                HasError &&
                <div>{ErrorMsg}</div>
            }
            
            <div>
                <button name="google" onClick={onClickHandler}>Continue with Google</button>
                <button name="github" onClick={onClickHandler}>Continue with Github</button>
                <button name="facebook" onClick={onClickHandler}>Continue with Facebook</button>
            </div>
            <div>
                <Popup 
                    title={ModalTitle}
                    userEmail={ProviderEmail}
                    visible={ModalOpen} 
                    handleCancle={handleCancle} 
                    onChangeHanlder={(e) => onChangeHanlder(e)}
                    onSubmitHanlderModal={(e) => onSubmitHanlderModal(e)}
                    PromptUserPwd={PromptUserPwd}
                    ModalError={ModalError}
                    ModalErrorMsg={ModalErrorMsg}
                ></Popup>
            </div>
        </div>
    )
}
export default Auth;