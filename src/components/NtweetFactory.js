import { NtweetObject } from 'models/Nwteet';
import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
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
                <input type="file" id="attach-file" 
                    style={{
                        opacity: 0,
                      }}
                name="tweet_image" accept="image/*" onChange={onChangeHandler} ref={FileRef}/>
                <input type="submit" value="Ntwieet" className="factoryInput__arrow"/>
                </div>
            </form>
            <div>
                {ImageSrc && 
                    <div>
                        <h4>{OriginFileName}</h4>
                        <img src={ImageSrc} alt={OriginFileName} width="50px" height="50px" />
                        <button type='button' onClick={clearImage}  className="factoryForm__clear">Clear</button>
                    </div>
                }
            </div>
        </>
    )
}
export default NtweetFactory;