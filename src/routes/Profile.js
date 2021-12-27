import { authService } from 'fbInstance';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile(props){
    let navigate = useNavigate();
    const onClickHanlder = async () => {
        const auth = authService.getAuth();
        authService.signOut(auth).then(()=>{
            navigate("/");
        });
    }
    return (
        <>
            <button onClick={onClickHanlder}>Log out</button>
        </>
    )
}
export default Profile;