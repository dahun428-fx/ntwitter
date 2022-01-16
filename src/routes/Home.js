import React, {useEffect, useState, useRef} from 'react';
import { DB_NTWIEET_COLLECTION_NAME } from 'Config/DBServiceConfig';
import {dbService } from 'fbInstance';
import Ntweet from './Ntweet';
import NtweetFactory from 'Components/NtweetFactory';

function Home(props){

    const [ Tweets, setTweets ] = useState([]);

    useEffect(()=>{
        getNtweets();
    },[]);
    

    const getNtweets = async () => {
       getFirebaseSnapshot();
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

    return (
        <div className="container">
            <NtweetFactory User={props.User}/>
            <div  style={{ marginTop: 30 }}>
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