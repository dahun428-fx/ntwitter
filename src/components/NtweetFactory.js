import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
const  NtweetObject = require('models/Ntweet');

function NtweetFactory(props){
    const [ User ] = useState(props.User);
    const [ Tweet, setTweet ] = useState("");
    const [ ImageSrc, setImageSrc ] = useState(null);
    const [ OriginFileName, setOriginFileName ] = useState("");

    const FileRef = useRef(null);


    const onChangeHandler = (e) => {
        const { target : {name, value, files }} = e;
        if(name === "tweet") {
            setTweet(value);
        }
        if(name === "tweet_image") {
            let file = files[0];
            imagePreview(file);
        }
    }
    const onSubmitHanlder = async (e) => {
        e.preventDefault();
        if(!User || !Tweet){
            return false;
        }
        let nwteetObj = new NtweetObject(Tweet, User.uid);
        let file = FileRef.current.files[0];
        let attachmentObject = '';
        if(file){
            attachmentObject = await nwteetObj.uploadFile(file, ImageSrc);
        }
        nwteetObj.setAttachment(attachmentObject);
        nwteetObj.createtweet(nwteetObj.getObject());
        setTweet("");
        clearImage();
    }
    const imagePreview = (file) => {
        let reader = new FileReader();
        let filename = file.name;
        reader.onloadend = () => {
            setImageSrc(reader.result);
            setOriginFileName(filename);
        }
        reader.readAsDataURL(file);
    }
    const clearImage = () => {
        if(FileRef.current){
            FileRef.current.value = null; 
        }
        setImageSrc("");
    }
    
    return (
        <>
            <form onSubmit={onSubmitHanlder}  className="factoryForm">
                <div className="factoryInput__container">
                <input type="text" name="tweet" className="factoryInput__input" placeholder="What's on your mind?" maxLength={120} onChange={onChangeHandler} value={Tweet} />
                <input type="submit" value="Ntwieet" className="factoryInput__arrow"/>
                </div>
                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input type="file" id="attach-file" 
                    style={{
                        opacity: 0,
                      }}
                name="tweet_image" accept="image/*" onChange={onChangeHandler} ref={FileRef}/>
            </form>
            <div style={{margin:'0 auto'}}>
                {ImageSrc && 
                    <div className='factoryForm__attachment'>
                        <h4>{OriginFileName}</h4>
                        <img src={ImageSrc} alt={OriginFileName} style={{
                        backgroundColor : 'white'
                        }} />
                        <div onClick={clearImage}  className="factoryForm__clear">
                            <span>Remove</span>
                            <FontAwesomeIcon icon={faTimes} />
                        </div>
                    </div>
                }
            </div>
        </>
    )
}
export default NtweetFactory;