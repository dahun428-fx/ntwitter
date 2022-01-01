import { DB_NTWIEET_COLLECTION_NAME } from 'Config/DBServiceConfig';
import { dbService } from 'fbInstance';
import React, { useEffect, useState } from 'react';

function Ntweet(props){
    const [ Ntweet, setNtweet ] = useState(props.Ntweet);
    const [ IsOwner, setIsOwner ] = useState(props.IsOwner);
    const [ Editing, setEditing ] = useState(false);
    const [ NewNwteetText, setNewNwteetText ] = useState(props.Ntweet.text);

    useEffect(()=>{
        setNtweet(props.Ntweet);
    },[props.Ntweet]);
    const toggleEditing = () => {
        setEditing((prev)=>!prev);
    }
    const onClickDelete = async (e) => {
        let ntweetId = Ntweet.id;
        let type = "delete";
        progressTweet(ntweetId, type);
    }
    const progressTweet = async (ntweetId, type) => {
        try {
            if(!IsOwner){
                throw new Error("등록한 사용자가 아닙니다.");
            }
            const db = dbService.getFirestore();
            const ntweet = await dbService.doc(db, DB_NTWIEET_COLLECTION_NAME, ntweetId);
            switch(type){
                case "delete" : 
                    return deleteTweet(ntweet);
                case "update" :
                    return updateTweet(ntweet);
                default :
                    break;
            }
    
        } catch (error) {
            console.log(error);
        }
        
    }
    const deleteTweet = async (ntweet) => {
        const ok = window.confirm("정말로 삭제하시겠습니까?");
        if(!ok) return false;
        try {
            await dbService.deleteDoc(ntweet);
        } catch (error){
            throw error;
        }
    }
    const updateTweet = async (ntweet) => {
        try {
            await dbService.updateDoc(ntweet, {
                text : NewNwteetText,
            })
        } catch (error){
            console.log(error);
        }
    }
    const onSubmitHanlder = async (e) => {
        e.preventDefault();
        let ntweetId = Ntweet.id; 
        let type = "update";
        progressTweet(ntweetId, type);
        setEditing(false);
    }
    const onChangeHanlder = (e) => {
        const { target : {name, value }} = e;
        if(name === "ntweet"){
            setNewNwteetText(value);
        }
    }
    return (
        <>
        { Ntweet &&
            <div>
                { Editing ? (
                    <>
                        <form onSubmit={onSubmitHanlder}>
                            <input
                                value={NewNwteetText} 
                                onChange={onChangeHanlder}
                                name="ntweet"
                                type="text"
                                required
                                placeholder='Edit your ntweets'
                            />
                            <button type='submit'>Update ntweet</button>
                        </form>
                        <button type='button' onClick={toggleEditing}>Cancle</button>
                    </>
                ) : (
                        <>
                            <h4>{Ntweet.text}</h4>
                            {
                                IsOwner &&
                                <>
                                    <button name="delete" value={Ntweet.id} onClick={onClickDelete}>delete Ntweet</button>
                                    <button onClick={toggleEditing}>eidt Ntweet</button>
                                </>
                            }
                        </>
                    )
                }
            </div>
        }
        </>
    );
}
export default Ntweet;