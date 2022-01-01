import React, {useEffect, useState} from 'react';
import { DB_NTWIEET_COLLECTION_NAME } from 'Config/DBServiceConfig';
import {dbService} from 'fbInstance';
import Ntweet from './Ntweet';
const {NtweetObject} = require('../models/Nwteet');

function Home(props){

    const [ Tweet, setTweet ] = useState("");
    const [ Tweets, setTweets ] = useState([]);
    const [ User, setUser ] = useState(props.User);

    useEffect(()=>{
        getNtweets();
    },[]);
    const onChangeHandler = (e) => {
        const { target : {name, value }} = e;
        if(name === "tweet") {
            setTweet(value);
        }
    }
    const onSubmitHanlder = (e) => {
        e.preventDefault();
        if(!User){
            return false;
        }
        let nwteetObj = new NtweetObject(Tweet, User.uid);
        addFirebaseCollection(nwteetObj.getObject());
        setTweet("");
    }
    const getNtweets = async () => {
        getFirebaseSnapshot();
    }
    
    // 한번만 접근.
    const getFirebaseCollectionDataArray = async (collection_name) => {
        switch(collection_name){
            case DB_NTWIEET_COLLECTION_NAME :
                let datas = [];
                const db = dbService.getFirestore();
                const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
                const query = dbService.query(collection, dbService.orderBy("createdAt","desc"));
                try {
                    const querySnapshot = await dbService.getDocs(query);
                    return querySnapshot;
                } catch (error) {
                    console.log(error);
                }
                return false;
            default :
            break;
        }
    }
    const getFirebaseSnapshot = () => {
        const db = dbService.getFirestore();
        const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
        const query = dbService.query(collection, dbService.orderBy("createdAt","desc"));
        const unsub = dbService.onSnapshot(query, (s) => {
            const newArray = s.docs.map((doc) => {
                return {
                    id : doc.id,
                    ...doc.data(),
                }
            })
            setTweets(newArray);
        });
        //접속 해제.
        return ()=>unsub();
    }
    const addFirebaseCollection = async (data) => {
        const db = dbService.getFirestore();
        const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
        try {
            await dbService.addDoc(collection, data);
        } catch (e) {
            console.log(e);
        }
    
    }
    // const onClickHanlder = async (creatorId, e) => {
    //     const {target : {name, value}} = e;
    //     let ntweetId = value;
    //     try {
    //         console.log('creatorId',creatorId)
    //         console.log(creatorId, User.uid);
    //         if(creatorId !== User.uid){
    //             throw new Error("등록한 사용자가 아닙니다.");
    //         }
    //         const db = dbService.getFirestore();
    //         const ntweet = await dbService.doc(db, DB_NTWIEET_COLLECTION_NAME, ntweetId);
    //         switch(name){
    //             case "delete" : 
    //                 return deleteTweet(ntweet);
    //             case "update" :
    //                 return updateTweet(ntweet);
    //             default :
    //                 break;
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // const deleteTweet = async (ntweet) => {
    //     console.log('delete', ntweet);
    //     try {
    //         await dbService.deleteDoc(ntweet);
    //         console.log(ntweet);
    //     } catch (error){
    //         throw error;
    //     }
    // }
    // const updateTweet = async (ntweet) => {
    //     console.log('update', ntweet);
    //     try {
    //         await dbService.updateDoc(ntweet, {
    //             text : 'updated',
    //         })
    //     } catch (error){
    //         throw error;
    //     }
    // }

    return (
        <div>
            <form onSubmit={onSubmitHanlder}>
                <input type="text" name="tweet" placeholder="What's on your mind?" maxLength={120} onChange={onChangeHandler} value={Tweet} />
                <input type="submit" value="Ntwieet" />
            </form>
            <div>
                {Tweets &&
                    Tweets.map((item) => {
                        return (
                            <Ntweet key={item.id} Ntweet={item} IsOwner={props.User.uid === item.creatorId} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Home;