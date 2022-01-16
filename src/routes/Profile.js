import { authService } from 'fbInstance';
import { NtweetObject } from 'models/Nwteet';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ntweet from './Ntweet';

function Profile(props){
    const [ User, setUser ] = useState(props.User);
    const [ DisplayName, setDisplayName ] = useState(props.User.displayName ? props.User.displayName : "");
    const [ MyNtweets, setMyNtweets ] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        getMyNwteets();
    },[]);
    const getMyNwteets = async() => {
        const userId = User.uid;
        const ntweetObject = new NtweetObject();
        let list = await ntweetObject.getNweetsByUserId(userId);
        setMyNtweets(list);
    }

    const onClickHanlder = async () => {
        const auth = authService.getAuth();
        authService.signOut(auth).then(()=>{
            navigate("/");
        });
    }
    const onSumitProfile = async (e) => {
        e.preventDefault();
        if(User.displayName === DisplayName){
            return false;
        }
        if(!DisplayName){
            return false;
        }
        let ntweetObject = new NtweetObject();
        let updateUser = {
            displayName : DisplayName,
        }
        await ntweetObject.updateProfile(updateUser);
        props.refreshUser();
        return true;
    }
    const onChangeHandler = (e) => {
        const { target : {name, value }} = e;
        setDisplayName(value);
    }

    return (
        <>
        <div className="container">

            <form onSubmit={onSumitProfile} className="profileForm">
                <input
                    type="text" 
                    placeholder='Display Name' 
                    value={DisplayName}
                    onChange={onChangeHandler}
                    className="formInput"
                    />
                <input type="submit" 
                className="formBtn"
                style={{
                  marginTop: 10,
                }}
                value="Update Profile" />
            </form>
            <button onClick={onClickHanlder}  className="formBtn cancelBtn logOut" >Log out</button>
            {MyNtweets &&
                    MyNtweets.map((item) => {
                        return (
                            <Ntweet key={item.id} Ntweet={item} IsOwner={props.User.uid === item.creatorId} />
                            )
                        })
                    }
        </div>
        </>
    )
}
export default Profile;