import React, {useEffect, useState} from 'react';
import { DB_NTWIEET_COLLECTION_NAME } from 'Config/DBServiceConfig';
import {dbService} from 'fbInstance';

function Home(){

    const [ Tweet, setTweet ] = useState("");
    const [ Tweets, setTweets ] = useState([]);
    const [ IsLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        getTweets();
    }, []);
    const getTweets = async () => {
        const datas = await getFirebaseCollectionDataArray(DB_NTWIEET_COLLECTION_NAME);
        setTweets(datas);
        getFirebaseSnapshot(datas);
    }
    const onChangeHandler = (e) => {
        const { target : {name, value }} = e;
        if(name === "tweet") {
            setTweet(value);
        }
    }

    const onSubmitHanlder = (e) => {
        e.preventDefault();
        let data = {
            ntweet : Tweet,
            createdAt : Date.now(),
        }
        addFirebaseCollection(data);
        setTweet("");
    }
    const getFirebaseCollectionDataArray = async (collection_name) => {
        switch(collection_name){
            case DB_NTWIEET_COLLECTION_NAME :
                let datas = [];
                const db = dbService.getFirestore();
                const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
                const query = dbService.query(collection, dbService.orderBy("createdAt","desc"));
                try {
                    const querySnapshot = await dbService.getDocs(query);
                    querySnapshot.forEach((item) => {
                        datas.push(item.data());
                    });
                } catch (error) {
                    console.log(error);
                }
                return datas;
            default :
            break;
        }
    }
    const getFirebaseSnapshot = (datas) => {
        console.log('IsLoading : ',IsLoading);
        const db = dbService.getFirestore();
        const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
        const query = dbService.query(collection, dbService.orderBy("createdAt","desc"));
        dbService.onSnapshot(query, (s) => {
            // let datas = [];
           s.docChanges().forEach((change) => {
               if(change.type === "added" ){
                   let newData = change.doc.data();
                   console.log('newData',newData);
                   //    datas = datas.concat(newData);
                   //    console.log(newData);
                   //    let newDatas = [...Tweets].concat([...newData]);
                   //    console.log('newDatas',newDatas);
                   //    setTweets(newDatas);
                   // console.log('newData : ',newData);
                   // setTweets
                   //    return change.doc.data();
                   // datas.push(change.doc.data());
                }
            }) 
            console.log('datas', datas);
        //    return datas;
           //    setTweets([...Tweets,...datas]);
           //    console.log('tweets' , Tweets);
        //    console.log('datas', datas);
        //    setTweets(datas);
        //    console.log('tweets', tweets);
        //    setTweets(tweets.concat(datas));
        })
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

    return (
        <div>
            <form onSubmit={onSubmitHanlder}>
                <input type="text" name="tweet" placeholder="What's on your mind?" maxLength={120} onChange={onChangeHandler} value={Tweet} />
                <input type="submit" value="Ntwieet" />
            </form>
            <div>
                {Tweets &&
                    Tweets.map((item, index) => {
                        return (
                            <p key={index}>{item.ntweet}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Home;